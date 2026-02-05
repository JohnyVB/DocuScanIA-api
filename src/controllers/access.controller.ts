import { Request, Response } from "express";
import { createToken } from "../helper/jwt.helper";
import { firebaseDB } from "../config/firebase.config";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import {
  generateOTP,
  hashOTP,
  sendEmailVerificationCode,
  verifyOTP,
} from "../helper/verificationCode.helper";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email y contraseña son requeridos",
    });
  }

  const userSnapshot = await firebaseDB
    .collection("users")
    .where("email", "==", email)
    .get();

  if (userSnapshot.empty) {
    return res
      .status(404)
      .json({ status: "error", message: "Usuario no encontrado" });
  }

  const userData = userSnapshot.docs[0].data();
  const passwordMatch = bcrypt.compareSync(password, userData.password);

  if (!passwordMatch) {
    return res
      .status(200)
      .json({ status: "error", message: "Contraseña incorrecta" });
  }

  const token = await createToken(userData.uid);

  return res.status(200).json({
    status: "success",
    message: "Login exitoso",
    token,
    userData: {
      uid: userData.uid,
      email: userData.email,
      name: userData.name,
      lastname: userData.lastname,
      resetPasswordCode: userData.resetPasswordCode,
    },
  });
};

export const newUser = async (req: Request, res: Response) => {
  const { name, lastname, email, password } = req.body;

  if (!email || !password || !name || !lastname) {
    return res.status(200).json({
      status: "error",
      message: "Email, contraseña, nombre y apellido son requeridos",
    });
  }

  const salts = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salts);

  try {
    await firebaseDB.collection("users").add({
      uid: uuid(),
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
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear el usuario",
    });
  }
};

export const sendResetPasswordCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ status: "error", message: "Email es requerido" });
  }

  const userSnapshot = await firebaseDB
    .collection("users")
    .where("email", "==", email)
    .get();

  if (userSnapshot.empty) {
    return res
      .status(404)
      .json({ status: "error", message: "Usuario no encontrado" });
  }

  const resetCode = generateOTP();
  const hashedResetCode = hashOTP(resetCode);

  const userDoc = userSnapshot.docs[0];
  await userDoc.ref.update({ resetPasswordCode: hashedResetCode });

  await sendEmailVerificationCode(email, resetCode);

  return res.status(200).json({
    status: "success",
    message: "Código de restablecimiento enviado",
    resetCode, // En un entorno real, no enviar el código en la respuesta
  });
};

export const verifyResetPasswordCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res
      .status(400)
      .json({ status: "error", message: "Email y código son requeridos" });
  }

  const userSnapshot = await firebaseDB
    .collection("users")
    .where("email", "==", email)
    .get();

  if (userSnapshot.empty) {
    return res
      .status(404)
      .json({ status: "error", message: "Usuario no encontrado" });
  }

  const userData = userSnapshot.docs[0].data();
  const isCodeValid = verifyOTP(code, userData.resetPasswordCode);

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

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      status: "error",
      message: "Email y nueva contraseña son requeridos",
    });
  }

  const userSnapshot = await firebaseDB
    .collection("users")
    .where("email", "==", email)
    .get();

  if (userSnapshot.empty) {
    return res
      .status(404)
      .json({ status: "error", message: "Usuario no encontrado" });
  }

  const salts = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salts);

  const userDoc = userSnapshot.docs[0];
  await userDoc.ref.update({ password: hash, resetPasswordCode: "" });

  return res.status(200).json({
    status: "success",
    message: "Contraseña restablecida exitosamente",
  });
};
