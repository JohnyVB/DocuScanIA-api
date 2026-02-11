"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrSpace = void 0;
const form_data_1 = __importDefault(require("form-data"));
const axios_config_1 = __importDefault(require("../config/axios.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const api = process.env.OCR_API_URL || "";
const key = process.env.OCR_API_KEY || "";
const ocrSpace = async (buffer) => {
    const formData = new form_data_1.default();
    formData.append("file", buffer, {
        filename: "document.jpg",
        contentType: "image/jpeg",
    });
    formData.append("language", "spa"); // español
    formData.append("isOverlayRequired", "false");
    formData.append("scale", "true");
    formData.append("OCREngine", "2");
    try {
        const response = await axios_config_1.default.post(api, formData, {
            headers: {
                ...formData.getHeaders(),
                apikey: key,
            },
        });
        const parsedText = response.data?.ParsedResults?.[0]?.ParsedText ?? "";
        return {
            success: true,
            parsedText,
            data: response.data,
        };
    }
    catch (error) {
        console.error("OCR Error:", error);
        return { success: false, message: "Error al procesar la imagen" };
    }
};
exports.ocrSpace = ocrSpace;
