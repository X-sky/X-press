<script lang="ts" setup>
/**
 * ProjectCard.vue
 *
 * Migrated from X-portfolio-main/components/ProjectCard.tsx
 *
 * Individual project card with:
 * - Project image at the top
 * - Title, description, tech stack badges, and GitHub link
 * - Hover effect: accent-color circle expands from bottom-right corner
 * - Scroll-triggered scale-in animation via useGsapAnimation
 *
 * Uses UnoCSS/Tailwind classes matching the original design.
 */
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { useGsapAnimation } from '../../composables/useGsapAnimation'
import type { Project } from '../../data/projects'

const props = defineProps<{
  item: Project
}>()

const cardRef = ref<HTMLElement | null>(null)

useGsapAnimation(cardRef, {
  setup({ el, gsap }) {
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: '70% bottom',
      },
    }).fromTo(
      el,
      { scale: 0 },
      { scale: 1, ease: 'power1.inOut' },
    )
  },
})
</script>

<template>
  <div
    ref="cardRef"
    class="relative overflow-hidden col-span-1 w-full flex flex-col shadow-sm border border-gray-200 dark:border-gray-700 rounded-[0.75rem] h-[380px] transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
  >
    <!-- Project image -->
    <div class="flex items-center h-[187px] overflow-hidden">
      <img
        :alt="item.title"
        :src="withBase(item.image)"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>

    <!-- Card body with hover circle effect -->
    <div
      class="flex-1 group relative after:content-[''] after:rounded-full after:absolute after:z-[10] after:w-[32px] after:h-[32px] after:bg-accentColor after:scale-[1] after:bottom-[-24px] after:right-[-24px] after:origin-center after:transition-transform after:duration-500 after:ease-out hover:after:scale-[25] overflow-hidden p-4 flex flex-col items-start justify-between"
    >
      <!-- Title & description -->
      <div class="w-full px-4 absolute left-[50%] -translate-x-1/2 z-20 flex flex-col gap-2 items-start">
        <div class="w-full flex justify-between items-center">
          <div class="text-accentColor group-hover:text-white font-medium">
            {{ item.title }}
          </div>
        </div>
        <div class="text-black dark:text-gray-300 text-sm group-hover:text-white">
          {{ item.description }}
        </div>
      </div>

      <!-- Tech stacks & GitHub link -->
      <div class="w-full px-4 left-[50%] -translate-x-1/2 bottom-[10%] absolute z-20 flex items-center justify-between">
        <!-- Tech stack badges -->
        <div class="flex items-center gap-2 flex-wrap">
          <template v-for="(tech, index) in item.techStacks" :key="index">
            <div
              v-if="index % 2 === 0"
              class="px-2 py-[3px] shadow-sm border border-accentColor bg-white rounded-xl text-sm text-black flex justify-center items-center"
            >
              {{ tech }}
            </div>
            <div
              v-else
              class="px-2 py-[3px] shadow-sm bg-accentColor group-hover:border-[0.01px] rounded-xl text-sm text-white flex justify-center items-center"
            >
              {{ tech }}
            </div>
          </template>
        </div>

        <!-- GitHub link -->
        <a
          v-if="item.githubURL"
          :href="item.githubURL"
          :title="`See '${item.title}' on Github`"
          target="_blank"
          rel="noreferrer"
          class="flex items-center gap-2 no-underline"
        >
          <div class="group-hover:text-white dark:text-white">Visit</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            class="opacity-75 fill-black dark:fill-white"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
