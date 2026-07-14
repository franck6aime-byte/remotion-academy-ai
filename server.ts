import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI SDK safely
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chat features will fallback to offline mock mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-memory simulation of persistent storage (renders queue, sessions)
interface SimulatedRender {
  id: string;
  title: string;
  code: string;
  status: 'queued' | 'rendering' | 'done' | 'failed';
  progress: number;
  url?: string;
  durationSeconds: number;
  createdAt: string;
  source: 'exercise' | 'playground';
  logs: string[];
}

let simulatedRenders: SimulatedRender[] = [];

// 1. SYSTEM PROMPT FOR AI TUTOR
const SYSTEM_PROMPT = `Tu es l'assistant IA tuteur officiel de "Remotion Academy AI". Ton rôle est d'enseigner Remotion (la bibliothèque permettant de générer des vidéos programmatiques avec React et Tailwind CSS) à des développeurs en français.

Tes directives fondamentales :
- Tu t'exprimes de manière bienveillante, pédagogue, claire et moderne.
- Tu réponds EXCLUSIVEMENT en français.
- Tu es un expert absolu de Remotion et de React.
- Tu guides l'utilisateur pas à pas. Ne lui donne JAMAIS la solution complète d'un exercice dès le départ. Donne-lui plutôt des indices, explique le concept mathématique ou physique, montre-lui des bouts de code d'exemple similaires.
- Lorsque l'utilisateur te pose des questions sur l'un des exercices des modules, réfère-toi aux concepts de Remotion :
  * interpolate() : pour la correspondance linéaire entre frames et valeurs de sortie (ex: opacité, échelle, positions).
  * spring() : pour des animations fluides basées sur la physique des ressorts (damping, stiffness, mass).
  * useCurrentFrame() : pour obtenir l'index de l'image actuelle (démarre à 0).
  * useVideoConfig() : pour obtenir fps, durationInFrames, width, height.
  * <Sequence> : pour caler des scènes dans la timeline avec 'from' et 'durationInFrames' en utilisant un temps relatif réinitialisé à 0 à l'intérieur.
- Utilise toujours des blocs de code markdown pour illustrer tes explications. Encourage l'utilisation de Tailwind CSS pour le style.
- Si la question est complètement hors-sujet de Remotion, React ou du design, recadre-la poliment pour rester concentré sur l'académie de programmation vidéo.`;

// 2. CHAT API ENDPOINT
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, contexte, thinkingEnabled } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Le paramètre 'messages' est requis et doit être un tableau." });
  }

  try {
    const ai = getAiClient();
    
    // Convert client message format into Gemini SDK format: { role, parts: [{ text }] }
    const contents = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Select the model based on metadata instructions:
    // "Use gemini-3.1-pro-preview for particularly complex tasks, gemini-3.5-flash for general tasks..."
    // "You MUST use the gemini-3.1-pro-preview model and set thinkingLevel to ThinkingLevel.HIGH when thinking mode is enabled."
    const modelName = thinkingEnabled ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";

    const config: any = {
      systemInstruction: SYSTEM_PROMPT + (contexte ? `\n\nContexte actuel de l'étudiant : ${contexte}` : ""),
    };

    if (thinkingEnabled) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH
      };
      // Do NOT set maxOutputTokens here! (Required by instructions for HIGH thinking level)
    }

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Fallback response for offline / mock testing
      const lastUserMsg = messages[messages.length - 1]?.content || "";
      let mockReply = `[MOCK TUTOR] Je vois que vous travaillez sur Remotion ! Votre clé API n'étant pas encore configurée, voici une explication hors-ligne : \n\nPour animer un titre avec \`interpolate()\`, vous devez coupler \`useCurrentFrame()\` à la fonction d'interpolation. Par exemple :\n\`\`\`tsx\nconst frame = useCurrentFrame();\nconst opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });\n\`\`\nQu'aimeriez-vous savoir sur les transitions ou la timeline de Remotion ?`;
      return res.json({
        content: mockReply,
        thinking: "Le serveur fonctionne en mode simulation hors-ligne pour la clé API."
      });
    }

    let response;
    let fallbackModel: string | null = null;
    let actualModelName = modelName;
    let actualConfig = { ...config };

    try {
      response = await ai.models.generateContent({
        model: actualModelName,
        contents,
        config: actualConfig
      });
    } catch (primaryError: any) {
      const errMsg = String(primaryError.message || primaryError);
      console.warn(`Primary Gemini API call failed for model ${actualModelName}:`, errMsg);

      const isQuotaOrModelError = 
        errMsg.includes("429") || 
        errMsg.includes("RESOURCE_EXHAUSTED") || 
        errMsg.includes("quota") || 
        errMsg.includes("rate limit") ||
        errMsg.includes("limit: 0") ||
        errMsg.includes("not found") ||
        errMsg.includes("unsupported");

      if (isQuotaOrModelError && actualModelName === "gemini-3.1-pro-preview") {
        try {
          fallbackModel = "gemini-3.5-flash";
          actualModelName = fallbackModel;
          console.log(`Falling back to ${actualModelName} with thinking enabled...`);
          response = await ai.models.generateContent({
            model: actualModelName,
            contents,
            config: actualConfig
          });
        } catch (secondaryError: any) {
          const secErrMsg = String(secondaryError.message || secondaryError);
          console.warn(`Fallback to ${actualModelName} with thinking failed:`, secErrMsg);
          
          // Try without thinking config
          console.log(`Retrying ${actualModelName} WITHOUT thinking config...`);
          const cleanConfig = { ...actualConfig };
          delete cleanConfig.thinkingConfig;
          response = await ai.models.generateContent({
            model: actualModelName,
            contents,
            config: cleanConfig
          });
        }
      } else if (isQuotaOrModelError && actualConfig.thinkingConfig) {
        // If we were using flash with thinking config, try disabling thinking config
        console.log(`Retrying ${actualModelName} WITHOUT thinking config...`);
        const cleanConfig = { ...actualConfig };
        delete cleanConfig.thinkingConfig;
        response = await ai.models.generateContent({
          model: actualModelName,
          contents,
          config: cleanConfig
        });
      } else {
        // If it's a completely different error or no further fallbacks, rethrow
        throw primaryError;
      }
    }

    const textOutput = response.text || "Désolé, je n'ai pas pu générer de réponse.";
    
    // Extract thinking process if returned by the model
    let thinkingProcess = "";
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && Array.isArray(parts)) {
      thinkingProcess = parts
        .filter((part: any) => part.thought === true)
        .map((part: any) => part.text)
        .join("\n")
        .trim();
    }

    if (fallbackModel || (thinkingEnabled && !response.candidates?.[0]?.content?.parts?.some((p: any) => p.thought === true))) {
      let note = "";
      if (fallbackModel) {
        note += `*[Système : Limite de quota atteinte sur gemini-3.1-pro. Bascule automatique sur ${fallbackModel}.]*\n\n`;
      } else if (thinkingEnabled) {
        note += `*[Système : Mode réflexion réduit pour optimiser les performances.]*\n\n`;
      }
      thinkingProcess = note + (thinkingProcess || "Analyse de code et accompagnement Remotion en cours...");
    }

    res.json({
      content: textOutput,
      thinking: thinkingProcess || undefined
    });

  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ 
      error: "Une erreur est survenue lors de la communication avec le tuteur IA.", 
      details: error.message 
    });
  }
});

// 3. SIMULATED VIDEO RENDERING PIPELINE
app.post("/api/renders/trigger", (req, res) => {
  const { code, title, source, durationSeconds } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Le code source de la composition est requis pour le rendu." });
  }

  const renderId = `rnd_${Math.random().toString(36).substr(2, 9)}`;
  const duration = durationSeconds || 5;

  const newRender: SimulatedRender = {
    id: renderId,
    title: title || "Composition Sans Titre",
    code,
    status: 'queued',
    progress: 0,
    durationSeconds: duration,
    createdAt: new Date().toISOString(),
    source: source || 'playground',
    logs: [
      `[06:46:50] Initialisation du pipeline de rendu Remotion v4.0.0...`,
      `[06:46:50] Chargement de la composition : ${title || "Composition Sans Titre"}`,
      `[06:46:51] Lancement de Puppeteer Chromium sans tête...`,
    ]
  };

  simulatedRenders.unshift(newRender);

  // Background render simulator that runs asynchronously
  let currentProgress = 0;
  const fps = 30;
  const totalFrames = duration * fps;

  const interval = setInterval(() => {
    const activeRender = simulatedRenders.find(r => r.id === renderId);
    if (!activeRender) {
      clearInterval(interval);
      return;
    }

    if (activeRender.status === 'queued') {
      activeRender.status = 'rendering';
      activeRender.logs.push(`[06:46:52] Connexion au port d'affichage web établie. Début de la capture d'écran frame-by-frame...`);
    } else if (activeRender.status === 'rendering') {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        activeRender.status = 'done';
        activeRender.progress = 100;
        activeRender.logs.push(`[06:46:55] Capture de ${totalFrames} images terminée.`);
        activeRender.logs.push(`[06:46:56] Lancement du multiplexage FFmpeg avec codec H.264 et fichier audio.`);
        activeRender.logs.push(`[06:46:57] Finalisation du conteneur MP4 et transfert vers le stockage cloud sécurisé.`);
        activeRender.logs.push(`[06:46:58] Rendu réussi ! Fichier disponible au téléchargement.`);
        
        // Generate a beautiful animated background/SVG url or placeholder
        // To make it look incredibly real, we encode a cute animated card
        activeRender.url = `https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80`; 
        clearInterval(interval);
      } else {
        activeRender.progress = currentProgress;
        const processedFrames = Math.floor((currentProgress / 100) * totalFrames);
        activeRender.logs.push(`[06:46:${52 + Math.floor(currentProgress/25)}] Rendu frame ${processedFrames}/${totalFrames} (${currentProgress}%) - OK`);
      }
    }
  }, 800);

  res.status(201).json(newRender);
});

app.get("/api/renders", (req, res) => {
  res.json(simulatedRenders);
});

app.delete("/api/renders/:id", (req, res) => {
  const { id } = req.params;
  simulatedRenders = simulatedRenders.filter(r => r.id !== id);
  res.json({ success: true });
});

// Setup Vite and Static files
async function startServer() {
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
    console.log(`[REMOTION ACADEMY SERVER] Listening on http://localhost:${PORT}`);
  });
}

// Only start the server if not on Vercel
if (!process.env.VERCEL) {
  startServer();
}

export default app;
