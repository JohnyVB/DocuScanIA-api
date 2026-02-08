import { Request, Response } from "express";
import { firebaseDB } from "../config/firebase.config";
import { uploadToCloudinary } from "../helper/cloudinary.helper";

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

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Image is required",
    });
  }

  const uid = req.uid;
  const documentBuffer = req.file.buffer;
  try {
    const cloudinaryResult = await uploadToCloudinary(documentBuffer);

    const newDoc = {
      ownerId: uid,
      imageUri: cloudinaryResult.secure_url,
      createdAt: new Intl.DateTimeFormat("es-ES").format(new Date()),
    };

    await firebaseDB.collection("documents").add(newDoc);

    return res.status(201).json({
      status: "success",
      message: "Documento subido correctamente",
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "Error al subir el documento",
      error: error.message,
    });
  }
};
