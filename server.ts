import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will require external setup on the settings panel.");
    throw new Error("GEMINI_API_KEY environment variable is required but missing. Please add it to your environment secrets.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiInstance;
}

// Ensure the server fails gracefully if Gemini Key is absent when APIs are hit
function handleApiError(res: express.Response, error: any, contextMsg: string) {
  console.error(`Error in ${contextMsg}:`, error);
  const msg = error instanceof Error ? error.message : "Internal Server Error";
  res.status(500).json({
    error: msg,
    details: `Failed to perform: ${contextMsg}. Ensure your API Keys are configured in your Secrets settings.`,
  });
}

// Endpoint 1: Rewrite bullet point or experience description
app.post("/api/resume/improve", async (req, res) => {
  try {
    const { textToImprove, context, targetRole } = req.body;
    if (!textToImprove) {
      return res.status(400).json({ error: "textToImprove is required" });
    }

    const ai = getGeminiClient();
    const prompt = `
You are a elite ATS Resume Writer and Career Coach. 
Improve the following resume bullet point or professional description to be highly professional, high-impact, and ATS-friendly.

Input text: "${textToImprove}"
${targetRole ? `Target Role: "${targetRole}"` : ""}
${context ? `Additional Context/Job description: "${context}"` : ""}

Guidelines:
1. Start with a powerful primary Action Verb (e.g., Spearheaded, Orchestrated, Engineered, Revitalized).
2. Avoid generic weak verbs like "helped", "assisted", "did", "managed", "worked on".
3. Quantify achievements with metrics, percentages, dollar amounts, or timeframe calculations wherever plausible. If no metrics are provided, generate a plausible metric placeholder in brackets or reasonably extrapolate (e.g., "[X]%", "reduced latency by [Y]%") so the user knows where to fill it in.
4. Keep it concise, action-driven, and clear.
5. Highlight industry-specific keywords relevant to the target role.

Output EXACTLY the rewritten text. Do not include introductory text, quote marks, or conversational remarks. Just the final rewritten sentence.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const rewritten = response.text?.trim() || textToImprove;
    res.json({ improvedText: rewritten });
  } catch (error) {
    handleApiError(res, error, "improve bullet point");
  }
});

// Endpoint 2: Generate a tailored Professional Summary or Career Objective
app.post("/api/resume/summary", async (req, res) => {
  try {
    const { fullName, targetRole, skills, experience, projects, type } = req.body;
    
    const ai = getGeminiClient();
    const isObjective = type === "objective";
    
    const prompt = `
You are an expert ATS Resume Writer and Career Coach.
Generate a compelling ${isObjective ? "Career Objective" : "Professional Summary"} for a resume.

User Profile:
- Name: ${fullName || "Applicant"}
- Target Role/Title: ${targetRole || "Professional"}
- Top Skills: ${Array.isArray(skills) ? skills.join(", ") : "Various industry skills"}
- Key Experience highlights: ${JSON.stringify(experience || "")}
- Main Projects: ${JSON.stringify(projects || "")}

Instructions:
1. For a **Professional Summary**: Create a powerful, 3-4 sentence paragraph that showcases total years of valuable experience, core domain expertise, major accomplishments (using impact metrics), and key tech/business competencies.
2. For a **Career Objective**: Create a highly refined 2-3 sentence paragraph perfect for freshers, students, or career-changers. Focus on eagerness to apply modern skills, motivation to bring immediate value to the organization, and academic achievements.
3. Optimize it for ATS scanners by seamlessly weaving in prominent key phrases.
4. Do not invent false names of companies or major degrees. Focus on generic high-value achievements.

Output only the generated paragraph text. No introductions, headers, or outer quotes.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const summaryText = response.text?.trim() || "";
    res.json({ summary: summaryText });
  } catch (error) {
    handleApiError(res, error, "generate resume summary");
  }
});

// Endpoint 3: Analyze Resume against target job description (ATS scoring & keyword mapping)
app.post("/api/resume/analyze", async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: "resumeData is required" });
    }

    const ai = getGeminiClient();
    const prompt = `
You are an expert Applicant Tracking System (ATS) parser and Career Coach.
Analyze the following resume payload against the provided job description to evaluate its alignment and ATS compliance.

Target Job Description:
"${jobDescription || "General Professional Alignment (No specific role provided)"}"

Resume Data:
${JSON.stringify(resumeData)}

Perform a thorough diagnostic and output the results as a JSON object adhering exactly to the schema requested below.

Important Evaluation Dimensions:
1. **ATS Score (0 to 100)**: Evaluate keyword density, clear headings, missing vital sections, metric/results density, and formatting criteria.
2. **Missing Vital Keywords**: Identify critical tech stack keywords, industry methodologies, or soft/hard skills present in the job description that are missing or sparse in the candidate's resume.
3. **Praiseworthy Aspects**: List things done really well (e.g., strong action verbs, clear layout, readable education structure).
4. **Actionable Suggestions**: Concrete, high-value revisions to boost the score. Be highly practical and specific.
5. **Formatting Critique**: Review structural factors like bullet point counts, summary length, skills formatting, and potential red flags.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "atsScore",
            "praiseList",
            "missingKeywords",
            "actionableSuggestions",
            "formattingCritique"
          ],
          properties: {
            atsScore: {
              type: Type.INTEGER,
              description: "An integer score out of 100 representing general ATS compatibility & job match"
            },
            praiseList: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of positive elements in the resume"
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Critical high-value keywords missing from the skills or experience section"
            },
            actionableSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Practical suggestions for improving experience bullets, summary, or alignment"
            },
            formattingCritique: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Critiques about structure, lengths, over-complications, or visual design"
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json(result);
  } catch (error) {
    handleApiError(res, error, "analyze ATS resume metrics");
  }
});

// Endpoint 4: Interactive Career Coach & Interview Prep Chat
app.post("/api/coach/chat", async (req, res) => {
  try {
    const { messages, resumeData, jobDescription } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const ai = getGeminiClient();

    // Take the last few messages for clean context
    const recentMessages = messages.slice(-8);
    const chatHistoryPrompt = recentMessages.map(m => `${m.role === "user" ? "Candidate" : "Coach"}: ${m.content}`).join("\n");

    const systemInstruction = `
You are an expert human Career Coach and Senior Technical Recruiter.
Analyze the candidate's current resume and target job description:

Current Resume JSON:
${JSON.stringify(resumeData || {})}

Target Job Description (if any):
"${jobDescription || "General Career Progression Assistance"}"

Provide warm, insightful, practical, and constructive advice. Your tone should be highly professional, motivating, and authoritative yet empathetic.

Focus on:
1. Explaining how to articulate specific technical wins or career transitions.
2. Helping them frame answers to complex behavioral questions (STAR method).
3. Recommending core certifications or high-leverage skills to acquire.
4. Correcting common gaps or red flags in their engineering, corporate, or management backgrounds.

Be brief (2-3 concise paragraphs maximum per turn) to keep the conversation engaging.
    `.trim();

    const prompt = `
System Context & Resume:
${systemInstruction}

Conversation History:
${chatHistoryPrompt}

Coach: Please respond to the candidate's latest utterance. Be helpful, specific, and directly reference actionable strategies based on their resume elements if relevant.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const reply = response.text?.trim() || "I am processing your background. How can I best guide your career objectives today?";
    res.json({ message: reply });
  } catch (error) {
    handleApiError(res, error, "career coach counseling");
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
