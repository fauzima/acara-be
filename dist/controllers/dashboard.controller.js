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
exports.DashboardController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const formatMonth_1 = require("../helpers/formatMonth");
class DashboardController {
    getSummaries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // dapetin id
                const id = (_a = req.acc) === null || _a === void 0 ? void 0 : _a.id;
                // dapetin total event
                const events = yield prisma_1.default.event.findMany({
                    where: { promotorId: id },
                });
                const totalEvents = events.length;
                // dapetin total transaksi
                const order = yield prisma_1.default.order.findMany({
                    where: { status: "Paid", event: { is: { promotorId: id } } },
                    select: { finalPrice: true },
                });
                const totalOrders = order.length;
                //dapetin total penjualan
                const totalProfit = order.reduce((n, { finalPrice }) => n + finalPrice, 0);
                //dapetin total tiket terjual
                const ticket = yield prisma_1.default.orderDetails.findMany({
                    where: {
                        order: {
                            is: { status: "Paid", event: { is: { promotorId: id } } },
                        },
                    },
                    select: { qty: true },
                });
                const totalTickets = ticket.reduce((n, { qty }) => n + qty, 0);
                res
                    .status(200)
                    .send([totalEvents, totalOrders, totalProfit, totalTickets]);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getEventAktif(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req.acc) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const eventsDate = yield prisma_1.default.event.findMany({
                    where: { promotorId: id },
                    select: { startDate: true },
                });
                let arrYear = [];
                let chartData = [];
                for (const item of eventsDate) {
                    const year = new Date(item.startDate).getFullYear();
                    arrYear.push(year);
                }
                arrYear.sort((a, b) => a - b);
                // const totalYear = arrYear.length;
                for (const item of arrYear) {
                    if (!JSON.stringify(chartData).includes(`${item}`)) {
                        chartData.push({ year: `${item}`, event_active: 1 });
                    }
                    else {
                        chartData[chartData.length - 1].event_active += 1;
                    }
                }
                console.log(chartData);
                res.status(200).send({ result: chartData });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = (_a = req.acc) === null || _a === void 0 ? void 0 : _a.id;
                const ticket = yield prisma_1.default.order.findMany({
                    where: {
                        status: "Paid",
                        event: {
                            promotorId: id,
                        },
                    },
                    select: {
                        expiredAt: true,
                        OrderDetails: {
                            select: {
                                qty: true,
                            },
                        },
                    },
                });
                let amountTicket = [];
                let chartData = [];
                for (const item of ticket) {
                    const month = new Date(item.expiredAt).getMonth();
                    let qty = 0;
                    for (const quantity of item.OrderDetails) {
                        qty += quantity.qty;
                    }
                    amountTicket.push({ month, qty });
                    amountTicket.sort((a, b) => a.month - b.month);
                }
                for (const item of amountTicket) {
                    if (!JSON.stringify(chartData).includes((0, formatMonth_1.FormatMonth)(item.month))) {
                        chartData.push({
                            month: (0, formatMonth_1.FormatMonth)(item.month),
                            total_ticket: item.qty,
                        });
                    }
                    else {
                        chartData[chartData.length - 1].total_ticket += item.qty;
                    }
                }
                console.log(chartData);
                res.status(200).send({ result: chartData });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = (_a = req.acc) === null || _a === void 0 ? void 0 : _a.id;
                const profit = yield prisma_1.default.order.findMany({
                    where: { status: "Paid", event: { is: { promotorId: id } } },
                    select: { finalPrice: true, expiredAt: true },
                });
                res.status(200).send(profit);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.DashboardController = DashboardController;
