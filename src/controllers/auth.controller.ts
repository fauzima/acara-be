import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findPromotor, findRefCode, findUser } from "../services/user.service";
import { sign, verify } from "jsonwebtoken";
import { generator } from "../services/auth.service";
import { transporter } from "../services/mailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

export class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      let { password, confirmPassword, name, email, inputRef } = req.body;
      if (password != confirmPassword)
        throw { message: "Kata sandi tidak cocok" };

      const user = await findUser(name, email);
      if (user) throw { message: "Nama pengguna atau email sudah terdaftar" };

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      let newRefCode = generator();
      const refCode = await findRefCode(newRefCode);
      if (refCode) newRefCode = generator();

      if (inputRef) {
        const asd = await findRefCode(inputRef);
        if (!asd) throw { message: "Kode rujukan tidak ditemukan" };
      }

      if (inputRef == "") inputRef = null;

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          refCode: newRefCode,
          inputRef,
        },
      });

      const payload = { id: newUser.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });
      const link = `${process.env.BASE_URL_FE!}/user/verify/${token}`;

      const templatePath = path.join(
        __dirname,
        "../templates",
        "verifyUser.hbs"
      );
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ name, link });

      await transporter.sendMail({
        from: "acaradotcom@gmail.com",
        to: email,
        subject: "Selamat datang di Acara.com",
        html,
      });

      res.status(201).send({
        message: `Proses pendaftaran berhasil dilakukan. Cek email ${newUser.email} untuk verifikasi akun anda.`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw { message: "Akun tidak ditemukan" };
      if (!user.isVerified)
        throw {
          message:
            "Akun pengguna belum terverifikasi! Cek email anda untuk verifikasi akun anda.",
        };

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) throw { message: "Kata sandi salah" };

      const payload = { id: user.id, role: "user" };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      const acc = { ...user, role: "user" };
      res.status(200).send({
        message: "Proses login berhasil dilakukan",
        user: acc,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const verifiedUser: any = verify(token, process.env.JWT_KEY!);

      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.id },
      });

      if (user?.isVerified == false) {
        await prisma.user.update({
          data: { isVerified: true },
          where: { id: user?.id },
        });
        const refCode = user?.inputRef;
        console.log(refCode);

        if (refCode) {
          const refUser = await findRefCode(refCode);

          if (refUser) {
            // count the expiry date
            const now = new Date().getTime();
            const expire = new Date(now + 7776000000);

            // api posting referred user's point
            await prisma.userPoint.create({
              data: { userId: refUser.id, expiredAt: expire },
            });

            // api posting verified user's coupon
            await prisma.userCoupon.create({
              data: { userId: verifiedUser.id, expiredAt: expire },
            });
          }
        }
      }

      if (user?.isVerified == true) {
        throw { message: "Akun sudah terverifikasi" };
      }

      res.status(200).send({ message: "Proses verifikasi berhasil dilakukan" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async registerPromotor(req: Request, res: Response) {
    try {
      const { password, confirmPassword, name, email } = req.body;
      if (password != confirmPassword) throw { message: "Kata sandi salah" };

      const promotor = await findPromotor(name, email);
      if (promotor) throw { message: "Nama atau email sudah terdaftar" };

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const newProm = await prisma.promotor.create({
        data: {
          name,
          email,
          password: hashPassword,
        },
      });

      const payload = { id: newProm.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });
      const link = `${process.env.BASE_URL_FE!}/promotor/verify/${token}`;

      const templatePath = path.join(
        __dirname,
        "../templates",
        "verifyProm.hbs"
      );
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ name, link });

      await transporter.sendMail({
        from: "acaradotcom@gmail.com",
        to: email,
        subject: "Selamat datang di Acara.com",
        html,
      });

      res.status(201).send({
        message: `Proses pendaftaran berhasil dilakukan. Cek email ${newProm.email} untuk verifikasi akun anda.`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async loginPromotor(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const promotor = await findPromotor(data, data);

      if (!promotor) throw { message: "Akun promotor tidak ditemukan" };
      if (!promotor.isVerified)
        throw {
          message:
            "Akun belum terverifikasi! Cek email anda untuk verifikasi akun anda.",
        };

      const isValidPassword = await compare(password, promotor.password);
      if (!isValidPassword) throw { message: "Kata sandi salah" };

      const payload = { id: promotor.id, role: "promotor" };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      const acc = { ...promotor, role: "promotor" };
      res.status(200).send({
        message: "Proses login berhasil dilakukan",
        promotor: acc,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async verifyProm(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const verifiedProm: any = verify(token, process.env.JWT_KEY!);

      const prom = await prisma.promotor.findUnique({
        where: { id: verifiedProm.id },
      });

      if (prom?.isVerified == false) {
        await prisma.promotor.update({
          data: { isVerified: true },
          where: { id: verifiedProm.id },
        });
      }

      if (prom?.isVerified == true) {
        throw { message: "Akun sudah terverifikasi" };
      }

      res.status(200).send({ message: "Proses verifikasi berhasil dilakukan" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getSession(req: Request, res: Response) {
    try {
      const role = req.acc?.role;

      let acc: any = {};

      if (role == "user") {
        acc = await prisma.user.findUnique({
          where: { id: req.acc?.id },
        });
      } else if (role == "promotor") {
        acc = await prisma.promotor.findUnique({
          where: { id: req.acc?.id },
        });
      }
      acc.role = role;

      res.status(200).send({ acc });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
