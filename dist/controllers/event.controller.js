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
const cloudinary_1 = require("../services/cloudinary");
class EventController {
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const data = yield prisma_1.default.event.findMany({
                    where: {
                        startDate: { gte: now },
                    },
                    orderBy: {
                        startDate: "asc",
                    },
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        thumbnail: true,
                        startDate: true,
                        promotor: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                        Ticket: {
                            select: {
                                price: true,
                            },
                            orderBy: {
                                price: "asc",
                            },
                            take: 1,
                        },
                    },
                });
                const events = [];
                for (const item of data) {
                    const price = Number(item.Ticket[0].price);
                    events.push({
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        thumbnail: item.thumbnail,
                        startDate: item.startDate,
                        price: price,
                        avatar: item.promotor.avatar,
                        name: item.promotor.name,
                    });
                }
                res.status(200).send({ events: events });
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
                const data = yield prisma_1.default.event.findUnique({
                    where: { id: id },
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        startDate: true,
                        endDate: true,
                        thumbnail: true,
                        location: true,
                        venue: true,
                        desc: true,
                        promotor: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                        Ticket: {
                            select: {
                                category: true,
                                price: true,
                                startDate: true,
                                endDate: true,
                                remainingSeats: true,
                                seats: true,
                                desc: true,
                            },
                        },
                    },
                });
                const Ticket = [];
                for (const item of data === null || data === void 0 ? void 0 : data.Ticket) {
                    const price = Number(item.price);
                    Ticket.push({
                        category: item.category,
                        price: price,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        seats: item.seats,
                        remainingSeats: item.remainingSeats,
                        desc: item.desc,
                    });
                }
                const minPrice = Ticket.sort((a, b) => a.price - b.price)[0].price;
                res.status(200).send({
                    event: {
                        id: data === null || data === void 0 ? void 0 : data.id,
                        title: data === null || data === void 0 ? void 0 : data.title,
                        category: data === null || data === void 0 ? void 0 : data.category,
                        startDate: data === null || data === void 0 ? void 0 : data.startDate,
                        endDate: data === null || data === void 0 ? void 0 : data.endDate,
                        thumbnail: data === null || data === void 0 ? void 0 : data.thumbnail,
                        minPrice: minPrice,
                        location: data === null || data === void 0 ? void 0 : data.location,
                        venue: data === null || data === void 0 ? void 0 : data.venue,
                        desc: data === null || data === void 0 ? void 0 : data.desc,
                        name: data === null || data === void 0 ? void 0 : data.promotor.name,
                        avatar: data === null || data === void 0 ? void 0 : data.promotor.avatar,
                        Ticket: Ticket,
                    },
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // nerima request file unggah(file type blob dalam bentuk formdata)
                if (!req.file)
                    throw { message: "Gambar/poster/banner kosong!" };
                const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(req.file, "event");
                // req body json formdata (karena Ticket adalah array jadi perlu di parse)
                const { title, desc, category, location, venue, startDate, endDate, Ticket, } = req.body;
                const parsedTicket = JSON.parse(Ticket);
                // variabel penampung buat format string (request) jadi date
                const formattedStartDate = new Date(startDate);
                const formattedEndDate = new Date(endDate);
                // langkah yang sama tapi karena Ticketnya array jadi harus diloop
                const formattedTicket = [];
                for (const item of parsedTicket) {
                    const formattedStartDate = new Date(item.startDate);
                    const formattedEndDate = new Date(item.endDate);
                    formattedTicket.push({
                        category: item.ticketCategory,
                        desc: item.ticketDesc,
                        seats: parseInt(item.seats),
                        remainingSeats: parseInt(item.seats),
                        price: parseInt(item.price),
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                    });
                }
                // create prisma
                yield prisma_1.default.event.create({
                    data: {
                        title,
                        desc,
                        category,
                        location,
                        venue,
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                        thumbnail: secure_url,
                        promotorId: (_a = req.acc) === null || _a === void 0 ? void 0 : _a.id,
                        Ticket: {
                            create: formattedTicket,
                        },
                    },
                });
                res.status(201).send({ message: `Acara baru ${title} berhasil dibuat` });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.EventController = EventController;
