"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const axios_1 = __importDefault(require("axios"));
class OrderController {
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // dapetin id dari params
                const { id } = req.params;
                // kalkulasi totalPrice sama finalPrice udah dilakuin di front end, di Order details ada informasi qty untuk tiap tiket (bisa 1 kategori tiket aja atau banyak)
                const { totalPrice, finalPrice, OrderDetails, UserCoupon, UserPoint, } = req.body;
                // penjaga untuk tidak bisa mengakses selain pembeli
                const accId = req.acc;
                if (!accId || accId.role == "promotor") {
                    throw { message: "Tidak ada izin untuk mengakses!" };
                }
                // bikin timer buat kadaluarsa order
                const expiredAt = new Date(new Date().getTime() + 3600000);
                //ngeformat qty ditiap orderDetails dari jsonstring jadi numnber
                const formattedOrderDetails = [];
                for (const item of OrderDetails) {
                    const ticket = yield prisma_1.default.ticket.findUnique({
                        where: { id: item.ticketId },
                    });
                    if (+item.qty >= (ticket === null || ticket === void 0 ? void 0 : ticket.remainingSeats)) {
                        throw {
                            message: `Jatah tiket ${ticket === null || ticket === void 0 ? void 0 : ticket.category} sudah tidak cukup!`,
                        };
                    }
                    formattedOrderDetails.push({
                        qty: +item.qty,
                        ticketId: item.ticketId,
                    });
                }
                //deklarasi create order
                const order = yield prisma_1.default.order.create({
                    data: {
                        totalPrice: +totalPrice,
                        finalPrice: +finalPrice,
                        expiredAt: expiredAt,
                        userId: accId.id,
                        eventId: id,
                        OrderDetails: {
                            create: formattedOrderDetails,
                        },
                    },
                });
                // ngurangin sementara sisa jatah ticket di tiap record ticket yang direferensiin
                for (const item of formattedOrderDetails) {
                    yield prisma_1.default.ticket.update({
                        data: { remainingSeats: { decrement: item.qty } },
                        where: { id: item.ticketId },
                    });
                }
                // referensiin sementara userpoint dan usercoupon ke order
                if (UserPoint) {
                    for (const item in UserPoint) {
                        yield prisma_1.default.userPoint.update({
                            data: { orderId: order.id },
                            where: { id: UserCoupon },
                        });
                    }
                }
                if (UserCoupon) {
                    yield prisma_1.default.userCoupon.update({
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
                const { data } = yield axios_1.default.post("https://app.sandbox.midtrans.com/snap/v1/transactions", body, {
                    headers: {
                        Authorization: "Basic U0ItTWlkLXNlcnZlci1VZVQwaGR2ZzB2elZreXR6ZDFHX2l6ZXM6",
                    },
                });
                //res status
                res.status(201).send({
                    message: "Pesanan berhasil dibuat!",
                    data,
                    order,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getOrderbyId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // buat nampilin informasi tentang order
                const { id } = req.params;
                const event = yield prisma_1.default.order.findUnique({
                    where: { id: +id },
                });
                res.status(200).send({ event });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // terima notif pembayaran dari midtrans
                const { transaction_status, order_id } = req.body;
                const order = yield prisma_1.default.order.findUnique({
                    where: { id: +order_id },
                });
                // flow jika pembayaran lunas sebelum expire
                if (transaction_status == "settlement" && (order === null || order === void 0 ? void 0 : order.status) == "Pending") {
                    // update order jadi paid
                    yield prisma_1.default.order.update({
                        data: { status: "Paid" },
                        where: { id: +order_id },
                    });
                    // update status poin dan kupon
                    yield prisma_1.default.userPoint.updateMany({
                        data: { status: "isRedeemed" },
                        where: { orderId: +order_id },
                    });
                    yield prisma_1.default.userCoupon.updateMany({
                        data: { status: "isRedeemed" },
                        where: { orderId: +order_id },
                    });
                    // cari orderDetails dari order buat bikin attendeeTickets
                    const orderDetails = yield prisma_1.default.orderDetails.findMany({
                        where: { orderId: +order_id },
                        select: { id: true, qty: true, ticketId: true },
                    });
                    for (const item of orderDetails) {
                        for (let i = 0; i < item.qty; i++) {
                            yield prisma_1.default.attendeeTicket.create({
                                data: {
                                    orderDetailsId: item.id,
                                },
                            });
                        }
                    }
                }
                // flow jika pembayaran belum lunas setelah expire
                if (transaction_status == "canceled" && (order === null || order === void 0 ? void 0 : order.status) == "Pending") {
                    // update order jadi expired
                    yield prisma_1.default.order.update({
                        data: { status: "Expired" },
                        where: { id: +order_id },
                    });
                    //putusin relasi poin dan kupon dari order
                    yield prisma_1.default.userPoint.updateMany({
                        data: { orderId: null },
                        where: { orderId: +order_id },
                    });
                    yield prisma_1.default.userCoupon.updateMany({
                        data: { orderId: null },
                        where: { orderId: +order_id },
                    });
                    //reset jatah tiket di record ticket dari tiap orderDetails
                    const orderDetails = yield prisma_1.default.orderDetails.findMany({
                        where: { orderId: +order_id },
                        select: { id: true, qty: true, ticketId: true },
                    });
                    for (const item of orderDetails) {
                        yield prisma_1.default.ticket.update({
                            data: { remainingSeats: { increment: item.qty } },
                            where: { id: item.ticketId },
                        });
                    }
                }
                res.status(200).send({ message: "Status pesanan diperbarui!" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.OrderController = OrderController;
