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
        white:           '#161616',
        'ibm-blue':      '#0F62FE',
        'ibm-blue-hover':'#0353E9',
        'ibm-blue-light':'#0043CE',
        'ibm-blue-dim':  'rgba(15,98,254,0.08)',
        surface:         '#ffffff',
        'surface-2':     '#f4f4f4',
        'surface-3':     '#e8e8e8',
        border:          '#e0e0e0',
        'border-bright': '#8d8d8d',
        muted:           '#525252',
        dim:             '#8d8d8d',
        success:         '#198038',
        'success-dim':   'rgba(25,128,56,0.08)',
        warning:         '#b45309',
        'warning-dim':   'rgba(180,83,9,0.08)',
        danger:          '#da1e28',
        'danger-dim':    'rgba(218,30,40,0.08)',
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
