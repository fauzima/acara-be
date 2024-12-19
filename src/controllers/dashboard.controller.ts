import { Request, Response } from "express";
import prisma from "../prisma";

export class DashboardController {
  async getSummaries(req: Request, res: Response) {
    try {
      // dapetin id
      const id = req.acc?.id

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
        .send([ totalEvents, totalOrders, totalProfit, totalTickets ]);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
