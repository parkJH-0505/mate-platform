/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode backgrounds
        'background-primary': 'rgb(10, 10, 10)',
        'background-secondary': 'rgb(18, 18, 18)',
        'background-tertiary': 'rgb(26, 26, 26)',
        
        // Glass morphism
        'glass-light': 'rgba(255, 255, 255, 0.05)',
        'glass-medium': 'rgba(255, 255, 255, 0.1)',
        'glass-heavy': 'rgba(255, 255, 255, 0.15)',
        'glass-border': 'rgba(255, 255, 255, 0.18)',
        
        // Primary - Neon Blue
        'primary-main': 'rgb(94, 162, 255)',
        'primary-bright': 'rgb(120, 180, 255)',
        'primary-dim': 'rgb(50, 100, 200)',
        
        // Accent colors
        'accent-purple': 'rgb(147, 97, 253)',
        'accent-pink': 'rgb(214, 93, 177)',
        'accent-blue': 'rgb(92, 183, 242)',
        
        // Text colors
        'text-primary': 'rgb(255, 255, 255)',
        'text-secondary': 'rgb(200, 200, 200)',
        'text-tertiary': 'rgb(150, 150, 150)',
        'text-muted': 'rgb(100, 100, 100)',
        
        // Semantic colors
        'semantic-success': 'rgb(76, 206, 148)',
        'semantic-warning': 'rgb(251, 191, 36)',
        'semantic-error': 'rgb(239, 68, 68)',
        'semantic-info': 'rgb(59, 130, 246)',
        
        // Legacy colors (for backward compatibility)
        primary: 'rgb(94, 162, 255)',
        'primary-hover': 'rgb(120, 180, 255)',
        'primary-light': 'rgba(94, 162, 255, 0.1)',
        secondary: 'rgb(76, 206, 148)',
        'secondary-light': 'rgb(220, 252, 231)',
        'secondary-dark': 'rgb(20, 83, 45)',
      },
      
      fontFamily: {
        sans: [
          'Inter var',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        display: [
          'Inter var',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Inconsolata',
          'Fira Code',
          'monospace'
        ]
      },
      
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
      },
      
      borderRadius: {
        'sm': '6px',
        'default': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
      
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'lg': '0 8px 40px rgba(0, 0, 0, 0.5)',
        'xl': '0 20px 60px rgba(0, 0, 0, 0.6)',
        '2xl': '0 25px 80px rgba(0, 0, 0, 0.7)',
        'glow': '0 0 40px rgba(147, 97, 253, 0.3)',
        'glow-lg': '0 0 60px rgba(147, 97, 253, 0.4)',
        'inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E\")",
      },
      
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
      },
      
      animation: {
        'spin': 'spin 1s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'gradient-y': 'gradient-y 3s ease infinite',
        'gradient-xy': 'gradient-xy 3s ease infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left top'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right bottom'
          },
        },
      },
      
      // Custom utilities
      backgroundSize: {
        '200': '200% 200%',
      },
      backgroundPosition: {
        '0': '0% 0%',
        '100': '100% 100%',
      },
    },
  },
  plugins: [],
}
