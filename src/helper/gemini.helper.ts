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
    - "tipo_documento": nombre específico del documento (ej: Certificado de empadronamiento)
    - "categoria": usar una de:
      "identidad", "residencia", "legal", "financiero", "salud", "educacion", "otro"
    - Extraer todas las fechas relevantes.
    - Si el documento implica que el usuario debe realizar algún trámite, "requiere_accion" debe ser true.
    - "nivel_importancia":
      alto → documentos legales, multas, permisos
      medio → certificados administrativos
      bajo → informativos
    - Responder SOLO el JSON sin texto adicional.

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
