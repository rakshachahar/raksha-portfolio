'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Mail, Github, Linkedin, Copy, ExternalLink, Check, Download } from 'lucide-react';

export default function Contact() {
  const { profile } = portfolioData;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center text-gray-200 bg-[#1e1e1e]">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Get in touch</h2>
          <p className="text-gray-400">Feel free to reach out for collaborations or just a friendly hello.</p>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
              title="Copy email"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400 group-hover:text-white" />}
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-xs rounded text-white shadow-lg whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>

          {/* LinkedIn */}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                <Linkedin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">LinkedIn</p>
                <p className="font-medium">linkedin.com/in/raksha</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </a>

          {/* GitHub */}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-600/20 rounded-lg text-gray-400">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">GitHub</p>
                <p className="font-medium">github.com/raksha</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </a>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-center">
          <a
            href="/assets/resume/Raksha_Resume_.pdf"
            download
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );
}
