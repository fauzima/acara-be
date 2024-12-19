import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "../../prisma/generated/client";

export class EventController {
  async getEvents(req: Request, res: Response) {
    try {
      console.log(req.event);
      const { search, page = 1, limit = 3 } = req.query;
      const filter: Prisma.EventWhereInput = {};
      if (search) {
        filter.OR = [
          { title: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const countEvent = await prisma.event.aggregate({
        _count: { _all: true },
      });
      const total_page = Math.ceil(+countEvent._count._all / +limit);
      const events = await prisma.event.findMany({
        where: filter,
        orderBy: { id: "asc" },
        take: +limit,
        skip: +limit * (+page - 1),
      });
      res.status(200).send({ total_page, page, events });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getEventId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await prisma.event.findUnique({
        where: { id: id },
      });
      res.status(200).send({ event });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      await prisma.event.create({ data: req.body });
      res.status(201).send({ message: "Acara baru berhasil dibuat" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async editEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.event.update({ data: req.body, where: { id: id } });
      res.status(200).send({ message: "Acara berhasil diedit" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.event.delete({ where: { id: id } });
      res.status(200).send({ message: "Acara berhasil dihapus" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
