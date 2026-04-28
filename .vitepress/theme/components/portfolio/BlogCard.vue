<script lang="ts" setup>
/**
 * BlogCard.vue
 *
 * Migrated from X-portfolio-main/components/BlogCard.tsx
 *
 * Displays a single blog post entry with:
 * - Title, description, publish date
 * - Hover state with background highlight and arrow rotation
 * - Scroll-triggered slide-up animation via useGsapAnimation
 * - Internal VitePress routing (not external URLs)
 */
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { useGsapAnimation } from '../../composables/useGsapAnimation'

interface Props {
  title: string
  description: string
  date: string
  url: string
}

const props = defineProps<Props>()

const cardRef = ref<HTMLElement | null>(null)

useGsapAnimation(cardRef, {
  setup({ el, gsap }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: '70% bottom',
      },
    })

    tl.fromTo(
      el,
      { y: '100%' },
      { y: 0, ease: 'power1.inOut' },
    )
  },
})

/**
 * Format a date string (e.g. "2024-07-02") into a readable format.
 */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <a
    :href="withBase(props.url)"
    :aria-label="props.title"
    class="w-full overflow-hidden block no-underline"
  >
    <div
      ref="cardRef"
      class="w-full group flex justify-between items-center hover:bg-gray-500 rounded-md hover:bg-opacity-5 transition-colors p-1 pr-0 md:pr-4"
    >
      <div class="w-full flex flex-col md:flex-row items-center gap-5">
        <div class="flex w-full md:w-3/5 flex-col items-start gap-2">
          <!-- Title -->
          <div class="text-lg font-bold dark:text-gray-300">
            {{ props.title }}
          </div>

          <!-- Date with edit icon -->
          <div class="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="gray"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <div class="text-accentColor text-sm">
              {{ formatDate(props.date) }}
            </div>
          </div>

          <!-- Description -->
          <div class="dark:text-gray-400 text-sm">
            {{ props.description }}
          </div>
        </div>
      </div>

      <!-- Arrow icon (desktop only) -->
      <div class="hidden md:flex flex-col items-start gap-2">
        <div
          class="w-7 group-hover:scale-110 transition-transform -rotate-45 h-7 rounded-full bg-accentColor flex justify-center items-center"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </div>
  </a>
</template>
