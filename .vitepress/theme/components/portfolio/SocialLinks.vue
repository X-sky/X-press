<script lang="ts" setup>
/**
 * SocialLinks.vue
 *
 * Migrated from X-portfolio-main/components/SocialLinks.tsx
 *
 * Layout:
 * - Right side: fixed vertical social links (Github) with inline SVG icons
 * - Left side: fixed "Contact me" vertical text with decorative line
 * - Bottom right: absolute "View Project" link (desktop only)
 * - Bottom center: absolute mouse scroll indicator with bounce animation
 *
 * All positioned fixed/absolute relative to the hero section.
 * Entry animations with GSAP (slide in from sides, fade in).
 * Hidden on mobile for social links bar, visible on desktop.
 *
 * Uses useGsapAnimation composable for GSAP lifecycle management.
 */
import { ref } from 'vue'
import { useGsapAnimation } from '../../composables/useGsapAnimation'
import { useI18n } from '../../composables/useI18n'

const sectionRef = ref<HTMLElement | null>(null)
const { t } = useI18n()

useGsapAnimation(sectionRef, {
  setup({ el, gsap }) {
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.out' } })

    // Right side social links: slide in from right
    tl.fromTo(
      el.querySelector('.social-links-right'),
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, delay: 2.5 },
    )

    // Left side "Contact me": slide in from left
    tl.fromTo(
      el.querySelector('.social-links-left'),
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1 },
      '<0.1',
    )

    // Bottom right "View Project": fade in
    tl.fromTo(
      el.querySelector('.view-project-link'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 },
      '<0.1',
    )

    // Bottom center mouse scroll hint: fade in
    tl.fromTo(
      el.querySelector('.scroll-hint'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 },
      '<0.1',
    )

    return tl
  },
})
</script>

<template>
  <div ref="sectionRef">
    <!-- Right side: vertical social links (fixed position) -->
    <div class="social-links-right fixed z-10 right-4 bottom-[5%] md:bottom-[20%] hidden md:block" style="opacity: 0;">
      <div class="flex flex-col gap-6 items-center">
        <!-- Github -->
        <a
          title="Tse's Github Profile"
          target="_blank"
          aria-label="Tse's Github Profile"
          rel="noopener noreferrer"
          href="https://github.com/X-sky"
          class="scale-110 rounded link-outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            class="dark:fill-gray-400 hover:fill-accentColor dark:hover:fill-accentColor fill-gray-700"
          >
            <path
              d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
            />
          </svg>
        </a>

        <!-- Twitter / X -->
        <a
          title="Tse's Twitter Profile"
          target="_blank"
          aria-label="Tse's Twitter Profile"
          rel="noopener noreferrer"
          href="https://x.com/Tse0103x"
          class="scale-110 rounded link-outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="stroke-gray-700 dark:stroke-gray-400 hover:stroke-[hsl(var(--accent-color))]"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Left side: "Contact me" vertical text with line -->
    <div class="social-links-left fixed bottom-0 group flex-col gap-2 items-center left-4 hidden md:flex" style="opacity: 0;">
      <a
        href="#contact"
        aria-label="Contact me"
        class="flex text-xs group-hover:text-accentColor font-light tracking-[0.3em] items-center gap-2 dark:text-gray-400 text-gray-600"
        style="writing-mode: vertical-lr;"
      >
        {{ t('social.contactMe') }}
      </a>
      <div class="h-24 w-[0.4px] bg-gray-400 group-hover:bg-accentColor" />
    </div>

    <!-- Bottom right: "View Project" link (desktop only) -->
    <div class="view-project-link hidden md:block absolute bottom-4 right-4" style="opacity: 0;">
      <a
        href="#project"
        aria-label="View Projects"
        class="flex items-center gap-2 dark:text-gray-400 text-gray-600 hover:text-accentColor dark:hover:text-accentColor"
      >
        <span class="text-sm tracking-widest">{{ t('social.viewProject') }}</span>
        <!-- Arrow right icon -->
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>

    <!-- Bottom center: mouse scroll hint with bounce animation -->
    <a
      href="#about"
      aria-label="Scroll to about section"
      class="scroll-hint absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce text-gray-600 dark:text-gray-400 hover:text-accentColor dark:hover:text-accentColor cursor-pointer"
      style="opacity: 0;"
    >
      <div class="flex flex-col gap-1 items-center">
        <!-- Mouse icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="6" y="3" width="12" height="18" rx="6" />
          <line x1="12" y1="7" x2="12" y2="10" />
        </svg>
        <!-- Arrow down icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </div>
    </a>
  </div>
</template>
