/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        marinho: {
          DEFAULT: '#0B1A2E',
          claro: '#14253D',
          borda: '#1E3A5F',
          hover: '#1A3050',
        },
        ouro: {
          DEFAULT: '#F5B731',
          escuro: '#E5A520',
          fosco: 'rgba(245, 183, 49, 0.12)',
          forte: 'rgba(245, 183, 49, 0.25)',
        },
        sucesso: '#22C55E',
        erro: '#EF4444',
        texto: {
          DEFAULT: '#FFFFFF',
          secundario: 'rgba(255, 255, 255, 0.5)',
          terciario: 'rgba(255, 255, 255, 0.35)',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        numero: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
}
