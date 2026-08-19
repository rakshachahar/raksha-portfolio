'use client';

import React from 'react';
import { events } from '@/data/portfolioData';
import { MapPin, Tag } from 'lucide-react';

export default function Community() {
  return (
    <div className="p-6 h-full overflow-y-auto text-white/90">
      <h2 className="sr-only">Community & Events</h2>
      <div className="space-y-10">
        {events.map((event, index) => (
          <div
            key={index}
            className={`flex flex-col gap-6 items-center ${
              index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
            }`}
          >
            {/* Image */}
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden border border-white/10 bg-black/30 aspect-[4/3] shrink-0">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  No image available
                </div>
              )}
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 px-2 md:px-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-white/50">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                {event.team && (
                  <p className="text-sm text-white/40 mt-1">Team: {event.team}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {event.themes.map((theme) => (
                  <span
                    key={theme}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60"
                  >
                    <Tag className="w-3 h-3" />
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
