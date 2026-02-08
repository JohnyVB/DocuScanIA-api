import FormData from "form-data";
import axiosInstance from "../config/axios.config";
import dotenv from "dotenv";

dotenv.config();

const api = process.env.OCR_API_URL || "";
const key = process.env.OCR_API_KEY || "";

export const ocrSpace = async (buffer: Buffer) => {
  const formData = new FormData();

  formData.append("file", buffer, {
    filename: "document.jpg",
    contentType: "image/jpeg",
  });

  formData.append("language", "spa"); // español
  formData.append("isOverlayRequired", "false");
  formData.append("scale", "true");
  formData.append("OCREngine", "2");

  try {
    const response = await axiosInstance.post(api, formData, {
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
  } catch (error) {
    console.error("OCR Error:", error);
    return { success: false, message: "Error al procesar la imagen" };
  }
};
