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
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = require("bcrypt");
const user_service_1 = require("../services/user.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_service_1 = require("../services/auth.service");
const mailer_1 = require("../services/mailer");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { password, confirmPassword, name, email, inputRef } = req.body;
                if (password != confirmPassword)
                    throw { message: "Kata sandi tidak cocok" };
                const user = yield (0, user_service_1.findUser)(name, email);
                if (user)
                    throw { message: "Nama pengguna atau email sudah terdaftar" };
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
                let newRefCode = (0, auth_service_1.generator)();
                const refCode = yield (0, user_service_1.findRefCode)(newRefCode);
                if (refCode)
                    newRefCode = (0, auth_service_1.generator)();
                if (inputRef) {
                    const asd = yield (0, user_service_1.findRefCode)(inputRef);
                    if (!asd)
                        throw { message: "Kode rujukan tidak ditemukan" };
                }
                if (inputRef == "")
                    inputRef = null;
                const newUser = yield prisma_1.default.user.create({
                    data: {
                        name,
                        email,
                        password: hashPassword,
                        refCode: newRefCode,
                        inputRef,
                    },
                });
                const payload = { id: newUser.id };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "1d" });
                const link = `${process.env.BASE_URL_FE}user/verify/${token}`;
                const templatePath = path_1.default.join(__dirname, "../templates", "verifyUser.hbs");
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ name, link });
                yield mailer_1.transporter.sendMail({
                    from: "acaradotcom@gmail.com",
                    to: email,
                    subject: "Selamat datang di Acara.com",
                    html,
                });
                res.status(201).send({
                    message: `Proses pendaftaran berhasil dilakukan. Cek email ${newUser.email} untuk verifikasi akun anda.`,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, password } = req.body;
                const user = yield (0, user_service_1.findUser)(data, data);
                if (!user)
                    throw { message: "Akun tidak ditemukan" };
                if (!user.isVerified)
                    throw {
                        message: "Akun pengguna belum terverifikasi! Cek email anda untuk verifikasi akun anda.",
                    };
                const isValidPassword = yield (0, bcrypt_1.compare)(password, user.password);
                if (!isValidPassword)
                    throw { message: "Kata sandi salah" };
                const payload = { id: user.id, role: "user" };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "1d" });
                const acc = Object.assign(Object.assign({}, user), { role: "user" });
                res.status(200).send({
                    message: "Proses login berhasil dilakukan",
                    user: acc,
                    token,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const verifiedUser = (0, jsonwebtoken_1.verify)(token, process.env.JWT_KEY);
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: verifiedUser.id },
                });
                if ((user === null || user === void 0 ? void 0 : user.isVerified) == false) {
                    yield prisma_1.default.user.update({
                        data: { isVerified: true },
                        where: { id: user === null || user === void 0 ? void 0 : user.id },
                    });
                    const refCode = user === null || user === void 0 ? void 0 : user.inputRef;
                    console.log(refCode);
                    if (refCode) {
                        const refUser = yield (0, user_service_1.findRefCode)(refCode);
                        if (refUser) {
                            // count the expiry date
                            const now = new Date().getTime();
                            const expire = new Date(now + 7776000000);
                            // api posting referred user's point
                            yield prisma_1.default.userPoint.create({
                                data: { userId: refUser.id, expiredAt: expire },
                            });
                            // api posting verified user's coupon
                            yield prisma_1.default.userCoupon.create({
                                data: { userId: verifiedUser.id, expiredAt: expire },
                            });
                        }
                    }
                }
                if ((user === null || user === void 0 ? void 0 : user.isVerified) == true) {
                    throw { message: "Akun sudah terverifikasi" };
                }
                res.status(200).send({ message: "Proses verifikasi berhasil dilakukan" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    registerPromotor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, confirmPassword, name, email } = req.body;
                if (password != confirmPassword)
                    throw { message: "Kata sandi salah" };
                const promotor = yield (0, user_service_1.findPromotor)(name, email);
                if (promotor)
                    throw { message: "Nama atau email sudah terdaftar" };
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
                const newProm = yield prisma_1.default.promotor.create({
                    data: {
                        name,
                        email,
                        password: hashPassword,
                    },
                });
                const payload = { id: newProm.id };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "1d" });
                const link = `${process.env.BASE_URL_FE}/promotor/verify/${token}`;
                const templatePath = path_1.default.join(__dirname, "../templates", "verifyProm.hbs");
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ name, link });
                yield mailer_1.transporter.sendMail({
                    from: "acaradotcom@gmail.com",
                    to: email,
                    subject: "Selamat datang di Acara.com",
                    html,
                });
                res.status(201).send({
                    message: `Proses pendaftaran berhasil dilakukan. Cek email ${newProm.email} untuk verifikasi akun anda.`,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    loginPromotor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, password } = req.body;
                const promotor = yield (0, user_service_1.findPromotor)(data, data);
                if (!promotor)
                    throw { message: "Akun promotor tidak ditemukan" };
                if (!promotor.isVerified)
                    throw {
                        message: "Akun belum terverifikasi! Cek email anda untuk verifikasi akun anda.",
                    };
                const isValidPassword = yield (0, bcrypt_1.compare)(password, promotor.password);
                if (!isValidPassword)
                    throw { message: "Kata sandi salah" };
                const payload = { id: promotor.id, role: "promotor" };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "1d" });
                const acc = Object.assign(Object.assign({}, promotor), { role: "promotor" });
                res.status(200).send({
                    message: "Proses login berhasil dilakukan",
                    promotor: acc,
                    token,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    verifyProm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const verifiedProm = (0, jsonwebtoken_1.verify)(token, process.env.JWT_KEY);
                const prom = yield prisma_1.default.promotor.findUnique({
                    where: { id: verifiedProm.id },
                });
                if ((prom === null || prom === void 0 ? void 0 : prom.isVerified) == false) {
                    yield prisma_1.default.promotor.update({
                        data: { isVerified: true },
                        where: { id: verifiedProm.id },
                    });
                }
                if ((prom === null || prom === void 0 ? void 0 : prom.isVerified) == true) {
                    throw { message: "Akun sudah terverifikasi" };
                }
                res.status(200).send({ message: "Proses verifikasi berhasil dilakukan" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const role = (_a = req.acc) === null || _a === void 0 ? void 0 : _a.role;
                let acc = {};
                if (role == "user") {
                    acc = yield prisma_1.default.user.findUnique({
                        where: { id: (_b = req.acc) === null || _b === void 0 ? void 0 : _b.id },
                    });
                }
                else if (role == "promotor") {
                    acc = yield prisma_1.default.promotor.findUnique({
                        where: { id: (_c = req.acc) === null || _c === void 0 ? void 0 : _c.id },
                    });
                }
                acc.role = role;
                res.status(200).send({ acc });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.AuthController = AuthController;
