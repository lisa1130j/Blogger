import React from 'react';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Contact() {
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
                Contact That Labubu Life
              </h1>
              <div className="welcome-message">
                <p>Have a question, tip, or partnership idea? Send a note and we'll get back within 1–2 business days.
                  <br />
                  <b>info@thatlabubulife.com</b>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
