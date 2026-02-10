import { Request, Response } from "express";
import { firebaseDB } from "../config/firebase.config";
import { uploadToCloudinary } from "../helper/cloudinary.helper";
import { ocrSpace } from "../helper/ocr-space.helper";
import optimizeForOCR from "../helper/optimizeForOCR.helper";
import { franc } from "franc";
import generateResultByGemini from "../helper/gemini.helper";
import { v4 as uuid } from "uuid";

export const uploadDocument = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const uid = req.uid;

  if (files.length < 1) {
    return res.status(400).json({
      message: "Las imagenes son requeridas",
    });
  }

  try {
    let optimizedArray: Buffer[] = [];
    for (const file of files) {
      const fileOptimized = await optimizeForOCR(file.buffer);
      optimizedArray.push(fileOptimized);
    }

    let fullText: string = "";
    for (const op of optimizedArray) {
      const text = await ocrSpace(op);
      fullText += "\n" + text.data.ParsedResults[0].ParsedText.trim();
    }

    if (fullText === "" || fullText.length < 40) {
      return res.status(200).json({
        success: false,
        message:
          "No se pudo extraer texto legible de la imagen. Intenta con otra foto.",
      });
    }

    const langCode = franc(fullText);
    const geminiResult = await generateResultByGemini(fullText, langCode);

    let imagesUri: string[] = [];
    for (const buffer of optimizedArray) {
      const { secure_url } = await uploadToCloudinary(buffer);
      imagesUri.push(secure_url);
    }

    const newDoc = {
      uid: uuid(),
      ownerId: uid,
      imagesUri: imagesUri,
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
      documents,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};
