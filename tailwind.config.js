/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist"', "Arial", 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        burnedcrush: {
          "primary": "oklch(69% 0.17 162.48)",
          "primary-content": "oklch(98% 0 0)",
          "secondary": "oklch(92% 0 0)",
          "secondary-content": "oklch(69% 0.17 162.48)",
          "accent": "oklch(43% 0 0)",
          "accent-content": "oklch(97% 0 0)",
          "neutral": "oklch(21% 0.006 285.885)",
          "neutral-content": "oklch(98% 0 0)",
          "base-100": "oklch(98% 0 0)",
          "base-200": "oklch(97% 0 0)",
          "base-300": "oklch(92% 0 0)",
          "base-content": "oklch(37% 0 0)",
          "info": "oklch(87% 0 0)",
          "info-content": "oklch(26% 0 0)",
          "success": "oklch(37% 0 0)",
          "success-content": "oklch(92% 0 0)",
          "warning": "oklch(87% 0 0)",
          "warning-content": "oklch(37% 0 0)",
          "error": "oklch(55% 0 0)",
          "error-content": "oklch(97% 0.013 17.38)",
          "--rounded-box": "0rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",
          "--border-btn": "1px",
        },
      },
    ],
  },
};
