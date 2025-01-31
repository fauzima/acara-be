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
exports.UserController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class UserController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, page = 1, limit = 3 } = req.query;
                const filter = {};
                if (search) {
                    filter.OR = [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                    ];
                }
                const countUser = yield prisma_1.default.user.aggregate({ _count: { _all: true } });
                const total_page = Math.ceil(+countUser._count._all / +limit);
                const users = yield prisma_1.default.user.findMany({
                    where: filter,
                    orderBy: { id: "asc" },
                    take: +limit,
                    skip: +limit * (+page - 1),
                });
                res.status(200).send({ total_page, page, users });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: `${(_a = req.acc) === null || _a === void 0 ? void 0 : _a.id}` },
                });
                res.status(200).send({ user });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.user.create({ data: req.body });
                res.status(201).send({ message: "Akun pengguna baru berhasil dibuat" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.user.update({ data: req.body, where: { id: id } });
                res.status(200).send({ message: "Akun pengguna berhasil diedit" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.user.delete({ where: { id: id } });
                res.status(200).send({ message: "Akun pengguna berhasil dihapus" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getUserRewards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = (_a = req.acc) === null || _a === void 0 ? void 0 : _a.id;
                if (!id) {
                    res.status(401).send({ message: "Unauthorized" });
                    return; // Tambahkan return untuk menghentikan eksekusi
                }
                const userPoint = yield prisma_1.default.userPoint.findMany({
                    where: {
                        userId: id,
                        expiredAt: {
                            gte: new Date(),
                        },
                        status: "Available",
                    },
                    select: {
                        id: true,
                        point: true,
                        expiredAt: true,
                    },
                });
                const userCoupon = yield prisma_1.default.userCoupon.findMany({
                    where: {
                        userId: id,
                        expiredAt: {
                            gte: new Date(),
                        },
                        status: "Available",
                    },
                    select: {
                        userId: true,
                        percentage: true,
                        expiredAt: true,
                    },
                });
                res.status(200).send({
                    point: userPoint,
                    coupon: userCoupon,
                });
            }
            catch (error) {
                console.error("Error fetching customer rewards:", error);
                res.status(500).send({
                    message: "Internal Server Error",
                    error,
                });
            }
        });
    }
}
exports.UserController = UserController;
