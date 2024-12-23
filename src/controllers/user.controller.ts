import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "../../prisma/generated/client";

export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      console.log(req.acc);
      const { search, page = 1, limit = 3 } = req.query;
      const filter: Prisma.UserWhereInput = {};
      if (search) {
        filter.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const countUser = await prisma.user.aggregate({ _count: { _all: true } });
      const total_page = Math.ceil(+countUser._count._all / +limit);
      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { id: "asc" },
        take: +limit,
        skip: +limit * (+page - 1),
      });
      res.status(200).send({ total_page, page, users });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: `${req.acc?.id}` },
      });
      res.status(200).send({ user });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      await prisma.user.create({ data: req.body });
      res.status(201).send({ message: "Akun pengguna baru berhasil dibuat" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.update({ data: req.body, where: { id: id } });
      res.status(200).send({ message: "Akun pengguna berhasil diedit" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: id } });
      res.status(200).send({ message: "Akun pengguna berhasil dihapus" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
