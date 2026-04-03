/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Rubik"', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bouncyclassic: {
          "primary": "oklch(72% 0.219 149.579)",
          "primary-content": "oklch(27% 0.105 12.094)",
          "secondary": "oklch(62% 0.194 149.214)",
          "secondary-content": "oklch(27% 0.046 192.524)",
          "accent": "oklch(62% 0.214 259.815)",
          "accent-content": "oklch(26% 0.079 36.259)",
          "neutral": "oklch(35% 0.144 278.697)",
          "neutral-content": "oklch(96% 0.018 272.314)",
          "base-100": "oklch(98% 0.002 247.839)",
          "base-200": "oklch(96% 0.003 264.542)",
          "base-300": "oklch(92% 0.006 264.531)",
          "base-content": "oklch(37% 0.146 265.522)",
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
