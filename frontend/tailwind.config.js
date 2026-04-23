/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: '2px',
        sm:  '2px',
        md:  '3px',
        lg:  '4px',
        xl:  '4px',
        '2xl': '4px',
        full: '9999px',
      },
      colors: {
        'ibm-blue':      '#0F62FE',
        'ibm-blue-hover':'#0353E9',
        'ibm-blue-light':'#6699ff',
        'ibm-blue-dim':  'rgba(15,98,254,0.10)',
        surface:         '#111128',
        'surface-2':     '#0b0b1c',
        'surface-3':     '#18182e',
        border:          'rgba(255,255,255,0.12)',
        'border-bright': 'rgba(255,255,255,0.22)',
        muted:           'rgba(255,255,255,0.68)',
        dim:             'rgba(255,255,255,0.45)',
        success:         '#22c55e',
        'success-dim':   'rgba(34,197,94,0.08)',
        warning:         '#f59e0b',
        'warning-dim':   'rgba(245,158,11,0.08)',
        danger:          '#ef4444',
        'danger-dim':    'rgba(239,68,68,0.08)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': '11px',
        xs:   ['13px', { lineHeight: '1.5' }],
        sm:   ['15px', { lineHeight: '1.6' }],
        base: ['17px', { lineHeight: '1.7' }],
      },
      letterSpacing: {
        label: '0.1em',
        wide:  '0.06em',
        wider: '0.12em',
      },
      animation: {
        'pulse-dot': 'pulsedot 2s ease-in-out infinite',
        'ticker':    'ticker 28s linear infinite',
      },
      keyframes: {
        pulsedot: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.2' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
