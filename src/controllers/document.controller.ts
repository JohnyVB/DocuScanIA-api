import { Request, Response } from "express";
import { firebaseDB } from "../config/firebase.config";
import { uploadToCloudinary } from "../helper/cloudinary.helper";
import { ocrSpace } from "../helper/ocr-space.helper";
import optimizeForOCR from "../helper/optimizeForOCR.helper";
import { franc } from "franc";
import generateResultByGemini from "../helper/gemini.helper";
import { v4 as uuid } from "uuid";

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Image is required",
    });
  }
  try {
    const documentBuffer = req.file.buffer;
    const uid = req.uid;

    const optimized = await optimizeForOCR(documentBuffer);
    const ocrResult = await ocrSpace(optimized);
    const parsedText = ocrResult.data.ParsedResults[0].ParsedText.trim();

    if (parsedText === "" || parsedText.length < 40) {
      return res.status(200).json({
        success: false,
        message:
          "No se pudo extraer texto legible de la imagen. Intenta con otra foto.",
      });
    }

    const langCode = franc(parsedText);
    const geminiResult = await generateResultByGemini(parsedText, langCode);

    const cloudinaryResult = await uploadToCloudinary(documentBuffer);

    const newDoc = {
      uid: uuid(),
      ownerId: uid,
      imageUri: cloudinaryResult.secure_url,
      createdAt: new Intl.DateTimeFormat("es-ES").format(new Date()),
      data: JSON.parse(geminiResult),
    };

    await firebaseDB.collection("documents").add(newDoc);

    return res.status(201).json({
      status: "success",
      message: "Documento subido correctamente",
      newDoc,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "Error al subir el documento",
      error: error.message,
    });
  }
};

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
