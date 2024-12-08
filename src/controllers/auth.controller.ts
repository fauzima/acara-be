import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from "bcrypt";
import { findbyRefCode, findUniqueUser } from "../services/user.sevice";
import { sign, verify } from "jsonwebtoken";
import { generator, transporter } from "../services/auth.service";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

export class AuthController {

  // method for user registration
  async registerUser(req: Request, res: Response) {
    try {
      // register request/input
      const {
        username,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        dob,
        gender,
        inputRef,
      } = req.body;

      // password confirmator
      if (password != confirmPassword)
        throw { message: "Kata sandi tidak cocok!" };

      // identical username/email checker
      const user = await findUniqueUser(username, email);
      if (user) throw { message: "Nama pengguna atau email sudah terdaftar!" };

      // password encryptor
      const salt = await genSalt();
      const hashPass = await hash(password, salt);

      // unique referral code generator
      let newRefCode = generator();
      const refCode = await findbyRefCode(newRefCode);
      if (refCode) newRefCode = generator();

      // api poster
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashPass,
          firstName,
          lastName,
          dob,
          gender,
          refCode: newRefCode,
          inputRef,
        },
      });

      // verification token generator
      const payload = { id: newUser.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "10m" });

      // verification link
      const link = `http://localhost:1337/verify/${token}`;

      // handlebars email template declaration
      const templatePath = path.join(__dirname, "../templates", "verify.hbs");
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ username, link: link });

      // emailer
      await transporter.sendMail({
        from: "fauzimakarimsiregar@gmail.com",
        to: email,
        subject: "Welcome to The Blog",
        html,
      });

      // response messages
      res
        .status(201)
        .send({ message: "Proses pendaftaran berhasil dilakukan! ✅" });
    } catch (err) {
      res.status(400).send(err);
    }
  }

  // method for user login
  async logUser(req: Request, res: Response) {
    try {
      // user's log in request/input
      const { data, password } = req.body;
      const user = await findUniqueUser(data, data);

      // user's verified status checker
      if (!user) throw { message: "Pengguna tidak ditemukan!" };
      if (!user.isVerified) throw { message: "Pengguna belum terverifikasi!" };

      // password checker
      const isPassValid = await compare(password, user.password);
      if (!isPassValid) throw { message: "Kata sandi salah!" };

      // log in token generator
      const payload = { id: user.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      // response messages
      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 86400000,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        })
        .send({ message: "Proses masuk berhasil dilakukan! ✅", user });
    } catch (err) {
      res.status(400).send(err);
    }
  }

  // method for user verification
  async verifyUser(req: Request, res: Response) {
    try {
      // verification token as param
      const { token } = req.params;

      // verificator
      const verifiedUser: any = verify(token, process.env.JWT_KEY!);
      await prisma.user.update({
        data: { isVerified: true },
        where: { id: verifiedUser.id },
      });

      // find the referred user if newly registered user was inputting a referral code
      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.id },
      });
      const refCode = user?.inputRef;
      console.log(refCode);

      if (refCode) {
        const refUser = await findbyRefCode(refCode);

        if (refUser) {
          // count the expiry date
          const now = new Date().getTime();
          const expire = new Date(now + 2592000000);

          // api posting referred user's point
          await prisma.usersPoint.create({
            data: { userId: refUser.id, expiredAt: expire },
          });

          // api posting verified user's coupon
          await prisma.usersCoupon.create({
            data: { userId: verifiedUser.id, expiredAt: expire },
          });
        }
      }

      // response messages
      res
        .status(200)
        .send({ message: "Proses verifikasi pengguna berhasil dilakukan! ✅" });
    } catch (err) {
      res.status(400).send(err);
    }
  }
}
