import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-radial':
          'radial-gradient(ellipse at top, rgba(99,102,241,0.25) 0%, rgba(17,24,39,0) 55%), radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.12) 0%, transparent 45%)'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,0.35), 0 8px 30px rgba(59,130,246,0.25)'
      }
    }
  },
  plugins: []
};

export default config;
