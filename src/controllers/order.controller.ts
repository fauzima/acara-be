import { Request, Response } from "express";
import prisma from "../prisma";
import axios from "axios";

//deklarasi tipe untuk request
interface IOrderDetailsReq {
  qty: string;
  ticketId: string;
}

interface IOrderDetails {
  qty: number;
  ticketId: string;
}

interface IOrder {
  totalPrice: string;
  finalPrice: string;
  OrderDetails: IOrderDetailsReq[];
  UserPoint?: string[];
  UserCoupon?: string;
}

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      // dapetin id dari params
      const { id } = req.params;

      // kalkulasi totalPrice sama finalPrice udah dilakuin di front end, di Order details ada informasi qty untuk tiap tiket (bisa 1 kategori tiket aja atau banyak)
      const {
        totalPrice,
        finalPrice,
        OrderDetails,
        UserCoupon,
        UserPoint,
      }: IOrder = req.body;

      // bikin timer buat kadaluarsa order
      const expiredAt = new Date(new Date().getTime() + 3600000);

      //ngeformat qty ditiap orderDetails dari jsonstring jadi numnber
      const formattedOrderDetails: IOrderDetails[] = [];

      for (const item of OrderDetails) {
        formattedOrderDetails.push({
          qty: +item.qty,
          ticketId: item.ticketId,
        });
      }

      //deklarasi dan create order
      const order: any = await prisma.order.create({
        data: {
          id: +id,
          totalPrice: +totalPrice,
          finalPrice: +finalPrice,
          expiredAt,
          userId: req.acc?.id!,
          eventId: id,
          OrderDetails: {
            create: formattedOrderDetails,
          },
        },
      });

      // ngurangin sementara sisa jatah ticket di tiap record ticket yang direferensiin
      for (const item of formattedOrderDetails) {
        await prisma.ticket.update({
          data: { remainingSeats: { decrement: item.qty } },
          where: { id: item.ticketId },
        });
      }

      // referensiin sementara userpoint dan usercoupon ke order
      if (UserPoint) {
        for (const item in UserPoint) {
          await prisma.userPoint.update({
            data: { orderId: order.id },
            where: { id: UserCoupon },
          });
        }
      }

      if (UserCoupon) {
        await prisma.userCoupon.update({
          data: { orderId: order.id },
          where: { id: UserCoupon },
        });
      }

      // siapin body buat ke api midtrans
      const body = {
        transaction_details: {
          order_id: order.id,
          gross_amount: finalPrice,
        },
        expiry: {
          unit: "minutes",
          duration: 60,
        },
      };

      // kirim request ke api midtrans
      const { data } = await axios.post(
        "https://app.sandbox.midtrans.com/snap/v1/transactions",
        body,
        {
          headers: {
            Authorization:
              "Basic U0ItTWlkLXNlcnZlci1VZVQwaGR2ZzB2elZreXR6ZDFHX2l6ZXM6",
          },
        }
      );

      //res status
      res.status(201).send({
        message: "Pesanan berhasil dibuat!",
        data,
        order,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getOrderbyId(req: Request, res: Response) {
    try {
      // buat nampilin informasi tentang order
      const { id } = req.params;
      const event = await prisma.order.findUnique({
        where: { id: +id },
      });
      res.status(200).send({ event });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      // terima notif pembayaran dari midtrans
      const { transaction_status, order_id } = req.body;

      // flow jika pembayaran lunas sebelum expire
      if (transaction_status == "settlement") {
        // update order jadi paid
        await prisma.order.update({
          data: { status: "Paid" },
          where: { id: +order_id },
        });

        // update status poin dan kupon
        await prisma.userPoint.updateMany({
          data: { status: "isRedeemed" },
          where: { orderId: +order_id },
        });

        await prisma.userCoupon.updateMany({
          data: { status: "isRedeemed" },
          where: { orderId: +order_id },
        });

        // cari orderDetails dari order buat bikin attendeeTickets
        const orderDetails = await prisma.orderDetails.findMany({
          where: { orderId: +order_id },
          select: { id: true, qty: true, ticketId: true },
        });

        for (const item of orderDetails) {
          for (let i = 0; i <= item.qty; i++) {
            await prisma.attendeeTicket.create({
              data: {
                orderDetailsId: item.id,
              },
            });
          }
        }
      }

      // flow jika pembayaran belum lunas setelah expire
      if (transaction_status == "canceled") {
        // update order jadi expired
        await prisma.order.update({
          data: { status: "Expired" },
          where: { id: +order_id },
        });

        //putusin relasi poin dan kupon dari order
        await prisma.userPoint.updateMany({
          data: { orderId: null },
          where: { orderId: +order_id },
        });

        await prisma.userCoupon.updateMany({
          data: { orderId: null },
          where: { orderId: +order_id },
        });

        //reset jatah tiket di record ticket dari tiap orderDetails
        const orderDetails = await prisma.orderDetails.findMany({
          where: { orderId: +order_id },
          select: { id: true, qty: true, ticketId: true },
        });

        for (const item of orderDetails) {
          await prisma.ticket.update({
            data: { remainingSeats: { increment: item.qty } },
            where: { id: item.ticketId },
          });
        }
      }

      res.status(200).send({ message: "Order updated" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
