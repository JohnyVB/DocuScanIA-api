"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
async function optimizeForOCR(fileBuffer) {
    const optimized = await (0, sharp_1.default)(fileBuffer)
        .rotate()
        .resize({ width: 1500 }) // tamaño ideal OCR
        .grayscale() // mejora reconocimiento
        .normalize() // mejora contraste
        .jpeg({ quality: 85 }) // compresión ideal
        .toBuffer();
    return optimized;
}
exports.default = optimizeForOCR;
