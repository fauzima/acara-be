import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../services/cloudinary";
import { IEvent, ITicket, ITicketReq } from "../types/types";
import { EventCategory, EventLocation } from "../../prisma/generated/client";

export class EventController {
  async getEvents(req: Request, res: Response) {
    try {
      const {
        title,
        category,
        location,
        promotor,
        page = "1",
        limit = "6",
        type = "upcoming",
      } = req.query;

      const filter: any[] = [];

      if (title) {
        filter.push({
          title: { contains: title as string, mode: "insensitive" },
        });
      }
      if (category) {
        filter.push({
          category: { equals: category as EventCategory },
        });
      }
      if (location) {
        filter.push({
          location: { equals: location as EventLocation },
        });
      }
      if (promotor) {
        filter.push({
          promotor: { name: { contains: promotor as string } },
        });
      }
      if (type == "upcoming") {
        filter.push({
          startDate: { gte: new Date() },
        });
      }

      if (type == "previous") {
        filter.push({
          startDate: { lte: new Date() },
        });
      }

      const countEvents = await prisma.event.aggregate({
        where: { AND: filter },
        _count: { _all: true },
      });

      const totalPage = Math.ceil(+countEvents._count._all / +limit);

      const data = await prisma.event.findMany({
        where: { AND: filter, startDate: {} },
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          title: true,
          category: true,
          thumbnail: true,
          startDate: true,
          promotor: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          Ticket: {
            select: {
              price: true,
            },
            orderBy: {
              price: "asc",
            },
            take: 1,
          },
        },
        take: +limit,
        skip: +limit * (+page - 1),
      });

      const events = [];

      for (const item of data) {
        const price = Number(item.Ticket[0].price);
        events.push({
          id: item.id,
          title: item.title,
          category: item.category as string,
          thumbnail: item.thumbnail as string,
          startDate: item.startDate,
          price: price,
          promotorId: item.promotor.id,
          avatar: item.promotor.avatar,
          name: item.promotor.name,
        });
      }

      res.status(200).send({ events, totalPage, page });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getEventId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await prisma.event.findUnique({
        where: { id: id },
        select: {
          id: true,
          title: true,
          category: true,
          startDate: true,
          endDate: true,
          thumbnail: true,
          location: true,
          venue: true,
          desc: true,
          promotor: {
            select: {
              name: true,
              avatar: true,
            },
          },
          Ticket: {
            select: {
              category: true,
              price: true,
              startDate: true,
              endDate: true,
              remainingSeats: true,
              seats: true,
              desc: true,
            },
          },
        },
      });

      const Ticket = [];

      for (const item of data?.Ticket!) {
        const price = Number(item.price);
        Ticket.push({
          category: item.category,
          price: price,
          startDate: item.startDate,
          endDate: item.endDate,
          seats: item.seats,
          remainingSeats: item.remainingSeats,
          desc: item.desc,
        });
      }

      const minPrice = Ticket.sort((a, b) => a.price - b.price)[0].price;

      const earliestTicket = [...Ticket].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0].startDate;

      const latestTicket = [...Ticket].sort(
        (a, b) =>
          new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      )[0].endDate;

      res.status(200).send({
        event: {
          id: data?.id!,
          title: data?.title!,
          category: data?.category! as string,
          startDate: data?.startDate!,
          endDate: data?.endDate!,
          thumbnail: data?.thumbnail!,
          minPrice: minPrice,
          earliestTicket: earliestTicket,
          latestTicket: latestTicket,
          location: data?.location! as string,
          venue: data?.venue!,
          desc: data?.desc!,
          name: data?.promotor.name!,
          avatar: data?.promotor.avatar!,
          Ticket: Ticket,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      // nerima request file unggah(file type blob dalam bentuk formdata)
      if (!req.file) throw { message: "Gambar/poster/banner kosong!" };
      const { secure_url } = await cloudinaryUpload(req.file, "event");

      // req body json formdata (karena Ticket adalah array jadi perlu di parse)
      const {
        title,
        desc,
        category,
        location,
        venue,
        startDate,
        endDate,
        Ticket,
      }: IEvent = req.body;

      // penjaga untuk tidak bisa mengakses selain promotor
      const accId = req.acc;
      if (!accId || accId.role == "user") {
        throw "Tidak ada izin untuk mengakses!";
      }

      const parsedTicket: ITicketReq[] = JSON.parse(Ticket);

      // variabel penampung buat format string (request) jadi date
      const formattedStartDate = new Date(startDate);
      const formattedEndDate = new Date(endDate);

      // langkah yang sama tapi karena Ticketnya array jadi harus diloop
      const formattedTicket: ITicket[] = [];

      for (const item of parsedTicket) {
        const formattedStartDate = new Date(item.startDate);
        const formattedEndDate = new Date(item.endDate);

        formattedTicket.push({
          category: item.ticketCategory,
          desc: item.ticketDesc,
          seats: parseInt(item.seats),
          remainingSeats: parseInt(item.seats),
          price: parseInt(item.price),
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      }

      // create prisma
      await prisma.event.create({
        data: {
          title,
          desc,
          category,
          location,
          venue,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          thumbnail: secure_url,
          promotorId: req.acc?.id!,
          Ticket: {
            create: formattedTicket,
          },
        },
      });

      res.status(201).send({ message: `Acara baru ${title} berhasil dibuat` });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
