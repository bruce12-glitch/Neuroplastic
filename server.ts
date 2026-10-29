import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "10mb" }));

// Persistent Server-Side JSON Database Store (Complements Cloud Firestore)
const DB_FILE_PATH = path.resolve(process.cwd(), "db_store.json");

interface ServerDbStore {
  blogs: any[];
  comments: any[];
}

function readDbStore(): ServerDbStore {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      return {
        blogs: Array.isArray(parsed.blogs) ? parsed.blogs : [],
        comments: Array.isArray(parsed.comments) ? parsed.comments : [],
      };
    }
  } catch (err) {
    console.error("Failed to read db_store.json:", err);
  }
  return { blogs: [], comments: [] };
}

function writeDbStore(store: ServerDbStore): void {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write db_store.json:", err);
  }
}

app.get("/api/db/blogs", (_req, res) => {
  const store = readDbStore();
  res.json({ blogs: store.blogs, comments: store.comments });
});

app.post("/api/db/blogs", (req, res) => {
  const { essay } = req.body;
  if (!essay || !essay.id || !essay.title) {
    return res.status(400).json({ error: "Valid essay object is required" });
  }
  const store = readDbStore();
  const exists = store.blogs.some((b) => b.id === essay.id);
  if (exists) {
    store.blogs = store.blogs.map((b) => (b.id === essay.id ? essay : b));
  } else {
    store.blogs = [essay, ...store.blogs];
  }
  writeDbStore(store);
  return res.json({ ok: true, blogs: store.blogs });
});

app.delete("/api/db/blogs/:id", (req, res) => {
  const { id } = req.params;
  const store = readDbStore();
  store.blogs = store.blogs.filter((b) => b.id !== id);
  writeDbStore(store);
  return res.json({ ok: true, blogs: store.blogs });
});

app.post("/api/db/comments", (req, res) => {
  const { comment } = req.body;
  if (!comment || !comment.id) {
    return res.status(400).json({ error: "Valid comment object is required" });
  }
  const store = readDbStore();
  const exists = store.comments.some((c) => c.id === comment.id);
  if (exists) {
    store.comments = store.comments.map((c) => (c.id === comment.id ? comment : c));
  } else {
    store.comments = [comment, ...store.comments];
  }
  writeDbStore(store);
  return res.json({ ok: true, comments: store.comments });
});

// Initialize GoogleGenAI client (Server-Side ONLY)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

/**
 * 1. AI Search Grounding Endpoint (gemini-3.8-flash with googleSearch tool)
 */
app.post("/api/ai/search-grounded", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
        fallback: `Search Grounding for "${query}": Please configure your API key in AI Studio Secrets to enable live web retrieval.`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Provide an authoritative, rigorous synthesis of the latest academic and technological research regarding: "${query}". Include citations and recent experimental breakthroughs in AI, cognitive science, or epistemology.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No synthesis generated.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return res.json({
      text,
      groundingMetadata,
    });
  } catch (error: any) {
    console.error("Search Grounding API Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to execute search grounding",
    });
  }
});

/**
 * 2. High Thinking Conceptual Synthesis (gemini-4-argon with thinkingLevel: HIGH)
 */
app.post("/api/ai/synthesize", async (req, res) => {
  try {
    const { conceptA, conceptB, prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
        fallback: `Cross-Pillar Synthesis: Synthesis requires GEMINI_API_KEY. Connect Philosophy and AI research directly through active inference frameworks.`,
      });
    }

    const userPrompt =
      prompt ||
      `Synthesize a profound dialectical bridge connecting:
1. "${conceptA || "Epistemic Solipsism in Philosophy"}"
2. "${conceptB || "Entropy Context Pruning in AI Transformers"}"

Structure your response into:
- The Fundamental Isomorphism (Why these two apparent opposites share identical mechanics)
- The Epistemological Trade-off
- Practical Cognitive Heuristic for modern thinkers`;

    const response = await ai.models.generateContent({
      model: "gemini-4-argon",
      contents: userPrompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    return res.json({
      text: response.text || "No synthesis returned.",
    });
  } catch (error: any) {
    console.error("Deep Thinking Synthesis Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to execute thinking synthesis",
    });
  }
});

/**
 * 3. High-Quality Concept Image Generation (gemini-3-pro-image with 1K, 2K, 4K)
 */
app.post("/api/ai/generate-concept-image", async (req, res) => {
  try {
    const { prompt, size = "1K" } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const validSizes = ["1K", "2K", "4K"];
    const chosenSize = validSizes.includes(size) ? size : "1K";

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image",
      contents: {
        parts: [
          {
            text: `Editorial minimalist line art illustration, Notion meets Duolingo tactile aesthetic: ${prompt}. Clean vector ink strokes, warm off-white paper background, single bright accent pop, high resolution editorial diagram.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: chosenSize as "1K" | "2K" | "4K",
        },
      },
    });

    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(422).json({ error: "No image generated by model" });
    }

    return res.json({ imageUrl, size: chosenSize });
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate concept image",
    });
  }
});

// Mount Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Neuroplastic server running on http://localhost:${PORT}`);
  });
}

startServer();
