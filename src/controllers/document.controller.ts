import { Request, Response } from "express";
import { firebaseDB } from "../config/firebase";

export const allDocumentsByIdUser = async (req: Request, res: Response) => {
    const uid = req.uid;
    try {
        const documentsSnapshot = await firebaseDB
            .collection("documents")
            .where("ownerId", "==", uid)
            .get();

        const documents = documentsSnapshot.docs.map((doc) => ({
            ...doc.data(),
        }));

        return res.status(200).json({
            status: "success",
            data: documents,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los documentos",
            error: error.message,
        });
    }
};
