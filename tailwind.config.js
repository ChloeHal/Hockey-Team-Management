/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Arial Narrow"', "Arial", 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bouncyclassic: {
          "primary": "#8ace00",
          "primary-content": "#111111",
          "secondary": "#8ace00",
          "secondary-content": "#111111",
          "accent": "#8ace00",
          "accent-content": "#111111",
          "neutral": "#1a1a1a",
          "neutral-content": "#faf9f2",
          "base-100": "#faf9f2",
          "base-200": "#f0efe6",
          "base-300": "#e4e2d4",
          "base-content": "#1a1a1a",
          "info": "oklch(68% 0.169 237.323)",
          "info-content": "oklch(97% 0.013 236.62)",
          "success": "oklch(69% 0.17 162.48)",
          "success-content": "oklch(97% 0.021 166.113)",
          "warning": "oklch(79% 0.184 86.047)",
          "warning-content": "oklch(98% 0.026 102.212)",
          "error": "oklch(64% 0.246 16.439)",
          "error-content": "oklch(96% 0.015 12.422)",
          "--rounded-box": "0rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",
          "--border-btn": "1px",
        },
      },
    ],
  },
};
