import { Request, Response } from "express";
import { createToken } from "../helper/jwt.helper";
import { firebaseDB } from "../config/firebase";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

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
        return res.status(404).json({
            status: "error",
            message: "Usuario no encontrado",
        });
    }

    const userData = userSnapshot.docs[0].data();
    const passwordMatch = bcrypt.compareSync(password, userData.password);

    if (!passwordMatch) {
        return res.status(401).json({
            status: "error",
            message: "Contraseña incorrecta",
        });
    }

    const token = await createToken(userData.uid);

    return res.status(200).json({
        status: "success",
        message: "Login exitoso",
        token,
    });
};

export const newUser = async (req: Request, res: Response) => {
    const { email, password, name, lastname } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({
            status: "error",
            message: "Email, contraseña y nombre son requeridos",
        });
    }

    const salts = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salts);

    try {
        const userRecord = await firebaseDB.collection("users").add({
            uid: uuid(),
            email,
            password: hash,
            name,
            lastname,
        });

        return res.status(201).json({
            status: "success",
            message: "Usuario creado exitosamente",
            userRecord,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: "error",
            message: "Error al crear el usuario",
            error: {
                code: error.code || "unknown",
                message: error.message || "Error desconocido",
            },
        });
    }
};
