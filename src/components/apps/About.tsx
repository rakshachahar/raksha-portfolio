"use client";
import React from "react";
import { portfolioData } from "@/data/portfolioData";
import { Github, Linkedin, Mail } from "lucide-react";

export function About() {
  const { profile, education, links } = portfolioData;

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-10 text-white/90">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-2xl shrink-0 border border-white/20 bg-white/5">
          <img 
            src="/assets/profile/profilepic.jpg" 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col text-center md:text-left gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
            <h2 className="text-xl text-white/60 mt-1 font-medium">{profile.headline}</h2>
          </div>
          <p className="text-white/80 leading-relaxed max-w-2xl text-lg">
            {profile.summary}
          </p>
          <div className="flex gap-4 mt-2 justify-center md:justify-start">
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors text-sm font-medium">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors text-sm font-medium">
              <Github size={16} /> GitHub
            </a>
            <a href={`mailto:${links.email}`} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors text-sm font-medium">
              <Mail size={16} /> Contact
            </a>
          </div>
        </div>
      </div>

      {/* Career Direction */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-2xl border border-white/10 shadow-lg">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <span className="text-blue-400">✧</span> Focus Area
        </h3>
        <p className="text-white/80 text-lg">
          Building practical AI applications combining ML, information retrieval, Generative AI and software engineering.
        </p>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 border-b border-white/10 pb-2">Education</h3>
        <div className="grid gap-6">
          {education.map((edu, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-2">
                <h4 className="text-xl font-bold text-white/90">{edu.institution}</h4>
                <span className="text-sm font-medium px-3 py-1 bg-white/10 rounded-full w-fit">
                  {edu.duration}
                </span>
              </div>
              <div className="text-lg font-medium text-white/80 mb-1">{edu.degree}</div>
              <div className="text-white/60 text-sm mb-4">{edu.affiliation}</div>
              {edu.cgpa && (
                <div className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm font-medium border border-blue-500/30">
                  CGPA: {edu.cgpa}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
