/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        'ink-2': '#333333',
        muted: '#666666',
        faint: '#9a9a9a',
        line: '#e8e8e5',
        'line-strong': '#d2d2cd',
        canvas: '#ffffff',
        soft: '#f5f5f2',
        sale: '#b42318',
        'sale-soft': '#fdecea',
        ok: '#067647',
        'ok-soft': '#e7f6ee',
        warn: '#a14a00',
        'warn-soft': '#fff4e0',
        whatsapp: '#128c4b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        page: '72rem',
      },
      keyframes: {
        // Opacity only: a transform here would break position:fixed children
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out both',
        rise: 'rise 200ms ease-out both',
        'sheet-up': 'sheet-up 260ms cubic-bezier(0.32, 0.72, 0, 1) both',
        pop: 'pop 250ms ease-out',
      },
    },
  },
  plugins: [],
};
