"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allDocumentsByIdUser = void 0;
const firebase_config_1 = require("../config/firebase.config");
const allDocumentsByIdUser = async (req, res) => {
    const uid = req.uid;
    try {
        const documentsSnapshot = await firebase_config_1.firebaseDB
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
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los documentos",
            error: error.message,
        });
    }
};
exports.allDocumentsByIdUser = allDocumentsByIdUser;
