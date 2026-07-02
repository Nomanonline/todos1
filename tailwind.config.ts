import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#8b5cf6',
          cyan: '#22d3ee',
        },
      },
      boxShadow: {
        glow: '0 0 30px rgba(34, 211, 238, 0.35)',
        panel: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.35)',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
