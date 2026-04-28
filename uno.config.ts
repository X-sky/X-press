import { defineConfig, presetAttributify } from 'unocss'
import presetWind3 from '@unocss/preset-wind3'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
  ],
  // Custom rules for X-portfolio Tailwind theme colors and utilities
  rules: [
    // Accent color utilities
    ['text-accentColor', { color: 'hsl(var(--accent-color))' }],
    ['bg-accentColor', { 'background-color': 'hsl(var(--accent-color))' }],
    ['border-accentColor', { 'border-color': 'hsl(var(--accent-color))' }],

    // Base background
    ['bg-baseBackground', { 'background-color': 'hsl(var(--base-background))' }],

    // Background clip text utility
    ['bg-clip-text', {
      'background-clip': 'text',
      '-webkit-background-clip': 'text',
    }],

    // Infinite scroll animation for tech stack marquee
    ['animate-infinite-scroll', {
      animation: 'infinite-scroll 25s linear infinite',
    }],
  ],
  // Custom theme extending wind3 defaults
  theme: {
    animation: {
      keyframes: {
        'infinite-scroll': `{
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }`,
      },
    },
    fontFamily: {
      jost: 'Jost, sans-serif',
    },
    colors: {
      // Map X-portfolio custom colors as theme colors
      accentColor: 'hsl(var(--accent-color))',
      baseBackground: 'hsl(var(--base-background))',
    },
  },
  // Safelist ensures dynamic classes are not tree-shaken during build
  safelist: [
    // Accent color utilities (may be used dynamically)
    'text-accentColor',
    'bg-accentColor',
    'border-accentColor',
    'bg-baseBackground',
    'bg-clip-text',
    'animate-infinite-scroll',
    // Common responsive utilities used in portfolio components
    'hidden',
    'block',
    'flex',
    'grid',
    'lg:flex',
    'lg:grid',
    'lg:block',
    'md:flex',
    'md:grid',
    'md:block',
    'sm:flex',
    'sm:grid',
    'sm:block',
  ],
  // Content sources for class scanning
  content: {
    filesystem: [
      '.vitepress/theme/**/*.{vue,ts}',
      'src/**/*.md',
    ],
  },
})
