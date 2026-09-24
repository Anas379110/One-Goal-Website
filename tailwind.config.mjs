/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      colors: {
        // هوية One goal — أخضر ملعب داكن + رمادي محايد (UI-UX.md)
        pitch: {
          DEFAULT: '#0F3D2E',
          dark: '#0A2A1F',
          light: '#1C5A44',
        },
        neutral: {
          50: '#F7F7F7',
          900: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};
