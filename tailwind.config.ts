// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // ... paths to your files
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1A1A1A', // Minimalist Black/Dark Gray
        'brand-accent': '#FF9900', // Amazon-like high-contrast action color
        'brand-background': '#FFFFFF',
      },
      screens: {
        // Enforcing mobile-first base before tablet size
        'xs': '475px', 
      },
    },
  },
  plugins: [],
}
export default config