import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

const {nextui} = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        contrast: 'rgb(var(--color-contrast) / <alpha-value>)',
        notice: 'rgb(var(--color-accent) / <alpha-value>)',
        shopPay: 'rgb(var(--color-shop-pay) / <alpha-value>)',
      },
      screens: {
        sm: '32em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        'sm-max': {max: '48em'},
        'sm-only': {min: '32em', max: '48em'},
        'md-only': {min: '48em', max: '64em'},
        'lg-only': {min: '64em', max: '80em'},
        'xl-only': {min: '80em', max: '96em'},
        '2xl-only': {min: '96em'},
      },
      spacing: {
        nav: 'var(--height-nav)',
        screen: 'var(--screen-height, 100vh)',
      },
      height: {
        screen: 'var(--screen-height, 100vh)',
        'screen-no-nav':
          'calc(var(--screen-height, 100vh) - var(--height-nav))',
        'screen-dynamic': 'var(--screen-height-dynamic, 100vh)',
      },
      width: {
        mobileGallery: 'calc(100vw - 3rem)',
      },
      fontFamily: {
        outfit: ['Outfit'],
        racing: ['Racing Sans One'],
        Righteous: ['Righteous'],
        sans: '"DM Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        serif: ['"IBMPlexSerif"', 'Palatino', 'ui-serif'],
      },
      fontSize: {
        display: ['var(--font-size-display)', '1.1'],
        heading: ['var(--font-size-heading)', '1.25'],
        lead: ['var(--font-size-lead)', '1.333'],
        copy: ['var(--font-size-copy)', '1.5'],
        fine: ['var(--font-size-fine)', '1.333'],
      },
      maxWidth: {
        'prose-narrow': '45ch',
        'prose-wide': '80ch',
      },
      boxShadow: {
        border: 'inset 0px 0px 0px 1px rgb(var(--color-primary) / 0.08)',
        darkHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.4)',
        lightHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.05)',
      },
      keyframes: {
        fadeIn: {
          from: {opacity: 0},
          to: {opacity: 1},
        },
        marquee: {
          '0%': {transform: 'translateX(0%)'},
          '100%': {transform: 'translateX(-100%)'},
        },
        blink: {
          '0%': {opacity: 0.2},
          '20%': {opacity: 1},
          '100% ': {opacity: 0.2},
        },
        'background-shine': {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
        infiniteSlider: {
          '0%': {transform: 'translateX(0)'},
          '100%': {
            transform: 'translateX(calc(-250px * 5))',
          },
        },
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn .8s ease-in-out',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite',
        'background-shine': 'background-shine 2s linear infinite',
        'infinite-slider': 'infiniteSlider 30s linear infinite',
        scroll:
          'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    formsPlugin,
    typographyPlugin,
    require('tailwindcss-animated'),
    nextui(),
  ],
};
