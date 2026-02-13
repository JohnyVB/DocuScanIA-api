import modelIA from "../config/gemini.config";

const generateResultByGemini = async (parsedText: string, langCode: string) => {
  const prompt = `
    Eres un sistema experto en análisis de documentos administrativos en España.

    Analiza el siguiente texto obtenido por OCR y responde SOLO en JSON válido con la siguiente estructura:

    {
      "document_type": "",
      "category": "", 
      "summary": "",
      "people_mentioned": [
        {
          "name": "",
          "role": ""
        }
      ],
      "important_dates": [
        {
          "date": "",
          "description": ""
        }
      ],
      "document_number": "",
      "address": "",
      "requires_action": true,
      "recommended_action": "",
      "importance_level": "low | medium | high"
    }

    Reglas:
    - "document_type": nombre específico del documento (ej: Certificado de empadronamiento)
    - "category": usar una de:
      "identidad", "residencia", "legal", "financiero", "salud", "educación", "otro"
    - Extraer todas las fechas relevantes.
    - Si el documento implica que el usuario debe realizar algún trámite, "requiere_accion" debe ser true.
    - "importance_level":
      high → documentos legales, multas, permisos
      medium → certificados administrativos
      low → informativos
    - Responder SOLO el JSON sin texto adicional.
    - "document_number": puede ser el numero de documento nacional o del pasaporte

    Documento OCR:
    ${parsedText}

    Codigo de lenguaje:
    ${langCode}
  `;

  const result = await modelIA.generateContent(prompt);
  const response = result.response.text();

  return response;
};

export default generateResultByGemini;
