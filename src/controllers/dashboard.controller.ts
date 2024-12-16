import { Request, Response } from "express";
import prisma from "../prisma";

export class DashboardController {
  async getActiveEvents(req: Request, res: Response) {
    try {
       const {id} = req.body

      const data = await prisma.event.aggregate({ where: { id: id }, _count: {_all:true} });
      res.status(200).send({ data: data });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  async getTotalTransaction(req: Request, res: Response) {
    try {
      const id = req.acc?.id;

      const data = await prisma.event.findMany({ where: { id: id } });
      res.status(200).send({ data: data });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  async getTotalTicket(req: Request, res: Response) {
    try {
      const id = req.acc?.id;

      const data = await prisma.event.findMany({ where: { id: id } });
      res.status(200).send({ data: data });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  async getProfit(req: Request, res: Response) {
    try {
      const id = req.acc?.id;

      const data = await prisma.event.findMany({ where: { id: id } });
      res.status(200).send({ data: data });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  async getTotalAtendees(req: Request, res: Response) {
    try {
      const id = req.acc?.id;

      const data = await prisma.event.findMany({ where: { id: id } });
      res.status(200).send({ data: data });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
