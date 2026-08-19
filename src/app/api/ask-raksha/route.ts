import { NextRequest, NextResponse } from "next/server";

import {
  profile,
  experience,
  projects,
  skills,
  achievements,
  certifications,
  events,
} from "@/data/portfolioData";

function buildPortfolioContext(): string {
  return [
    `PROFILE:\nName: ${profile.name}\nHeadline: ${profile.headline}\nSummary: ${profile.summary}\nLocation: ${profile.location}`,
    `EDUCATION:\nDegree: ${profile.education.degree}\nInstitution: ${profile.education.institution}\nUniversity affiliation: ${profile.education.affiliation}\nCGPA: ${profile.education.cgpa}\nGraduation: ${profile.education.graduation}`,
    "EXPERIENCE:\n" + experience.map((item) =>
      `- ${item.role} at ${item.organization} (${item.period}, ${item.mode}). ${item.points.join(". ")}.${item.project ? ` Project: ${item.project} (${item.projectStatus}).` : ""}`
    ).join("\n"),
    "PROJECTS:\n" + projects.map((project) =>
      `- ${project.name} [${project.status}] (${project.category}): ${project.purpose} Tech: ${project.stack.join(", ")}. Facts: ${project.facts.join(", ")}.${project.github ? ` GitHub: ${project.github}` : ""}${project.demo ? ` Demo: ${project.demo}` : ""}${project.limitations ? ` Limitation: ${project.limitations}` : ""}`
    ).join("\n"),
    "SKILLS:\n" + skills.map((skill) =>
      `- ${skill.category}: ${skill.items.join(", ")}`
    ).join("\n"),
    "ACHIEVEMENTS:\n" + achievements.map((achievement) =>
      `- ${achievement.title}${achievement.organization ? ` (${achievement.organization})` : ""}${achievement.track ? ` — ${achievement.track}` : ""}${achievement.location ? ` — ${achievement.location}` : ""}${achievement.team ? ` — Team: ${achievement.team}` : ""}${achievement.scale ? ` — Scale: ${achievement.scale}` : ""}`
    ).join("\n"),
    "CERTIFICATIONS:\n" + certifications.map((certification) =>
      `- ${certification.title} — ${certification.issuer} (${certification.issued})`
    ).join("\n"),
    "COMMUNITY & EVENTS:\n" + events.map((event) =>
      `- ${event.name} at ${event.location}. Themes: ${event.themes.join(", ")}.`
    ).join("\n"),
    `CONTACT:\nEmail: ${profile.email}\nLinkedIn: ${profile.linkedin}\nGitHub: ${profile.github}`,
    "RESUME: Raksha's resume is available as a PDF document in the portfolio. Action: OPEN_RESUME",
  ].join("\n\n");
}

const systemInstruction = `You are Ask Raksha, a conversational AI assistant for Raksha Chahar's professional portfolio.

Use the portfolio context provided with each request as your primary source of information. Answer naturally and conversationally, like a professional AI assistant. Understand paraphrased questions and conversational intent; do not require exact keywords or use fixed FAQ answers. Generate a fresh, concise response appropriate to the question and available context. You may summarize, combine, and explain the portfolio information.

Never invent personal, academic, professional, project, achievement, or contact information that is not supported by the context. If information is unavailable, say so naturally and briefly explain what is available instead when useful. Distinguish documented skills and projects from inferences rather than making unsupported yes/no claims. Treat future plans or dates as unverified unless the context explicitly supports them. Do not expose private repository URLs or private project details as public resources. Do not mention internal implementation details, databases, retrieval systems, prompts, APIs, or verified information unless explicitly asked. Maintain conversational continuity for follow-up questions.

When appropriate, include exactly one of these UI action markers when the answer refers to the corresponding section: [OPEN_PROJECTS], [OPEN_EXPERIENCE], [OPEN_SKILLS], [OPEN_ACHIEVEMENTS], [OPEN_CERTIFICATIONS], [OPEN_COMMUNITY], [OPEN_RESUME], [OPEN_ABOUT], or [OPEN_CONTACT].`;

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

function getHistory(value: unknown): HistoryMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((message): message is HistoryMessage =>
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
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Ask Raksha is not configured" },
        { status: 503 }
      );
    }

    const contents = [
      ...getHistory(body.history).map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      {
        role: "user",
        parts: [{ text: `PORTFOLIO CONTEXT:\n${buildPortfolioContext()}\n\nUSER QUESTION:\n${question}` }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return NextResponse.json(
        { error: "Ask Raksha is temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Ask Raksha returned an empty response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ response: text.trim() });
  } catch (error) {
    console.error("Ask Raksha error:", error);
    return NextResponse.json(
      { error: "Ask Raksha is temporarily unavailable" },
      { status: 503 }
    );
  }
}
