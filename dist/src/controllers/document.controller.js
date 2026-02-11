"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideDocumentById = exports.allDocumentsByUserId = exports.uploadDocument = void 0;
const franc_1 = require("franc");
const firebase_config_1 = require("../config/firebase.config");
const cloudinary_helper_1 = require("../helper/cloudinary.helper");
const gemini_helper_1 = __importDefault(require("../helper/gemini.helper"));
const ocr_space_helper_1 = require("../helper/ocr-space.helper");
const optimizeForOCR_helper_1 = __importDefault(require("../helper/optimizeForOCR.helper"));
const uploadDocument = async (req, res) => {
    const files = req.files;
    const userFirestoreId = req.firestoreId;
    if (files.length < 1) {
        return res.status(400).json({
            message: "Las imagenes son requeridas",
        });
    }
    try {
        let optimizedArray = [];
        for (const file of files) {
            const fileOptimized = await (0, optimizeForOCR_helper_1.default)(file.buffer);
            optimizedArray.push(fileOptimized);
        }
        let fullText = "";
        for (const op of optimizedArray) {
            const text = await (0, ocr_space_helper_1.ocrSpace)(op);
            fullText += "\n" + text.data.ParsedResults[0].ParsedText.trim();
        }
        if (fullText === "" || fullText.length < 40) {
            return res.status(200).json({
                success: false,
                message: "No se pudo extraer texto legible de la imagen. Intenta con otra foto.",
            });
        }
        const langCode = (0, franc_1.franc)(fullText);
        const geminiResult = await (0, gemini_helper_1.default)(fullText, langCode);
        let imagesUri = [];
        for (const buffer of optimizedArray) {
            const { secure_url } = await (0, cloudinary_helper_1.uploadToCloudinary)(buffer);
            imagesUri.push(secure_url);
        }
        const newDoc = {
            ownerId: userFirestoreId,
            imagesUri: imagesUri,
            createdAt: new Date().toISOString(),
            show: true,
            data: JSON.parse(geminiResult),
        };
        const docRef = await firebase_config_1.firebaseDB.collection("documents").add(newDoc);
        return res.status(201).json({
            status: "success",
            message: "Documento subido correctamente",
            newDoc: {
                firestoreId: docRef.id,
                ...newDoc,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al subir el documento",
            error: error.message,
        });
    }
};
exports.uploadDocument = uploadDocument;
const allDocumentsByUserId = async (req, res) => {
    const firestoreId = req.firestoreId;
    try {
        const documentsSnapshot = await firebase_config_1.firebaseDB
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
    }
    catch (error) {
        console.error("🔥 FIREBASE ERROR:", error);
        return res.status(500).json({
            status: "error",
            error: error.message,
        });
    }
};
exports.allDocumentsByUserId = allDocumentsByUserId;
const hideDocumentById = async (req, res) => {
    const { documentId } = req.body;
    if (!documentId) {
        return res.status(400).json({
            status: "error",
            message: "El documentId es requerido",
        });
    }
    try {
        await firebase_config_1.firebaseDB.collection("documents").doc(documentId).update({
            show: false,
        });
        return res.status(200).json({
            status: "success",
            message: "Documento modificado",
        });
    }
    catch (error) {
        console.log("Error hideDocumentById: ", error);
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.hideDocumentById = hideDocumentById;
