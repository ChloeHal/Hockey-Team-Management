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
        alphahouse: {
          "primary": "oklch(87% 0.15 154.449)",
          "primary-content": "oklch(26% 0.065 152.934)",
          "secondary": "oklch(83% 0.128 66.29)",
          "secondary-content": "oklch(26% 0.079 36.259)",
          "accent": "oklch(89% 0.196 126.665)",
          "accent-content": "oklch(27% 0.072 132.109)",
          "neutral": "oklch(27% 0.033 256.848)",
          "neutral-content": "oklch(98% 0.002 247.839)",
          "base-100": "oklch(98% 0.002 247.839)",
          "base-200": "oklch(96% 0.003 264.542)",
          "base-300": "oklch(92% 0.006 264.531)",
          "base-content": "oklch(21% 0.034 264.665)",
          "info": "oklch(71% 0.143 215.221)",
          "info-content": "oklch(98% 0.019 200.873)",
          "success": "oklch(76% 0.233 130.85)",
          "success-content": "oklch(98% 0.031 120.757)",
          "warning": "oklch(70% 0.213 47.604)",
          "warning-content": "oklch(98% 0.016 73.684)",
          "error": "oklch(63% 0.237 25.331)",
          "error-content": "oklch(97% 0.013 17.38)",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "0.25rem",
          "--border-btn": "1px",
        },
      },
    ],
  },
};
