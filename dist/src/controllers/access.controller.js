"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetPasswordCode = exports.sendResetPasswordCode = exports.newUser = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const firebase_config_1 = require("../config/firebase.config");
const jwt_helper_1 = require("../helper/jwt.helper");
const verificationCode_helper_1 = require("../helper/verificationCode.helper");
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email y contraseña son requeridos",
        });
    }
    const userSnapshot = await firebase_config_1.firebaseDB
        .collection("users")
        .where("email", "==", email)
        .get();
    if (userSnapshot.empty) {
        return res
            .status(404)
            .json({ status: "error", message: "Usuario no encontrado" });
    }
    const userData = userSnapshot.docs.map((doc) => ({
        firestoreId: doc.id,
        ...doc.data(),
    }))[0];
    const passwordMatch = bcryptjs_1.default.compareSync(password, userData.password);
    if (!passwordMatch) {
        return res
            .status(200)
            .json({ status: "error", message: "Contraseña incorrecta" });
    }
    const token = await (0, jwt_helper_1.createToken)(userData.firestoreId);
    return res.status(200).json({
        status: "success",
        message: "Login exitoso",
        token,
        userData: {
            firestoreId: userData.firestoreId,
            email: userData.email,
            name: userData.name,
            lastname: userData.lastname,
            resetPasswordCode: userData.resetPasswordCode,
        },
    });
};
exports.login = login;
const newUser = async (req, res) => {
    const { name, lastname, email, password } = req.body;
    if (!email || !password || !name || !lastname) {
        return res.status(200).json({
            status: "error",
            message: "Email, contraseña, nombre y apellido son requeridos",
        });
    }
    const salts = bcryptjs_1.default.genSaltSync(10);
    const hash = bcryptjs_1.default.hashSync(password, salts);
    try {
        await firebase_config_1.firebaseDB.collection("users").add({
            name,
            lastname,
            email,
            password: hash,
            resetPasswordCode: "",
        });
        return res.status(201).json({
            status: "success",
            message: "Usuario creado exitosamente",
        });
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al crear el usuario",
        });
    }
};
exports.newUser = newUser;
const sendResetPasswordCode = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res
            .status(400)
            .json({ status: "error", message: "Email es requerido" });
    }
    const userSnapshot = await firebase_config_1.firebaseDB
        .collection("users")
        .where("email", "==", email)
        .get();
    if (userSnapshot.empty) {
        return res
            .status(404)
            .json({ status: "error", message: "Usuario no encontrado" });
    }
    const resetCode = (0, verificationCode_helper_1.generateOTP)();
    const hashedResetCode = (0, verificationCode_helper_1.hashOTP)(resetCode);
    const userDoc = userSnapshot.docs[0];
    await userDoc.ref.update({ resetPasswordCode: hashedResetCode });
    await (0, verificationCode_helper_1.sendEmailVerificationCode)(email, resetCode);
    return res.status(200).json({
        status: "success",
        message: "Código de restablecimiento enviado",
        resetCode, // En un entorno real, no enviar el código en la respuesta
    });
};
exports.sendResetPasswordCode = sendResetPasswordCode;
const verifyResetPasswordCode = async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res
            .status(400)
            .json({ status: "error", message: "Email y código son requeridos" });
    }
    const userSnapshot = await firebase_config_1.firebaseDB
        .collection("users")
        .where("email", "==", email)
        .get();
    if (userSnapshot.empty) {
        return res
            .status(404)
            .json({ status: "error", message: "Usuario no encontrado" });
    }
    const userData = userSnapshot.docs[0].data();
    const isCodeValid = (0, verificationCode_helper_1.verifyOTP)(code, userData.resetPasswordCode);
    if (!isCodeValid) {
        return res.status(200).json({
            status: "error",
            message: "Código de restablecimiento inválido",
        });
    }
    return res
        .status(200)
        .json({ status: "success", message: "Código verificado exitosamente" });
};
exports.verifyResetPasswordCode = verifyResetPasswordCode;
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({
            status: "error",
            message: "Email y nueva contraseña son requeridos",
        });
    }
    const userSnapshot = await firebase_config_1.firebaseDB
        .collection("users")
        .where("email", "==", email)
        .get();
    if (userSnapshot.empty) {
        return res
            .status(404)
            .json({ status: "error", message: "Usuario no encontrado" });
    }
    const salts = bcryptjs_1.default.genSaltSync(10);
    const hash = bcryptjs_1.default.hashSync(newPassword, salts);
    const userDoc = userSnapshot.docs[0];
    await userDoc.ref.update({ password: hash, resetPasswordCode: "" });
    return res.status(200).json({
        status: "success",
        message: "Contraseña restablecida exitosamente",
    });
};
exports.resetPassword = resetPassword;
