"use client";
import React, { useState } from "react";
import { portfolioData } from "@/data/portfolioData";
import { Building2, Calendar, MapPin, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Experience() {
  const { experience } = portfolioData;
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-4xl mx-auto h-full text-white/90 relative">
      <h2 className="sr-only">Experience</h2>

      <div className="relative border-l-2 border-white/10 ml-6 space-y-12 pb-8">
        {experience.map((exp, idx) => (
          <div key={idx} className="relative pl-8 group">
            {/* Timeline dot */}
            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#1e1e1e] group-hover:bg-blue-400 group-hover:scale-125 transition-all" />
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors shadow-lg">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Logo Area */}
                <div className="w-16 h-16 rounded-xl bg-white p-2 shrink-0 flex items-center justify-center border border-white/20">
                  {exp.logo ? (
                    <img src={exp.logo} alt={exp.organization} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Building2 className="text-gray-800" size={32} />
                  )}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      <h4 className="text-lg text-blue-300 font-medium">{exp.organization}</h4>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2 text-sm text-white/60">
                      <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full">
                        <Calendar size={14} /> {exp.period}
                      </div>
                      <div className="flex gap-2">
                        {exp.mode && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                            <MapPin size={12} /> {exp.mode}
                          </span>
                        )}
                        {exp.certificate && (
                          <button 
                            onClick={() => setSelectedCert(exp.certificate || null)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                          >
                            <ExternalLink size={12} /> Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-white/70">
                    {exp.points.map((desc: string, i: number) => (
                      <li key={i} className="flex gap-2 text-[15px] leading-relaxed">
                        <span className="text-blue-400/50 mt-1.5 text-xs">●</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                  


                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-[#1e1e1e] p-2 rounded-xl shadow-2xl border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute -top-4 -right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors z-10"
              >
                <X size={20} />
              </button>
              <div className="w-full h-[78vh] overflow-auto rounded-lg bg-white/5">
                {selectedCert.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={`${selectedCert}#view=FitH`}
                    title="Experience confirmation document"
                    className="w-full h-full border-0 bg-white"
                  />
                ) : (
                  <img
                    src={selectedCert}
                    alt="Experience certificate"
                    className="w-full h-auto object-contain"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
