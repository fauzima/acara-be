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
      let { password, confirmPassword, username, email, inputRef } = req.body;
      if (password != confirmPassword) throw {message:"Password not match"};

      const user = await findUser(username, email);
      if (user) throw {message:"username or email has been used"};

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      let newRefCode = generator();
      const refCode = await findRefCode(newRefCode);
      if (refCode) newRefCode = generator();

      if (inputRef) {
        const asd = await findRefCode(inputRef);
        if (!asd) throw "gada refcode di database";
      }

      if (inputRef == "") inputRef = null;

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          refCode: newRefCode,
          inputRef,
        },
      });

      const payload = { id: newUser.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });
      const link = `http://localhost:3000/user/verify/${token}`;

      const templatePath = path.join(__dirname, "../templates", "verify.hbs");
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ username, link });

      await transporter.sendMail({
        from: "ahady1105@gmail.com",
        to: email,
        subject: "welcome to Acara.com",
        html,
      });

      res.status(201).send({message:"Register Successfully"});
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw {message:"Account not found"};
      // if (user.isSuspend) throw { message: "Account Suspended!" };
      if (!user.isVerify) throw { message: "Account Not Verify!" };

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) throw "Incorrect Password";

      const payload = { id: user.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      res.status(200).cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      }).send({
        message: "Login Successfully",
        user,
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
      await prisma.user.update({
        data: { isVerify: true },
        where: { id: verifiedUser.id },
      });

      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.id },
      });
      const refCode = user?.inputRef;
      console.log(refCode);

      if (refCode) {
        const refUser = await findRefCode(refCode);

        if (refUser) {
          // count the expiry date
          const now = new Date().getTime();
          const expire = new Date(now + 2592000000);

          // api posting referred user's point
          await prisma.user_Point.create({
            data: { userId: refUser.id, expireAt: expire },
          });

          // api posting verified user's coupon
          await prisma.user_Coupon.create({
            data: { userId: verifiedUser.id, expireAt: expire },
          });
        }
      }

      res.status(200).send({message:"Verify successfully"})
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async registerPromotor(req: Request, res: Response) {
    try {
      const { password, confirmPassword, name, email } = req.body;
      if (password != confirmPassword) throw {message:"Password not match"};

      const promotor = await findPromotor(name, email);
      if (promotor) throw {message:"name or email has been used"};

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
      const link = `http://localhost:3000/organizer/verify/${token}`;

      const templatePath = path.join(__dirname, "../templates", "verifyProm.hbs");
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ name, link });

      await transporter.sendMail({
        from: "ahady1105@gmail.com",
        to: email,
        subject: "welcome to Acara.com",
        html,
      });

      

      res.status(201).send({message:"Register Successfully"});
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async loginPromotor(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const promotor = await findPromotor(data, data);

      if (!promotor) throw {message:"Account not found"};
      if (!promotor.isVerify) throw { message: "Account Not Verify!" }

      const isValidPassword = await compare(password, promotor.password);
      if (!isValidPassword) throw {message:"Incorrect Password"};

      const payload = { id: promotor.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      res.status(200).cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      }).send({
        message: "Login Successfully",
        promotor,
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
      await prisma.promotor.update({
        data: { isVerify: true },
        where: { id: verifiedProm.id },
      });

      res.status(200).send({message:"Verify successfully"})
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
