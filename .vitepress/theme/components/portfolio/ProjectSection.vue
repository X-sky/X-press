<script lang="ts" setup>
/**
 * ProjectSection.vue
 *
 * Migrated from X-portfolio-main/components/sections/ProjectSection.tsx
 *
 * Project showcase section for the portfolio landing page.
 * - Section id="project" for anchor navigation
 * - Displays 3 project cards in a responsive grid (1 col mobile, 2 col md, 3 col lg)
 * - Scroll-triggered quote slide-in animation via useGsapAnimation
 * - "Explore more" link points to GitHub profile
 * - Title with underline decoration matching the original design
 */
import { ref } from 'vue'
import { useGsapAnimation } from '../../composables/useGsapAnimation'
import { useScrollActive } from '../../composables/useScrollActive'
import ProjectCard from './ProjectCard.vue'
import { projects } from '../../data/projects'

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

// Track visibility for navigation highlighting
const _isActive = useScrollActive(sectionRef)

useGsapAnimation(sectionRef, {
  setup({ el, gsap }) {
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scrub: true,
        onEnter: () => {
          gsap.fromTo(
            el.querySelectorAll('.qoutes-animation'),
            { y: '-200%' },
            { y: 0 },
          )
        },
      },
    })
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    id="project"
    class="relative h-full bg-gray-50 dark:bg-gray-100 dark:bg-opacity-5 overflow-hidden py-14 px-10 lg:px-[5%]"
  >
    <div class="w-full max-w-[1100px] h-full m-auto flex flex-col items-center gap-14">
      <!-- Section heading -->
      <div class="w-[80%] md:w-full flex absolute left-1/2 -translate-x-1/2 flex-col gap-8 items-center">
        <div
          ref="titleRef"
          class="text-xl md:text-4xl tracking-tight font-medium w-fit dark:text-accentColor"
          style="text-decoration: underline; text-decoration-color: hsl(157, 87%, 41%); text-underline-offset: 4px; text-decoration-thickness: 2px;"
        >
          Featured Projects
        </div>

        <!-- Animated quote -->
        <div class="overflow-hidden">
          <div class="qoutes-animation md:w-full text-center font-medium flex flex-col items-center dark:text-white">
            <div>OpenSource is not about community, it&apos;s about attitude.</div>
          </div>
        </div>
      </div>

      <!-- Project cards grid -->
      <div class="w-full pt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :item="project"
        />
      </div>

      <!-- Explore more link -->
      <div class="font-medium dark:text-white">
        Explore more projects in
        <a
          href="https://github.com/ShinnTNT"
          target="_blank"
          aria-label="Explore more in my github profile"
          rel="noopener noreferrer"
          class="text-accentColor no-underline hover:underline"
        >
          my github profile
        </a>
      </div>
    </div>
  </section>
</template>
