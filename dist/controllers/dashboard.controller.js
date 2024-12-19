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
}
exports.DashboardController = DashboardController;
