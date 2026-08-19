import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raksha Chahar — AI/ML Engineer Portfolio",
  description:
    "Interactive portfolio of Raksha Chahar — AI/ML Engineer, B.Tech AI/ML student building practical AI applications with RAG, LangChain, PyTorch, and Generative AI.",
  keywords: [
    "Raksha Chahar",
    "AI ML Engineer",
    "Portfolio",
    "Machine Learning",
    "Generative AI",
    "RAG",
    "LangChain",
    "Python",
  ],
  openGraph: {
    title: "Raksha Chahar — AI/ML Engineer Portfolio",
    description:
      "Explore Raksha Chahar's interactive Mac-style portfolio featuring AI/ML projects, experience, and achievements.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a1a] text-white antialiased">{children}</body>
    </html>
  );
}
