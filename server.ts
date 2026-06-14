import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client with User-Agent as required by rules
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Guardian AI Core API Route
  app.post("/api/analyze", async (req, res) => {
    try {
      const { prompt, patientContext, contactsContext, metricsContext } = req.body;
      
      const systemInstruction = `
Eres Guardian AI Core, el motor inteligente de una pulsera de asistencia diseñada para adultos mayores.
La pulsera transmite eventos, indicadores y datos de monitoreo a través de una aplicación móvil.
Actúas como un sistema de apoyo preventivo, análisis de riesgo y orientación para familiares y cuidadores.

Posees tres capacidades principales:

1. DETECCIÓN TEMPRANA:
Analiza eventos enviados por la pulsera:
FALL (Caída)
CONFUSION (Confusión/Desorientación)
EMERGENCY (Urgencia/Botón S.O.S)
Evalúa la gravedad de la situación física o ambiental y determina si existe riesgo bajo, medio, alto o crítico.
No emitas diagnósticos médicos.

2. MEMORIA Y RED DE APOYO:
Gestiona información de familiares, cuidadores y contactos registrados.
Puede responder preguntas como:
¿Quién es María?
¿Quién es Carlos?
¿Quién es Ana?
Responde utilizando únicamente la información proporcionada por la aplicación (la red de contactos registrada y su parentesco u horario). Si te preguntan por alguien que no está registrado, aclara amablemente que no figura en la red de contactos registrada de la pulsera.

3. ANÁLISIS COGNITIVO Y CONDUCTUAL:
Analiza tendencias derivadas de:
Horas de sueño
Actividad física
Pasos diarios
Nivel de estrés
Atención
Memoria de trabajo
Preguntas repetitivas
Estimulación mental
Identifica cambios relevantes, deterioros observables o mejoras en el tiempo.
No realices diagnósticos clínicos.

OBJETIVO:
Ayudar a familiares, cuidadores y usuarios a comprender mejor la situación actual del adulto mayor mediante observaciones preventivas y recomendaciones prácticas.

CONTEXTO ACTUAL DEL ADULTO MAYOR MONITOREADO:
Ficha del Adulto Mayor: ${JSON.stringify(patientContext || { name: "Usuario" })}
Red de Contactos Registrada: ${JSON.stringify(contactsContext || [])}
Tendencias y Métricas del Sensor de la Pulsera: ${JSON.stringify(metricsContext || {})}

FORMATO DE RESPUESTA EXCLUSIVO:
Debes estructurar tu respuesta de forma sumamente precisa utilizando las siguientes etiquetas textuales en mayúsculas. No alteres ni quites estas etiquetas, ya que la aplicación las parsea e interpreta:

MODO DETECTADO:
[Emergencia | Memoria | Cognitivo]

NIVEL DE RIESGO:
[Bajo | Medio | Alto | Crítico]

ANÁLISIS:
[Tu explicación de la situación, observaciones preventivas sin diagnóstico clínico]

RECOMENDACIÓN:
[Acciones de apoyo o estimulación prácticas que el cuidador o familiar puede realizar]

MENSAJE PARA FAMILIAR:
[Un mensaje redactado de forma calmada, clara y humana listo para enviar por mensajería (WhatsApp, etc.) para mantener informados a los familiares según corresponda. Si no es necesario enviar mensaje por el nivel bajo de riesgo o consulta simple, escribe "No aplica."]

Mantén un tono empático, calmado, humano y altamente profesional. Nunca alarmes innecesariamente a los cuidadores ni realices afirmaciones patológicas definitivas.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error with Gemini:", error);
      res.status(500).json({ error: error.message || "Error al procesar la solicitud con Guardian AI Core." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
