'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Search, Award, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Certifications() {
  const { certifications } = portfolioData;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredCerts = certifications.filter(
    (cert) =>
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="sr-only">Certifications</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {filteredCerts.map((cert, index) => (
            <div
              key={index}
              className="bg-black/20 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col h-full"
            >
              <div
                className="aspect-video bg-black/40 relative cursor-pointer group"
                onClick={() => cert.image && setSelectedImage(cert.image)}
              >
                {cert.image ? (
                  <>
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award className="w-12 h-12 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold mb-1 line-clamp-2">{cert.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{cert.issuer}</p>
                <div className="mt-auto space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Issued: {cert.issued}</span>
                  </div>
                  {cert.credentialId && (
                    <div className="text-xs text-gray-500 truncate">
                      ID: {cert.credentialId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredCerts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No certifications found matching your search.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors border border-white/10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            {selectedImage.toLowerCase().endsWith('.pdf') ? (
              <motion.iframe
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={`${selectedImage}#view=FitH`}
                title="Certificate document"
                className="w-full max-w-5xl h-[85vh] rounded-lg bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={selectedImage}
                alt="Certificate"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
