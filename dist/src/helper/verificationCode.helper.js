"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailVerificationCode = exports.verifyOTP = exports.hashOTP = exports.generateOTP = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_config_1 = __importDefault(require("../config/nodemailer.config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const hashOTP = (otp) => {
    const salts = bcryptjs_1.default.genSaltSync(10);
    const hash = bcryptjs_1.default.hashSync(otp, salts);
    return hash;
};
exports.hashOTP = hashOTP;
const verifyOTP = (otp, hashedOTP) => {
    return bcryptjs_1.default.compareSync(otp, hashedOTP);
};
exports.verifyOTP = verifyOTP;
const sendEmailVerificationCode = async (email, code) => {
    const templatePath = path_1.default.join(__dirname, "../assets/emailTemplates/verificationCode.html");
    let html = fs_1.default.readFileSync(templatePath, "utf-8");
    html = html.replace("{{CODE}}", code);
    await nodemailer_config_1.default.sendMail({
        from: "DocuScanAI <no-reply@docuscanai.com>",
        to: email,
        subject: "Código para recuperar contraseña",
        html: html,
    });
};
exports.sendEmailVerificationCode = sendEmailVerificationCode;
//
