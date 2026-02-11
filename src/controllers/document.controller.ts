import { Request, Response } from "express";
import { franc } from "franc";
import { firebaseDB } from "../config/firebase.config";
import { uploadToCloudinary } from "../helper/cloudinary.helper";
import generateResultByGemini from "../helper/gemini.helper";
import { ocrSpace } from "../helper/ocr-space.helper";
import optimizeForOCR from "../helper/optimizeForOCR.helper";

export const uploadDocument = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const firestoreId = req.firestoreId;

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
      ownerId: firestoreId,
      imagesUri: imagesUri,
      createdAt: new Date().toISOString(),
      show: true,
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

export const allDocumentsByUserId = async (req: Request, res: Response) => {
  const firestoreId = req.firestoreId;
  try {
    const documentsSnapshot = await firebaseDB
      .collection("documents")
      .where("ownerId", "==", firestoreId)
      .where("show", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    if (documentsSnapshot.empty) {
      return res.status(200).json({
        status: "success",
        documents: [],
      });
    }

    const documents = documentsSnapshot.docs.map((doc) => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      status: "success",
      documents,
    });
  } catch (error: any) {
    console.error("🔥 FIREBASE ERROR:", error);
    return res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

export const hideDocumentByDocumentUid = async (
  req: Request,
  res: Response,
) => {
  const firestoreId = req.firestoreId;
  const { documentUid } = req.body;

  if (!firestoreId || !documentUid) {
    return res.status(400).json({
      status: "error",
      message:
        "el firestoreId del documento y el uid del usuario son requeridos",
    });
  }

  try {
    await firebaseDB.collection("documents").doc(firestoreId).update({
      show: false,
    });

    return res.status(200).json({
      status: "success",
      message: "Documento modificado",
    });
  } catch (error) {}
};
