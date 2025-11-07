/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./types.ts"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
        'arabic': ['Cairo', 'system-ui', 'sans-serif'],
        'english': ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-in-out",
        "spin-slow": "spin 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 20px 40px rgba(13, 148, 136, 0.4), 0 0 0 0 rgba(13, 148, 136, 0.7)",
          },
          "50%": {
            boxShadow: "0 20px 40px rgba(13, 148, 136, 0.6), 0 0 0 10px rgba(13, 148, 136, 0)",
          },
        },
        "fade-in-up": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      animationDelay: {
        '200': '200ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
      }
    },
  },
  plugins: [],
}

