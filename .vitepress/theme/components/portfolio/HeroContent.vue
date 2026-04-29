<script lang="ts" setup>
import { ref } from 'vue'
import { useGsapAnimation } from '../../composables/useGsapAnimation'
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)

useGsapAnimation(sectionRef, {
  setup({ gsap }) {
    const tl = gsap.timeline({
      defaults: { stagger: 0.2, duration: 0.3 },
    })

    tl.fromTo(
      '.text-animation',
      { y: 100 },
      { y: 0, delay: 2.2 }
    )

    tl.fromTo(
      '.bio-animation',
      { scale: 0 },
      { scale: 1, ease: 'back', duration: 0.3 }
    )

    return tl
  },
})
</script>

<template>
  <div
    ref="sectionRef"
    class="absolute max-w-[55rem] m-auto w-full top-[20%] md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 flex flex-col gap-4 justify-center items-center"
  >
    <!-- Title: "Welcome to" -->
    <div class="overflow-hidden">
      <div
        class="text-animation dark:bg-[linear-gradient(#fff,rgba(255,255,255,.6))] inline-block text-black dark:text-transparent bg-clip-text leading-none text-4xl md:text-6xl font-semibold"
      >
        {{ t('hero.welcome') }}
      </div>
    </div>

    <!-- Subtitle: "X-press" -->
    <div class="overflow-hidden">
      <div class="text-animation text-2xl md:text-4xl font-semibold">
        <span class="text-accentColor">X-press</span>
      </div>
    </div>

    <!-- Spacer (matches original empty div) -->
    <div
      class="w-[300px] md:w-[370px] relative z-30 text-center text-sm dark:bg-[linear-gradient(#fff,rgba(255,255,255,.6))] inline-block text-black dark:text-transparent bg-clip-text"
    />

    <!-- Bio tagline -->
    <div
      class="bio-animation dark:bg-[linear-gradient(#fff,rgba(255,255,255,.6))] inline-block text-black dark:text-transparent bg-clip-text text-md md:text-lg"
    >
      {{ t('hero.tagline') }}
    </div>

    <!-- Contact Me button -->
    <a
      href="#contact"
      aria-label="Contact Me"
      class="contact_me_btn px-4 py-[6px] shadow-md mt-10 md:mt-3 group flex items-center gap-2"
    >
      <div class="dark:text-black relative z-[3] text-sm">{{ t('hero.contactMe') }}</div>
      <span class="sr-only">Contact Me</span>
      <div class="contact_me_btn_overlay group-hover:opacity-100" />
      <div class="relative group overflow-hidden w-4 z-[3]">
        <div class="flex group-hover:animate-[frame-contact-me-btn-icon_.3s_ease] translate-x-[-100%]">
          <!-- Arrow right icon (inline SVG replacing @radix-ui/react-icons ArrowRightIcon) -->
          <svg
            class="text-black flex-none relative z-[3]"
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
          <svg
            class="text-black flex-none relative z-[3]"
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
        </div>
      </div>
    </a>
  </div>
</template>
