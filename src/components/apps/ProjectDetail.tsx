"use client";
import React from "react";
import { Project } from "@/data/portfolioData";
import { ArrowLeft, Github, ExternalLink, AlertTriangle } from "lucide-react";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  return (
    <div className="bg-[#1e1e1e] min-h-full pb-20">
      {/* Hero section */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-gradient-to-b from-gray-900 to-black">
        {project.screenshots[0] ? (
          <img 
            src={project.screenshots[0].src}
            alt={project.name} 
            className="w-full h-full object-cover opacity-40" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-transparent to-black/50" />
        
        {/* Navigation & Title */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 w-fit px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/90 transition-colors border border-white/10"
          >
            <ArrowLeft size={18} /> Back to Projects
          </button>
          
          <div className="max-w-4xl mx-auto w-full mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm text-white/90 border border-white/10">
                {project.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-md ${
                project.status === "Live" ? "bg-green-500/20 text-green-300 border border-green-500/30" :
                project.status === "WIP" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" :
                "bg-gray-500/40 text-gray-200 border border-gray-500/30"
              }`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{project.name}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-12">
        {/* Links & Quick actions */}
        <div className="flex gap-4 border-b border-white/10 pb-8">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium text-white">
              <Github size={20} /> View Source
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors font-medium text-white shadow-lg shadow-blue-900/20">
              <ExternalLink size={20} /> Live Demo
            </a>
          )}
        </div>

        {/* Purpose */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white/90">Overview</h2>
          <p className="text-lg text-white/70 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10">
            {project.purpose}
          </p>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white/90">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map(tech => (
              <span key={tech} className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white/90">Key Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.facts.map((fact, idx) => (
              <li key={idx} className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-blue-400 mt-1">✦</div>
                <div className="text-white/80">{fact}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Limitations */}
        {project.limitations && (
          <section>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-orange-400">
                <AlertTriangle size={20} /> Current Limitations
              </h2>
              <ul className="space-y-2">
                <li className="text-orange-200/80 text-sm flex gap-2">
                  <span>•</span> <span>{project.limitations}</span>
                </li>
              </ul>
            </div>
          </section>
        )}

        {/* Screenshots */}
        {project.screenshots && project.screenshots.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white/90">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.screenshots.map((screenshot, idx) => (
                <div key={screenshot.src} className="rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-video">
                  <img src={screenshot.src} alt={screenshot.label || `Screenshot ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
