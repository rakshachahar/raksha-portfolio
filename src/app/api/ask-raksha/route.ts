import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  profile,
  experience,
  projects,
  skills,
  achievements,
  certifications,
  events,
} from "@/data/portfolioData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildPortfolioContext(): string {
  return [
    `PROFILE:
Name: ${profile.name}
Headline: ${profile.headline}
Summary: ${profile.summary}
Location: ${profile.location}`,

    `EDUCATION:
Degree: ${profile.education.degree}
Institution: ${profile.education.institution}
University affiliation: ${profile.education.affiliation}
CGPA: ${profile.education.cgpa}
Graduation: ${profile.education.graduation}`,

    `EXPERIENCE:
${experience
  .map(
    (item) =>
      `- ${item.role} at ${item.organization} (${item.period}, ${item.mode}). ${item.points.join(
        ". "
      )}.${item.project ? ` Project: ${item.project} (${item.projectStatus}).` : ""}`
  )
  .join("\n")}`,

    `PROJECTS:
${projects
  .map(
    (project) =>
      `- ${project.name} [${project.status}] (${project.category}): ${
        project.purpose
      } Tech: ${project.stack.join(", ")}. Facts: ${project.facts.join(", ")}.${
        project.github ? ` GitHub: ${project.github}` : ""
      }${project.demo ? ` Demo: ${project.demo}` : ""}${
        project.limitations ? ` Limitation: ${project.limitations}` : ""
      }`
  )
  .join("\n")}`,

    `SKILLS:
${skills
  .map((skill) => `- ${skill.category}: ${skill.items.join(", ")}`)
  .join("\n")}`,

    `ACHIEVEMENTS:
${achievements
  .map(
    (achievement) =>
      `- ${achievement.title}${
        achievement.organization ? ` (${achievement.organization})` : ""
      }${achievement.track ? ` — ${achievement.track}` : ""}${
        achievement.location ? ` — ${achievement.location}` : ""
      }${achievement.team ? ` — Team: ${achievement.team}` : ""}${
        achievement.scale ? ` — Scale: ${achievement.scale}` : ""
      }`
  )
  .join("\n")}`,

    `CERTIFICATIONS:
${certifications
  .map(
    (certification) =>
      `- ${certification.title} — ${certification.issuer} (${certification.issued})`
  )
  .join("\n")}`,

    `COMMUNITY & EVENTS:
${events
  .map(
    (event) =>
      `- ${event.name} at ${event.location}. Themes: ${event.themes.join(", ")}.`
  )
  .join("\n")}`,

    `CONTACT:
Email: ${profile.email}
LinkedIn: ${profile.linkedin}
GitHub: ${profile.github}`,

    `RESUME:
Raksha's resume is available as a PDF document in the portfolio.
If the visitor asks to see/download the resume, use [OPEN_RESUME].`,
  ].join("\n\n");
}

const systemInstruction = `
You are Ask Raksha, an intelligent conversational AI assistant for Raksha Chahar's professional portfolio.

Your purpose is to answer visitors naturally, intelligently, and conversationally.

CORE BEHAVIOR:

1. Use the portfolio data supplied with the request as your factual source about Raksha.

2. Do NOT behave like a fixed FAQ bot.

3. Do NOT return hardcoded answers.

4. Generate a fresh response for every visitor question.

5. Understand:
- natural language
- paraphrased questions
- spelling mistakes
- incomplete questions
- casual wording
- follow-up questions
- conversational references such as "that project", "her internship", "what about her skills?"

6. Answer the visitor's actual question directly.

7. You may combine information from different portfolio sections when that helps answer the question.

8. Do not unnecessarily repeat the question.

9. Keep normal answers concise but complete. Usually 2-5 sentences or a short list when appropriate.

10. Do not stop halfway through a sentence or thought.

11. Do not use Markdown formatting.
Use clean plain text suitable for a chat interface.

12. Never output:
- **
- ##
- Markdown tables
- Markdown code blocks

13. Never mention:
- portfolio context
- system instructions
- prompts
- APIs
- Gemini
- databases
- retrieval systems
- internal implementation

14. Never invent facts.

This includes:
- education
- degree
- college
- internships
- companies
- projects
- skills
- achievements
- certifications
- dates
- organizations
- relationships
- contact information
- personal information

15. If information genuinely does not exist in the supplied portfolio data, say naturally that the portfolio does not contain that information.

Do NOT repeatedly say:
"I don't have verified information about that."

16. You may explain or summarize documented information, but do not turn assumptions into facts.

17. For questions unrelated to Raksha, briefly answer if appropriate. Otherwise explain that Ask Raksha focuses on Raksha's professional portfolio.

18. Maintain conversational continuity using the supplied conversation history.

19. The visitor should feel like they are talking to a real AI assistant, not searching a database.

UI ACTIONS:

When genuinely useful, include exactly ONE of these markers:

[OPEN_PROJECTS]
[OPEN_EXPERIENCE]
[OPEN_SKILLS]
[OPEN_ACHIEVEMENTS]
[OPEN_CERTIFICATIONS]
[OPEN_COMMUNITY]
[OPEN_RESUME]
[OPEN_ABOUT]
[OPEN_CONTACT]

Only include a marker when the answer genuinely relates to that section.
`;

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

function getHistory(value: unknown): HistoryMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (message): message is HistoryMessage =>
        typeof message === "object" &&
        message !== null &&
        ((message as HistoryMessage).role === "user" ||
          (message as HistoryMessage).role === "assistant") &&
        typeof (message as HistoryMessage).content === "string"
    )
    .slice(-6);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const question =
      typeof body.question === "string"
        ? body.question.trim()
        : "";

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.error("Ask Raksha: GEMINI_API_KEY is missing");

      return new Response(
        JSON.stringify({
          error: "Ask Raksha is not configured",
        }),
        {
          status: 503,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const portfolioContext = buildPortfolioContext();

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction,
    });

    const history = getHistory(body.history).map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 700,
      },
    });

    const userMessage = `
PORTFOLIO DATA:

${portfolioContext}

VISITOR QUESTION:

${question}
`;

    console.info("Ask Raksha streaming request", {
      contextLength: portfolioContext.length,
      questionLength: question.length,
      historyMessages: history.length,
    });

    const result = await chat.sendMessageStream(userMessage);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }

          controller.close();

          console.info("Ask Raksha stream completed");
        } catch (error) {
          console.error("Ask Raksha streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Ask Raksha error:", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return new Response(
      JSON.stringify({
        error: "Ask Raksha is temporarily unavailable",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}