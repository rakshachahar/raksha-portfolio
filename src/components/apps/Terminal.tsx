'use client';

import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '@/data/portfolioData';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: React.ReactNode = '';

    switch (trimmedCmd) {
      case 'help':
        output = (
          <div className="text-green-400 space-y-1">
            <p>Available commands:</p>
            <ul className="list-disc list-inside ml-4">
              <li>help - Show this message</li>
              <li>about - Information about Raksha</li>
              <li>projects - List all projects</li>
              <li>skills - List technical skills</li>
              <li>experience - List work experience</li>
              <li>achievements - List achievements</li>
              <li>certifications - List certifications</li>
              <li>community - List community events</li>
              <li>resume - Download link to resume</li>
              <li>contact - Contact information</li>
              <li>clear - Clear the terminal</li>
            </ul>
          </div>
        );
        break;
      case 'about':
        output = <p>{portfolioData.profile.bio}</p>;
        break;
      case 'projects':
        output = (
          <ul className="space-y-2">
            {portfolioData.projects.map((p, i) => (
              <li key={i}>
                <span className="text-blue-400 font-bold">{p.title}</span> - {p.status}
              </li>
            ))}
          </ul>
        );
        break;
      case 'skills':
        output = (
          <div className="space-y-2">
            {portfolioData.skills.map((s, i) => (
              <div key={i}>
                <span className="text-yellow-400 font-bold">{s.category}:</span>{' '}
                {s.items.join(', ')}
              </div>
            ))}
          </div>
        );
        break;
      case 'experience':
        output = (
          <div className="space-y-4">
            {portfolioData.experience.map((e, i) => (
              <div key={i}>
                <div className="font-bold text-cyan-400">{e.role} @ {e.company}</div>
                <div className="text-gray-400">{e.period}</div>
              </div>
            ))}
          </div>
        );
        break;
      case 'achievements':
        output = (
          <ul className="list-disc list-inside">
            {portfolioData.achievements.map((a, i) => (
              <li key={i}>{a.title} ({a.organization})</li>
            ))}
          </ul>
        );
        break;
      case 'certifications':
        output = (
          <ul className="list-disc list-inside">
            {portfolioData.certifications.map((c, i) => (
              <li key={i}>{c.title} - {c.issuer}</li>
            ))}
          </ul>
        );
        break;
      case 'community':
        output = (
          <ul className="list-disc list-inside">
            {portfolioData.community.map((c, i) => (
              <li key={i}>{c.name} ({c.location})</li>
            ))}
          </ul>
        );
        break;
      case 'resume':
        output = <a href="/assets/resume/Raksha_Resume_.pdf" download className="text-blue-400 underline hover:text-blue-300">Download Resume</a>;
        break;
      case 'contact':
        output = (
          <div>
            <p>Email: <a href={`mailto:${portfolioData.profile.email}`} className="text-blue-400">{portfolioData.profile.email}</a></p>
            <p>LinkedIn: <a href={portfolioData.profile.linkedin} target="_blank" className="text-blue-400">Profile</a></p>
            <p>GitHub: <a href={portfolioData.profile.github} target="_blank" className="text-blue-400">Profile</a></p>
          </div>
        );
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        break;
      default:
        output = <p className="text-red-400">Command not found. Type "help" for available commands.</p>;
    }

    if (trimmedCmd !== '') {
      setHistory((prev) => [...prev, { command: cmd, output }]);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <div 
      className="p-4 h-full bg-[#1a1a2e] text-gray-300 font-mono text-sm sm:text-base overflow-y-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-4 text-green-400">
        Welcome to Raksha's Terminal<br />
        Type "help" for available commands.<br />
      </div>

      {history.map((item, index) => (
        <div key={index} className="mb-4">
          <div className="flex gap-2 text-blue-400">
            <span>raksha@portfolio</span>
            <span className="text-gray-400">~ $</span>
            <span className="text-white">{item.command}</span>
          </div>
          <div className="mt-1">{item.output}</div>
        </div>
      ))}

      <form onSubmit={onSubmit} className="flex gap-2 text-blue-400">
        <span>raksha@portfolio</span>
        <span className="text-gray-400">~ $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white font-mono"
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      <div ref={endRef} />
    </div>
  );
}
