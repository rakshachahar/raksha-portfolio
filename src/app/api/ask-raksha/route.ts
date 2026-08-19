import { NextRequest, NextResponse } from "next/server";

// ─── Portfolio knowledge base for retrieval ─────────────────────────────────
// This is a simplified retrieval system that selects relevant portfolio context
// based on question classification, rather than sending the entire portfolio.

import {
  profile,
  experience,
  projects,
  skills,
  achievements,
  certifications,
  events,
  aiGrounding,
} from "@/data/portfolioData";

type Category =
  | "profile"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "achievements"
  | "certifications"
  | "community"
  | "resume"
  | "contact"
  | "general";

function classifyQuestion(question: string): Category[] {
  const q = question.toLowerCase();
  const categories: Category[] = [];

  if (q.includes("project") || q.includes("built") || q.includes("build") || q.includes("rag") || q.includes("app"))
    categories.push("projects");
  if (q.includes("skill") || q.includes("tech") || q.includes("language") || q.includes("framework") || q.includes("python") || q.includes("ai") || q.includes("ml"))
    categories.push("skills");
  if (q.includes("experience") || q.includes("intern") || q.includes("work") || q.includes("job") || q.includes("flyrank") || q.includes("ibm") || q.includes("open source"))
    categories.push("experience");
  if (q.includes("achievement") || q.includes("hackathon") || q.includes("winner") || q.includes("finalist") || q.includes("award"))
    categories.push("achievements");
  if (q.includes("certif") || q.includes("course") || q.includes("credential"))
    categories.push("certifications");
  if (q.includes("communit") || q.includes("event") || q.includes("conference") || q.includes("meet"))
    categories.push("community");
  if (q.includes("education") || q.includes("college") || q.includes("university") || q.includes("degree") || q.includes("cgpa") || q.includes("study"))
    categories.push("education");
  if (q.includes("resume") || q.includes("cv"))
    categories.push("resume");
  if (q.includes("contact") || q.includes("email") || q.includes("linkedin") || q.includes("github") || q.includes("reach"))
    categories.push("contact");
  if (isProfileQuestion(q))
    categories.push("profile");

  // Recognize verified portfolio entities even when a visitor does not use a
  // generic category word such as "project" or "experience".
  if (projects.some((project) => q.includes(project.name.toLowerCase())))
    categories.push("projects");
  if (experience.some((item) => q.includes(item.organization.toLowerCase())))
    categories.push("experience");
  if (achievements.some((item) => q.includes(item.title.toLowerCase())))
    categories.push("achievements");
  if (certifications.some((item) => q.includes(item.title.toLowerCase())))
    categories.push("certifications");
  if (events.some((item) => q.includes(item.name.toLowerCase())))
    categories.push("community");

  if (categories.length === 0) categories.push("general");
  return Array.from(new Set(categories));
}

function isProfileQuestion(question: string): boolean {
  return ["about", "who", "tell me", "introduce", "background", "profile"].some((term) => question.includes(term));
}

function mentionsVerifiedPortfolioEntity(question: string): boolean {
  const q = question.toLowerCase();
  return [
    ...projects.map((item) => item.name),
    ...experience.map((item) => item.organization),
    ...achievements.map((item) => item.title),
    ...certifications.map((item) => item.title),
    ...events.map((item) => item.name),
  ].some((term) => q.includes(term.toLowerCase()));
}

function isGroundedPortfolioQuestion(question: string): boolean {
  const q = question.toLowerCase();
  const prohibitedTerms = [
    "boyfriend", "girlfriend", "relationship", "married", "private life",
    "salary", "pay", "address", "phone number", "home address", "where does she live",
    "revenue", "users", "downloads", "accuracy", "metric", "metrics", "performance",
    "how many people", "future job", "future employment", "next job", "will she work",
    "will raksha work", "what will she", "where will she", "when will she",
  ];

  if (prohibitedTerms.some((term) => q.includes(term))) return false;

  const portfolioSubjectTerms = [
    "raksha", "she", "her", "portfolio", "resume", "project", "skill", "experience",
    "intern", "achievement", "certif", "community", "event", "education", "contact",
    "github", "linkedin",
  ];

  return portfolioSubjectTerms.some((term) => q.includes(term)) || mentionsVerifiedPortfolioEntity(question);
}

function findVerifiedProject(question: string) {
  const q = question.toLowerCase();
  return projects.find((project) => q.includes(project.name.toLowerCase()));
}

function retrieveContext(categories: Category[]): string {
  const parts: string[] = [];

  for (const cat of categories) {
    switch (cat) {
      case "profile":
      case "education":
        parts.push(
          `PROFILE: ${profile.name}, ${profile.headline}. ${profile.summary} Education: ${profile.education.degree} at ${profile.education.institution} (${profile.education.affiliation}), CGPA: ${profile.education.cgpa}, Expected: ${profile.education.graduation}. Location: ${profile.location}.`
        );
        break;
      case "experience":
        parts.push(
          "EXPERIENCE:\n" +
            experience
              .map(
                (e) =>
                  `- ${e.role} at ${e.organization} (${e.period}, ${e.mode}). ${e.points.join(". ")}.${e.project ? ` Project: ${e.project} (${e.projectStatus}).` : ""}`
              )
              .join("\n")
        );
        break;
      case "projects":
        parts.push(
          "PROJECTS:\n" +
            projects
              .map(
                (p) =>
                  `- ${p.name} [${p.status}] (${p.category}): ${p.purpose} Tech: ${p.stack.join(", ")}. Facts: ${p.facts.join(", ")}.${p.github ? ` GitHub: ${p.github}` : ""}${p.demo ? ` Demo: ${p.demo}` : ""}${p.limitations ? ` Limitation: ${p.limitations}` : ""}`
              )
              .join("\n")
        );
        break;
      case "skills":
        parts.push(
          "SKILLS:\n" +
            skills
              .map((s) => `- ${s.category}: ${s.items.join(", ")}`)
              .join("\n")
        );
        break;
      case "achievements":
        parts.push(
          "ACHIEVEMENTS:\n" +
            achievements
              .map(
                (a) =>
                  `- ${a.title}${a.organization ? ` (${a.organization})` : ""}${a.track ? ` — ${a.track}` : ""}${a.team ? ` — Team: ${a.team}` : ""}${a.scale ? ` — Scale: ${a.scale}` : ""}`
              )
              .join("\n")
        );
        break;
      case "certifications":
        parts.push(
          "CERTIFICATIONS:\n" +
            certifications
              .map(
                (c) => `- ${c.title} — ${c.issuer} (${c.issued})`
              )
              .join("\n")
        );
        break;
      case "community":
        parts.push(
          "COMMUNITY & EVENTS:\n" +
            events
              .map(
                (e) =>
                  `- ${e.name} at ${e.location}. Themes: ${e.themes.join(", ")}.`
              )
              .join("\n")
        );
        break;
      case "resume":
        parts.push("RESUME: Raksha's resume is available as a PDF document in the portfolio. Action: OPEN_RESUME");
        break;
      case "contact":
        parts.push(
          `CONTACT: Email: ${profile.email}, LinkedIn: ${profile.linkedin}, GitHub: ${profile.github}`
        );
        break;
      case "general":
        parts.push(
          `PROFILE: ${profile.name}, ${profile.headline}. ${profile.summary}`
        );
        break;
    }
  }

  return parts.join("\n\n");
}

function buildSystemPrompt(): string {
  return `You are Ask Raksha, a portfolio-specific AI assistant for Raksha Chahar.

MISSION: Answer questions ONLY about Raksha Chahar and her verified professional/academic portfolio.

RULES:
- Use only the retrieved portfolio context supplied below. Do not use general model knowledge to fill missing facts.
- Never invent achievements, dates, internships, responsibilities, project metrics, technologies, employers, awards, rankings, personal preferences, future events, or personal facts.
- If information is unavailable: "${aiGrounding.unknownResponse}"
- For unrelated requests: "${aiGrounding.unrelatedResponse}"
- ${aiGrounding.futureRule}
- ${aiGrounding.privateRule}

STYLE:
- Be concise (1-4 sentences for simple questions, short bullets for lists)
- Do not repeat the question
- Do not add unnecessary background

UI ACTIONS (include when appropriate):
- When mentioning projects, add: [OPEN_PROJECTS]
- When mentioning experience/internships, add: [OPEN_EXPERIENCE]
- When mentioning skills, add: [OPEN_SKILLS]
- When mentioning achievements, add: [OPEN_ACHIEVEMENTS]
- When mentioning certifications, add: [OPEN_CERTIFICATIONS]
- When mentioning community/events, add: [OPEN_COMMUNITY]
- When asked to show resume, add: [OPEN_RESUME]
- When mentioning profile/about, add: [OPEN_ABOUT]
- When mentioning contact info, add: [OPEN_CONTACT]`;
}

export async function POST(request: NextRequest) {
  try {
    const { question, history } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (!isGroundedPortfolioQuestion(question)) {
      return NextResponse.json({ response: aiGrounding.unknownResponse });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, use a fallback that answers from portfolio data directly
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return handleFallback(question);
    }

    // Classify and retrieve context
    const categories = classifyQuestion(question);
    const context = retrieveContext(categories);
    const systemPrompt = buildSystemPrompt();

    // Build messages
    const messages = [
      {
        role: "user" as const,
        parts: [{ text: `${systemPrompt}\n\nPORTFOLIO CONTEXT:\n${context}\n\nUSER QUESTION: ${question}` }],
      },
    ];

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.3,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return handleFallback(question);
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm having trouble responding right now. Please try again.";

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Ask Raksha error:", error);
    return NextResponse.json(
      {
        response:
          "Ask Raksha is temporarily unavailable. The rest of the portfolio is still accessible.",
      },
      { status: 200 }
    );
  }
}

// ─── Fallback: answer directly from portfolio data without AI ───────────────

function handleFallback(question: string): NextResponse {
  const categories = classifyQuestion(question);
  let response = "";

  // Check if unrelated
  const q = question.toLowerCase();
  const relatedKeywords = [
    "raksha", "project", "skill", "experience", "intern", "achieve", "certif",
    "communit", "event", "education", "resume", "contact", "build", "work",
    "hackathon", "rag", "ai", "ml", "python", "about", "who", "tell",
  ];
  const isRelated = relatedKeywords.some((kw) => q.includes(kw)) || mentionsVerifiedPortfolioEntity(question);

  if (!isRelated) {
    return NextResponse.json({
      response: aiGrounding.unknownResponse,
    });
  }

  if (categories.length === 1 && categories[0] === "general") {
    return NextResponse.json({ response: aiGrounding.unknownResponse });
  }

  if (categories.includes("projects")) {
    const project = findVerifiedProject(question);
    response = project
      ? `**${project.name}** (${project.category}) — ${project.purpose} Tech: ${project.stack.join(", ")}.\n\n[OPEN_PROJECTS]`
      : "Raksha has built several AI/ML projects:\n\n" +
        projects
          .filter((p) => p.status !== "Public Archive" || p.facts.length > 1)
          .map(
            (p) => `• **${p.name}** (${p.category}) — ${p.purpose.split(".")[0]}.`
          )
          .join("\n") +
        "\n\n[OPEN_PROJECTS]";
  } else if (categories.includes("skills")) {
    response =
      "Raksha's technical skills include:\n\n" +
      skills.map((s) => `• **${s.category}**: ${s.items.join(", ")}`).join("\n") +
      "\n\n[OPEN_SKILLS]";
  } else if (categories.includes("experience")) {
    response =
      "Raksha's experience includes:\n\n" +
      experience
        .map((e) => `• **${e.role}** at ${e.organization} (${e.period})`)
        .join("\n") +
      "\n\n[OPEN_EXPERIENCE]";
  } else if (categories.includes("achievements")) {
    response =
      "Raksha's achievements include:\n\n" +
      achievements.map((a) => `• ${a.title}`).join("\n") +
      "\n\n[OPEN_ACHIEVEMENTS]";
  } else if (categories.includes("certifications")) {
    response =
      "Raksha holds these certifications:\n\n" +
      certifications.map((c) => `• ${c.title} — ${c.issuer}`).join("\n") +
      "\n\n[OPEN_CERTIFICATIONS]";
  } else if (categories.includes("community")) {
    response =
      "Raksha has participated in these events:\n\n" +
      events
        .map((e) => `• **${e.name}** at ${e.location}`)
        .join("\n") +
      "\n\n[OPEN_COMMUNITY]";
  } else if (categories.includes("resume")) {
    response = "Opening Raksha's resume for you.\n\n[OPEN_RESUME]";
  } else if (categories.includes("contact")) {
    response = `You can reach Raksha at:\n\n• Email: ${profile.email}\n• LinkedIn: ${profile.linkedin}\n• GitHub: ${profile.github}\n\n[OPEN_CONTACT]`;
  } else if (categories.includes("education")) {
    response = `Raksha is pursuing a ${profile.education.degree} from ${profile.education.institution} (${profile.education.affiliation}). CGPA: ${profile.education.cgpa}. Expected graduation: ${profile.education.graduation}.\n\n[OPEN_ABOUT]`;
  } else {
    response = `${profile.name} — ${profile.headline}\n\n${profile.summary}\n\n[OPEN_ABOUT]`;
  }

  return NextResponse.json({ response });
}
