import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "./env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");

const modelIA = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" },
});

export default modelIA;
