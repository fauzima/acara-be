import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class PromotorController {
  async getPromotors(req: Request, res: Response) {
    try {
      console.log(req.promotor);
      const { search, page = 1, limit = 3 } = req.query;
      const filter: Prisma.PromotorWhereInput = {};
      if (search) {
        filter.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const countPromotor = await prisma.promotor.aggregate({ _count: { _all: true } });
      const total_page = Math.ceil(+countPromotor._count._all / +limit);
      const promotors = await prisma.promotor.findMany({
        where: filter,
        orderBy: { id: "asc" },
        take: +limit,
        skip: +limit * (+page - 1),
      });
      res.status(200).send({ total_page, page, promotors });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getPromotorId(req: Request, res: Response) {
    try {
      const promotor = await prisma.promotor.findUnique({
        where: { id: `${req.promotor?.id}` },
      });
      res.status(200).send({ promotor });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createPromotor(req: Request, res: Response) {
    try {
      await prisma.promotor.create({ data: req.body });
      res.status(201).send("Promotor created");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async editPromotor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.promotor.update({ data: req.body, where: { id: id } });
      res.status(200).send("Promotor updated");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async deletePromotor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.promotor.delete({ where: { id: id } });
      res.status(200).send("Promotor deleted");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
