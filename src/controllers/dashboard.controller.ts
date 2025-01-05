import { Request, Response } from "express";
import prisma from "../prisma";
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
      year: string;
      event_active: number;
    }
    try {
      const eventsDate = await prisma.event.findMany({
        where: { promotorId: id },
        select: { startDate: true },
      });
      let arrYear = [];
      let chartData: IDataEvent[] = [];
      for (const item of eventsDate) {
        const year = new Date(item.startDate).getFullYear();
        arrYear.push(year);
      }
      arrYear.sort((a, b) => a - b);
      // const totalYear = arrYear.length;

      for (const item of arrYear) {
        if (!JSON.stringify(chartData).includes(`${item}`)) {
          chartData.push({ year: `${item}`, event_active: 1 });
        } else {
          chartData[chartData.length - 1].event_active += 1;
        }
      }

      console.log(chartData);
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
          expiredAt: true,
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
        const month = new Date(item.expiredAt).getMonth();
        let qty = 0;
        for (const quantity of item.OrderDetails) {
          qty += quantity.qty;
        }
        amountTicket.push({ month, qty });
        amountTicket.sort((a, b) => a.month - b.month);
      }
      for (const item of amountTicket) {
        if (!JSON.stringify(chartData).includes(FormatMonth(item.month))) {
          chartData.push({
            month: FormatMonth(item.month),
            total_ticket: item.qty,
          });
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

  async getTransaction(req: Request, res: Response) {
    try {
      const id = req.acc?.id;
      const profit = await prisma.order.findMany({
        where: { status: "Paid", event: { is: { promotorId: id } } },
        select: { finalPrice: true, expiredAt: true },
      });

      res.status(200).send({ result: profit });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
