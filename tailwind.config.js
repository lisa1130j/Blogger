/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        labubu: {
          "primary": "#FF6B9C",
          "primary-focus": "#FF4785",
          "primary-content": "#ffffff",
          "secondary": "#9C88FF",
          "secondary-focus": "#7C4DFF",
          "secondary-content": "#ffffff",
          "accent": "#6CDFFF",
          "accent-focus": "#40C4FF",
          "accent-content": "#ffffff",
          "neutral": "#2D3748",
          "neutral-focus": "#4A5568",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#F5F7FF",
          "base-300": "#EDF0FF",
          "base-content": "#2D3748",
          "info": "#40C4FF",
          "success": "#00E676",
          "warning": "#FFD93D",
          "error": "#FF5252",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.75rem",
          "--rounded-badge": "0.5rem",
          "--animation-btn": "0.3s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "2px",
          "--tab-border": "2px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
}
