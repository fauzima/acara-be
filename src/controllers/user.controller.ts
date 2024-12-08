import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class UserController {
  // method for getting all users and their data
  async getUsers(req: Request, res: Response) {
    try {
      console.log(req.user);

      // querying for searching with pagination
      const { search, page = 1, limit = 3 } = req.query;

      // variable for containing filter(s)
      const filter: Prisma.UserWhereInput = {};

      // filter conditioning based on username or email
      if (search) {
        filter.OR = [
          {
            username: { contains: search as string, mode: "insensitive" },
          },
          {
            email: { contains: search as string, mode: "insensitive" },
          },
        ];
      }

      // counting the total of all of the users
      const countUser = await prisma.user.aggregate({ _count: { _all: true } });

      // dividing number of users by the limit per page
      const total_page = Math.ceil(+countUser._count._all / +limit);

      // api getter
      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { createdAt: "asc" },
        take: +limit,
        skip: +limit * (+page - 1),
      });

      // response messages
      res
        .status(200)
        .send({ total_page: total_page, page: page, users: users });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  // method for getting a user's data by its id
  async getUserbyId(req: Request, res: Response) {
    try {
      // id as param request
      const { id } = req.params;

      // api getter
      const users = await prisma.user.findUnique({
        where: { id: id },
      });

      // response messages
      res.status(200).send({ users });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  // method for adding a new user
  async postUser(req: Request, res: Response) {
    try {
      // api poster with body as request
      await prisma.user.create({ data: req.body });

      // response messages
      res.status(201).send({ message: "Pengguna baru berhasil dibuat! ✅" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  // method for editing a user's data by its id
  async patchUser(req: Request, res: Response) {
    try {
      // id as param request
      const { id } = req.params;

      // api patcher with body as request
      await prisma.user.update({ data: req.body, where: { id: id } });

      // response messages
      res.status(200).send({ message: "Pengguna berhasil diedit! ✅" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  // method for deleting a user by its id
  async deleteUser(req: Request, res: Response) {
    try {
      // id as param request
      const { id } = req.params;

      // api deleter with body as request
      await prisma.user.delete({ where: { id: id } });

      // response messages
      res.status(200).send({ message: "Pengguna berhasil dihapus! ✅" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
