import React from 'react';
import AdPlaceholder from '../components/AdPlaceholder';

export default function About() {
  return (
    <div className="relative max-w-[1400px] mx-auto px-4 min-h-screen">
      {/* Top Banner Ad */}
      <div className="flex justify-center mb-8">
        <AdPlaceholder format="banner" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_300px] gap-8">
        <main className="min-w-0">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-content">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading bg-gradient-to-r from-primary via-accent to-accent-2 bg-clip-text text-transparent">
                About That Labubu Life
              </h1>
              <div className="welcome-message">
                <p><b>That Labubu Life</b> is your source for Labubu news, tips, and collecting guidance. From spotting authentic pieces to staying up-to-date on the latest releases, we help collectors enjoy and protect their Labubu treasures.</p>
              </div>
            </div>
          </div>
          {/* Middle Banner Ad */}
          <div className="flex justify-center my-8">
            <AdPlaceholder format="banner" />
          </div>
        </main>

    
      </div>
    </div>
  );
}
