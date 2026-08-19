"use client";
import React, { useEffect, useState } from "react";
import { portfolioData } from "@/data/portfolioData";
import { ProjectDetail } from "./ProjectDetail";
import { Github, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/store/windowStore";

export function Projects() {
  const { projects } = portfolioData;
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const subRoute = useWindowStore((state) => state.windows.projects?.subRoute);
  const setSubRoute = useWindowStore((state) => state.setSubRoute);

  useEffect(() => {
    if (subRoute && projects.some((project) => project.id === subRoute)) {
      setSelectedProject(subRoute);
    }
  }, [subRoute, projects]);

  const activeProject = projects.find(p => p.id === selectedProject);

  return (
    <div className="h-full relative overflow-hidden bg-[#1e1e1e]">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 p-6 overflow-y-auto"
          >
            <div className="max-w-[1180px] mx-auto">
              <h2 className="sr-only">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className="w-full max-w-[360px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-white/5 flex flex-col h-full"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="h-48 relative bg-gradient-to-br from-gray-800 to-black overflow-hidden">
                      {project.screenshots[0] ? (
                        <img 
                          src={project.screenshots[0].src}
                          alt={project.name} 
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                          <span className="text-4xl opacity-20 font-bold">{project.name.charAt(0)}</span>
                        </div>
                      )}
                      
                      <div className="absolute top-4 right-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold backdrop-blur-md shadow-lg ${
                          project.status === "Live" ? "bg-green-500/20 text-green-300 border border-green-500/30" :
                          project.status === "WIP" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" :
                          "bg-gray-500/40 text-gray-200 border border-gray-500/30"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white/90 border border-white/10">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{project.name}</h3>
                      <p className="text-sm text-white/60 mb-4 line-clamp-2 flex-1">{project.purpose}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.stack.slice(0, 4).map(tech => (
                          <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/5">
                            {tech}
                          </span>
                        ))}
                        {project.stack.length > 4 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50">
                            +{project.stack.length - 4}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} source`} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white">
                            <Github size={16} />
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} demo`} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white">
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 overflow-y-auto"
          >
            {activeProject && (
              <ProjectDetail 
                project={activeProject} 
                onBack={() => {
                  setSubRoute('projects');
                  setSelectedProject(null);
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
