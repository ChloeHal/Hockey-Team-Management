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
        coreprobably: {
          "primary": "oklch(87% 0.15 154.449)",
          "primary-content": "oklch(26% 0.065 152.934)",
          "secondary": "oklch(85% 0.138 181.071)",
          "secondary-content": "oklch(12% 0.042 264.695)",
          "accent": "oklch(86% 0.022 252.894)",
          "accent-content": "oklch(12% 0.042 264.695)",
          "neutral": "oklch(50% 0.118 165.612)",
          "neutral-content": "oklch(97% 0.014 254.604)",
          "base-100": "oklch(97% 0.014 254.604)",
          "base-200": "oklch(93% 0.032 255.585)",
          "base-300": "oklch(88% 0.059 254.128)",
          "base-content": "oklch(50% 0.118 165.612)",
          "info": "oklch(74% 0.16 232.661)",
          "info-content": "oklch(29% 0.066 243.157)",
          "success": "oklch(77% 0.152 181.912)",
          "success-content": "oklch(27% 0.046 192.524)",
          "warning": "oklch(85% 0.199 91.936)",
          "warning-content": "oklch(28% 0.066 53.813)",
          "error": "oklch(71% 0.202 349.761)",
          "error-content": "oklch(28% 0.109 3.907)",
          "--rounded-box": "0rem",
          "--rounded-btn": "2rem",
          "--rounded-badge": "2rem",
          "--border-btn": "1px",
        },
      },
    ],
  },
};
