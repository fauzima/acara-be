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
exports.EventController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class EventController {
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.event);
                const { search, page = 1, limit = 3 } = req.query;
                const filter = {};
                if (search) {
                    filter.OR = [
                        { title: { contains: search, mode: "insensitive" } },
                    ];
                }
                const countEvent = yield prisma_1.default.event.aggregate({
                    _count: { _all: true },
                });
                const total_page = Math.ceil(+countEvent._count._all / +limit);
                const events = yield prisma_1.default.event.findMany({
                    where: filter,
                    orderBy: { id: "asc" },
                    take: +limit,
                    skip: +limit * (+page - 1),
                });
                res.status(200).send({ total_page, page, events });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getEventId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const event = yield prisma_1.default.event.findUnique({
                    where: { id: id },
                });
                res.status(200).send({ event });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.event.create({ data: req.body });
                res.status(201).send({ message: "Acara baru berhasil dibuat" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    editEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.event.update({ data: req.body, where: { id: id } });
                res.status(200).send({ message: "Acara berhasil diedit" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.event.delete({ where: { id: id } });
                res.status(200).send({ message: "Acara berhasil dihapus" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.EventController = EventController;
