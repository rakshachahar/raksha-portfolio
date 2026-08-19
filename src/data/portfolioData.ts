// ─── Centralized Portfolio Data — Single Source of Truth ─────────────────────
// All UI components and AI retrieval consume this data.
// Sourced exclusively from portfolio_data.json and RAKSHA_PORTFOLIO_PROFILE.md

export interface Profile {
  name: string;
  headline: string;
  summary: string;
  education: {
    degree: string;
    institution: string;
    affiliation: string;
    cgpa: string;
    graduation: string;
  };
  email: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface Experience {
  role: string;
  organization: string;
  period: string;
  duration?: string;
  mode: string;
  points: string[];
  project?: string;
  projectStatus?: string;
  team?: string;
  logo: string;
  certificate?: string;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  category: string;
  purpose: string;
  github?: string;
  demo?: string;
  stack: string[];
  facts: string[];
  limitations?: string;
  screenshots: { label: string; src: string }[];
}

export interface Skill {
  category: string;
  icon: string;
  items: string[];
}

export interface Achievement {
  title: string;
  organization?: string;
  track?: string;
  location?: string;
  team?: string;
  scale?: string;
  type?: string;
  image?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  issued: string;
  credentialId?: string;
  image?: string;
}

export interface CommunityEvent {
  name: string;
  location: string;
  themes: string[];
  team?: string;
  image?: string;
}

// ─── PROFILE ────────────────────────────────────────────────────────────────

export const profile: Profile = {
  name: "Raksha Chahar",
  headline:
    "AI/ML Engineer | Python | Machine Learning | Generative AI | RAG Systems | LangChain | PyTorch | Building AI Applications",
  summary:
    "AI/ML undergraduate focused on building practical AI applications that combine machine learning, information retrieval, Generative AI and software engineering. Strongest documented area is Retrieval-Augmented Generation, with work spanning semantic retrieval, vector search, LLM integration and grounded question answering. Portfolio includes civic-tech intelligence, privacy-focused safety technology, AI-for-education conceptual work, and open-source contribution.",
  education: {
    degree: "B.Tech in Artificial Intelligence & Machine Learning",
    institution: "World College of Technology & Management (WCTM), Gurugram",
    affiliation: "Affiliated to Maharshi Dayanand University (MDU), Rohtak",
    cgpa: "8.86 / 10.00",
    graduation: "May 2028",
  },
  email: "rakshachahar336@gmail.com",
  linkedin: "https://www.linkedin.com/in/raksha-chahar",
  github: "https://github.com/rakshachahar",
  location: "Haryana, India",
};

// ─── EXPERIENCE ─────────────────────────────────────────────────────────────

export const experience: Experience[] = [
  {
    role: "Machine Learning Intern",
    organization: "FlyRank AI",
    period: "Jul 2026 – Present",
    mode: "Remote",
    points: [
      "Contributes to machine-learning workflows and applied ML engineering practices across production AI projects",
      "Builds Generative AI applications in Python spanning RAG pipelines and LLM-based systems",
      "Applies data processing, model evaluation and AI system design principles in a live engineering environment",
    ],
    logo: "/assets/experience/logos/flyrank.jpg",
    certificate: "/assets/experience/certificates/flyrank-confirmation.pdf",
  },
  {
    role: "AI Automation & Intelligent Solutions Intern",
    organization: "BharatCares (IBM SkillsBuild, with AICTE)",
    period: "Jun – Jul 2026",
    duration: "6 weeks",
    mode: "Remote",
    points: [
      "Worked in Team LOGIC LOOP on the conceptualization of EduAgent AI, an AI-powered learning assistant for students",
      "Designed a personalized academic support and study-planning concept",
      "Collaborated under IBM SkillsBuild mentorship and presented the final concept to program evaluators",
    ],
    project: "EduAgent AI",
    projectStatus: "conceptualized/proposed",
    team: "LOGIC LOOP",
    logo: "/assets/experience/logos/bharatcares.jpg",
    certificate: "/assets/experience/certificates/ibm-skillsbuild.jpg",
  },
  {
    role: "Open Source Contributor",
    organization: "GSSoC 2026, SSoC 2026 & Nexus Spring of Code",
    period: "May 2026 – Present",
    mode: "Remote",
    points: [
      "Resolves issues and ships feature enhancements through pull requests",
      "Works with Git/GitHub workflows and community code-review practices",
      "Improves documentation for community-driven development",
    ],
    logo: "/assets/experience/logos/girlscriptsoc.jpg",
    certificate: "/assets/experience/certificates/certificate-nsoc.png",
  },
];

// ─── PROJECTS ───────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "scientific-literature-explorer",
    name: "Scientific Literature Explorer",
    status: "Live",
    category: "RAG / NLP",
    purpose:
      "Research-paper question-answering application that allows users to upload papers and ask questions in natural language, with answers grounded in retrieved document context.",
    github:
      "https://github.com/rakshachahar/scientific-literature-explorer-rag",
    demo: "https://scientific-literature-explorer-rag.streamlit.app/",
    stack: [
      "Python",
      "LangChain",
      "FAISS",
      "Sentence Transformers",
      "Streamlit",
      "OpenRouter API",
      "ScaleDown API",
    ],
    facts: [
      "PDF ingestion and text chunking",
      "Sentence Transformer embeddings",
      "FAISS vector search and semantic retrieval",
      "Context building and optional prompt compression",
      "LLM generation through OpenRouter",
      "Retrieval across 500+ document chunks",
      "Public Streamlit deployment",
      "Built under Intel Unnati Data-Centric Labs initiative",
    ],
    limitations:
      "No verified numerical accuracy percentage — do not claim one.",
    screenshots: [
      {
        label: "Hero",
        src: "/assets/projects/scientific-literature-explorer/hero.png",
      },
      {
        label: "Interface",
        src: "/assets/projects/scientific-literature-explorer/interface.png",
      },
      {
        label: "Workflow",
        src: "/assets/projects/scientific-literature-explorer/workflow.png",
      },
    ],
  },
  {
    id: "community-pulse-ai",
    name: "CommunityPulse AI",
    status: "Live",
    category: "Civic AI",
    purpose:
      "AI-powered civic issue intelligence platform that transforms citizen complaints into structured insights with severity detection, priority detection, and department recommendations.",
    github: "https://github.com/rakshachahar/community-pulse-ai",
    demo: "https://community-pulse-ai.onrender.com/",
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Google Gemini",
      "PostgreSQL",
      "Drizzle ORM",
      "Zod",
      "Recharts",
    ],
    facts: [
      "Civic issue reporting interface",
      "AI analysis using Google Gemini",
      "Severity and priority detection",
      "Responsible-department recommendation",
      "Suggested actions for issue resolution",
      "Admin dashboard for complaint management",
      "Responsive interface",
    ],
    limitations:
      "AI-generated analysis may occasionally be inaccurate and should be reviewed by humans before real-world action.",
    screenshots: [
      { label: "Hero", src: "/assets/projects/community-pulse-ai/hero.png" },
      {
        label: "Dashboard",
        src: "/assets/projects/community-pulse-ai/dashboard.png",
      },
      {
        label: "Architecture",
        src: "/assets/projects/community-pulse-ai/architecture.png",
      },
      {
        label: "Workflow",
        src: "/assets/projects/community-pulse-ai/workflow.png",
      },
    ],
  },
  {
    id: "anonymous-safety-intelligence",
    name: "Anonymous Safety Intelligence System / SafeVoice",
    status: "Live",
    category: "Safety Intelligence",
    purpose:
      "Privacy-focused platform for anonymous incident reporting and community-level safety intelligence with geospatial analytics.",
    github:
      "https://github.com/rakshachahar/anonymous-safety-intelligence-system",
    demo: "https://anonymous-safety-intelligence-syste.vercel.app/",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Supabase",
      "PostgreSQL",
      "Supabase Auth",
      "RLS",
      "Vercel",
    ],
    facts: [
      "Anonymous incident reporting",
      "Geographic visualization / safety heatmap",
      "Safety dashboard with incident trends",
      "SOS event workflow",
      "Admin moderation",
      "Supabase authentication and row-level security",
      "Vercel deployment",
    ],
    limitations:
      "Does not automatically contact emergency services — not an emergency-service replacement.",
    screenshots: [
      {
        label: "Hero",
        src: "/assets/projects/anonymous-safety-intelligence/hero.png",
      },
      {
        label: "Dashboard",
        src: "/assets/projects/anonymous-safety-intelligence/dashboard.png",
      },
      {
        label: "Settings",
        src: "/assets/projects/anonymous-safety-intelligence/settings.png",
      },
      {
        label: "SOS Button",
        src: "/assets/projects/anonymous-safety-intelligence/sos-button.png",
      },
    ],
  },
  {
    id: "ai-app-compiler",
    name: "AI App Compiler",
    status: "Public Archive",
    category: "AI / Automation",
    purpose:
      "Compiler-style AI system that converts natural-language application requirements into validated application schemas using intent extraction, validation, repair and runtime simulation.",
    github: "https://github.com/rakshachahar/ai-app-compiler-project",
    stack: [
      "React",
      "TypeScript",
      "Express",
      "AI",
      "Schema Validation",
      "Automation",
    ],
    facts: [
      "Natural-language app requirements processing",
      "Intent extraction",
      "Validation and repair",
      "Runtime simulation",
    ],
    screenshots: [],
  },
  {
    id: "ai-handwritten-doc-intelligence",
    name: "AI Handwritten Document Intelligence",
    status: "Public Archive",
    category: "Computer Vision",
    purpose:
      "Handwritten-document intelligence project involving computer vision / OCR-style processing and structured extraction.",
    github:
      "https://github.com/rakshachahar/AI-Handwritten-Document-Intelligence",
    stack: [],
    facts: ["Handwritten document intelligence processing"],
    screenshots: [],
  },
  {
    id: "relief-ops-mvp",
    name: "Relief Ops MVP",
    status: "Public Archive",
    category: "AI / Social Impact",
    purpose:
      "AI-powered NGO decision-support project for prioritizing needs and allocating volunteers.",
    github: "https://github.com/rakshachahar/relief-ops-mvp",
    stack: [],
    facts: [
      "AI-powered NGO decision support",
      "Need prioritization",
      "Volunteer allocation",
    ],
    screenshots: [],
  },
];

// ─── SKILLS ─────────────────────────────────────────────────────────────────

export const skills: Skill[] = [
  {
    category: "Programming",
    icon: "code",
    items: ["Python", "SQL", "C++", "JavaScript", "TypeScript"],
  },
  {
    category: "Generative AI / LLM",
    icon: "sparkles",
    items: [
      "RAG",
      "LangChain",
      "Prompt Engineering",
      "PyTorch",
      "OpenRouter API",
      "Google Gemini",
      "AI Agents",
      "Google ADK",
    ],
  },
  {
    category: "NLP / Retrieval",
    icon: "search",
    items: [
      "FAISS",
      "Sentence Transformers",
      "Semantic Search",
      "Embeddings",
      "NLP",
    ],
  },
  {
    category: "ML / Data",
    icon: "brain",
    items: ["NumPy", "Pandas", "Matplotlib", "Model Evaluation"],
  },
  {
    category: "Tools & Web",
    icon: "wrench",
    items: [
      "Git",
      "GitHub",
      "VS Code",
      "Postman",
      "REST APIs",
      "Streamlit",
      "Flask",
      "HTML",
      "CSS",
      "Web Development",
      "Geospatial Analysis",
    ],
  },
];

// ─── ACHIEVEMENTS ───────────────────────────────────────────────────────────

export const achievements: Achievement[] = [
  {
    title: "Winner — Elite Her Hackathon 2026",
    track: "Influencer & Communication Track",
    image: "/assets/achievements/elite-her-influencer-track-win.jpg",
  },
  {
    title: "Finalist — India Innovates 2026",
    location: "Bharat Mandapam, New Delhi",
    team: "NeuralX",
  },
  {
    title: "Top 20 National Finalist — Praxis 2.0",
    organization: "GDG on Campus, GB Pant DSEU Campus",
    image: "/assets/achievements/praxis-2.0.jpg",
  },
  {
    title: "Top 50 Finalist — Elite Hack 1.0",
    scale: "900+ teams, 7,500+ participants",
    team: "Byte Babes",
    image: "/assets/achievements/elite-hack-1.0.jpg",
  },
  {
    title: "Finalist — Hack on Titan",
    organization: "GeeksforGeeks",
    image: "/assets/achievements/hack-on-titan.jpg",
  },
  {
    title: "Advanced to Offline Round — Hack4Delhi",
    organization: "IEEE NSUT Delhi",
    team: "NeuralX",
  },
  {
    title: "Solution Challenge 2026: Build with AI",
    type: "Prototype Submission Certificate",
    organization: "Hack2skill",
  },
];

// ─── CERTIFICATIONS ─────────────────────────────────────────────────────────

export const certifications: Certification[] = [
  {
    title: "AI Fluency: Framework & Foundations",
    issuer: "Anthropic",
    issued: "Aug 2026",
    credentialId: "ng9nqk457mcv",
    image: "/assets/certifications/ai-fluency-frameworks.pdf",
  },
  {
    title: "Solution Challenge 2026: Build with AI",
    issuer: "Hack2skill",
    issued: "Jul 2026",
    credentialId: "2026H2S07SCBWAI-PS09871",
    image: "/assets/certifications/solution-challenge.jpg",
  },
  {
    title: "Critical Thinking in the AI Era",
    issuer: "HP LIFE",
    issued: "Jun 2026",
    credentialId: "d92285f6-bf94-4cc3-99f8-dc0a0ad2ae2d",
    image: "/assets/certifications/hp-life-certificate.jpg",
  },
  {
    title: "Protex Hack-2-Win Hackathon",
    issuer: "Protege / IGDTUW",
    issued: "Apr 2026",
    image: "/assets/certifications/protex-hack2-win.jpg",
  },
  {
    title: "Deloitte Data Analytics Job Simulation",
    issuer: "Deloitte / Forage",
    issued: "Apr 2026",
    credentialId: "WMfTQf2DQ2qN4kBKF",
    image: "/assets/certifications/deloitte-data-analytics.jpg",
  },
  {
    title: "Kill Switch Hackathon 2026",
    issuer: "HackBriven / Armoriq",
    issued: "Apr 2026",
    credentialId: "KILLS-5KA5JE",
    image: "/assets/certifications/killswitch-hackathon.jpg",
  },
  {
    title: "Hack on Titan",
    issuer: "GeeksforGeeks",
    issued: "May 2026",
    credentialId: "815b70a1-100f-4303-a1f0-3c2aed3d7c70",
  },
  {
    title: "Engineer AI Agents with Agent Development Kit (ADK)",
    issuer: "Google",
    issued: "May 2026",
  },
  {
    title: "Python",
    issuer: "Kaggle",
    issued: "Dec 2025",
    credentialId: "raksha/python",
    image: "/assets/certifications/python-kaggle.jpg",
  },
  {
    title: "Postman API Fundamentals Student Expert",
    issuer: "Postman",
    issued: "Nov 2025",
    credentialId: "692c4ab7ceecee5e3a8960ba",
    image: "/assets/certifications/postman-api-student-expert.png",
  },
  {
    title: "Apple iOS Training",
    issuer: "Apple",
    issued: "",
    image: "/assets/certifications/apple-ios-training.jpg",
  },
];

// ─── COMMUNITY EVENTS ───────────────────────────────────────────────────────

export const events: CommunityEvent[] = [
  {
    name: "ASIS International South Asia Meet 2026",
    location: "JW Marriott, Aerocity, New Delhi",
    themes: [
      "AI",
      "Digital Transformation",
      "Security",
      "Deepfakes",
      "Misinformation",
      "Networking",
    ],
    image: "/assets/events/asis-meet.jpg",
  },
  {
    name: "Avalanche Team1 City Connect — Delhi",
    location: "Microsoft Office, Noida",
    themes: [
      "Web3",
      "Avalanche",
      "Blockchain",
      "AI Agents",
      "Community",
      "Networking",
    ],
    image: "/assets/events/microsoft.jpg",
  },
  {
    name: "India Innovates 2026",
    location: "Bharat Mandapam, New Delhi",
    team: "NeuralX",
    themes: [
      "Hyperlocal Ward-Level AQI & Pollution Mitigation Dashboard",
      "Civic Tech",
      "Innovation",
    ],
    image: "/assets/events/india-innovates.jpg",
  },
];

// ─── ALL GALLERY IMAGES ─────────────────────────────────────────────────────

export const galleryImages = [
  { src: "/assets/events/asis-meet.jpg", label: "ASIS International South Asia Meet 2026" },
  { src: "/assets/events/microsoft.jpg", label: "Avalanche City Connect — Microsoft Office" },
  { src: "/assets/events/india-innovates.jpg", label: "India Innovates 2026" },
  { src: "/assets/events/iit.jpg", label: "Community Event" },
  { src: "/assets/achievements/elite-her-influencer-track-win.jpg", label: "Elite Her Hackathon Win" },
  { src: "/assets/achievements/elite-hack-1.0.jpg", label: "Elite Hack 1.0" },
  { src: "/assets/achievements/praxis-2.0.jpg", label: "Praxis 2.0" },
  { src: "/assets/achievements/hack-on-titan.jpg", label: "Hack on Titan" },
];

// ─── AI GROUNDING ───────────────────────────────────────────────────────────

export const aiGrounding = {
  allowedScope: "Questions about Raksha and her verified portfolio.",
  unknownResponse: "I don't have verified information about that.",
  unrelatedResponse:
    "I'm Ask Raksha, so I only answer questions about Raksha and her work.",
  futureRule:
    "Never state an unverified future event as a fact. Distinguish goals/plans from guaranteed outcomes.",
  privateRule:
    "Do not expose private repository URLs or private project details as public resources.",
};

// ─── SEARCH INDEX ───────────────────────────────────────────────────────────

export interface SearchItem {
  title: string;
  category: string;
  appId: string;
  subRoute?: string;
  keywords: string[];
}

export const searchIndex: SearchItem[] = [
  ...projects.map((p) => ({
    title: p.name,
    category: "Project",
    appId: "projects",
    subRoute: p.id,
    keywords: [p.name, p.category, ...p.stack, ...p.facts].map((k) =>
      k.toLowerCase()
    ),
  })),
  ...experience.map((e) => ({
    title: `${e.role} — ${e.organization}`,
    category: "Experience",
    appId: "experience",
    keywords: [e.role, e.organization, ...e.points].map((k) =>
      k.toLowerCase()
    ),
  })),
  ...skills.flatMap((s) =>
    s.items.map((item) => ({
      title: item,
      category: `Skill — ${s.category}`,
      appId: "skills",
      keywords: [item.toLowerCase(), s.category.toLowerCase()],
    }))
  ),
  ...achievements.map((a) => ({
    title: a.title,
    category: "Achievement",
    appId: "achievements",
    keywords: [
      a.title,
      a.organization || "",
      a.track || "",
      a.team || "",
    ].map((k) => k.toLowerCase()),
  })),
  ...certifications.map((c) => ({
    title: c.title,
    category: "Certification",
    appId: "certifications",
    keywords: [c.title, c.issuer, c.issued].map((k) => k.toLowerCase()),
  })),
  ...events.map((e) => ({
    title: e.name,
    category: "Event",
    appId: "community",
    keywords: [e.name, e.location, ...e.themes].map((k) => k.toLowerCase()),
  })),
  {
    title: "Raksha Chahar",
    category: "Profile",
    appId: "about",
    keywords: ["raksha", "chahar", "about", "profile", "education", "ai", "ml"],
  },
  {
    title: "Resume",
    category: "Document",
    appId: "resume",
    keywords: ["resume", "cv", "pdf", "download"],
  },
  {
    title: "Contact",
    category: "Contact",
    appId: "contact",
    keywords: ["contact", "email", "linkedin", "github"],
  },
];

// ─── COMPATIBILITY EXPORT ───────────────────────────────────────────────────
// Subagent-generated components import { portfolioData } and destructure
// properties from it. This maps our individual exports into the shape they expect.

export const portfolioData = {
  profile: {
    name: profile.name,
    headline: profile.headline,
    summary: profile.summary,
    bio: profile.summary,
    email: profile.email,
    linkedin: profile.linkedin,
    github: profile.github,
    location: profile.location,
  },
  education: [
    {
      institution: profile.education.institution,
      degree: profile.education.degree,
      affiliation: profile.education.affiliation,
      cgpa: profile.education.cgpa,
      duration: profile.education.graduation,
    },
  ],
  links: {
    linkedin: profile.linkedin,
    github: profile.github,
    email: profile.email,
  },
  experience: experience.map((e) => ({
    ...e,
    company: e.organization,
    title: e.role,
  })),
  projects: projects.map((p) => ({
    ...p,
    title: p.name,
  })),
  skills,
  achievements,
  certifications,
  community: events,
  events,
  galleryImages,
};
