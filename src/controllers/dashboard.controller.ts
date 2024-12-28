import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { FormatMonth } from "../helpers/formatMonth";

export class DashboardController {
  async getSummaries(req: Request, res: Response) {
    try {
      // dapetin id
      const id = req.acc?.id;

      // dapetin total event
      const events = await prisma.event.findMany({
        where: { promotorId: id },
      });
      const totalEvents: number = events.length;

      // dapetin total transaksi
      const order = await prisma.order.findMany({
        where: { status: "Paid", event: { is: { promotorId: id } } },
        select: { finalPrice: true },
      });
      const totalOrders: number = order.length;

      //dapetin total penjualan
      const totalProfit: number = order.reduce(
        (n, { finalPrice }) => n + finalPrice,
        0
      );

      //dapetin total tiket terjual
      const ticket = await prisma.orderDetails.findMany({
        where: {
          order: {
            is: { status: "Paid", event: { is: { promotorId: id } } },
          },
        },
        select: { qty: true },
      });
      const totalTickets: number = ticket.reduce((n, { qty }) => n + qty, 0);

      res
        .status(200)
        .send([totalEvents, totalOrders, totalProfit, totalTickets]);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getEventAktif(req: Request, res: Response) {
    const id = req.acc?.id;
    interface IDataEvent {
      month: string;
      event_active: number;
    }
    try {
      const events = await prisma.event.findMany({
        where: { promotorId: id },
      });
      let arrMonth = [];
      let chartData: IDataEvent[] = [];
      for (const item of events) {
        const month = new Date(item.date).getMonth();
        arrMonth.push(month);
        arrMonth.sort((a, b) => a - b);
      }
      for (const item of arrMonth) {
        if (!JSON.stringify(chartData).includes(FormatMonth(item))) {
          chartData.push({ month: FormatMonth(item), event_active: 1 });
        } else {
          chartData[chartData.length - 1].event_active += 1;
        }
      }
      console.log(chartData)
      res.status(200).send({ result: chartData });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getTicket(req: Request, res: Response) {
    interface IDataTicket {
      month: string;
      total_ticket: number;
    }
    try {
      const id = req.acc?.id;
      const ticket = await prisma.order.findMany({
        where: {
          status: "Paid",
          event: {
            promotorId: id,
          },
        },
        select: {
          createdAt: true,
          OrderDetails: {
            select: {
              qty: true,
            },
          },
        },
      });
      let amountTicket = [];
      let chartData: IDataTicket[] = [];
      for (const item of ticket) {
        const month = new Date(item.createdAt).getMonth();
        let qty = 0;
        for (const quantity of item.OrderDetails) {
          qty += quantity.qty;
        }
        amountTicket.push({ month, qty });
        amountTicket.sort((a, b) => a.month - b.month);
      }
      for (const item of amountTicket) {
        if (!JSON.stringify(chartData).includes(FormatMonth(item.month))) {
          chartData.push({ month: FormatMonth(item.month), total_ticket: item.qty });
        } else {
          chartData[chartData.length - 1].total_ticket += item.qty;
        }
      }
      console.log(chartData);
      res.status(200).send({ result: chartData });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
