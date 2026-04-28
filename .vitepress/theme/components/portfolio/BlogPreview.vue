<script lang="ts" setup>
/**
 * BlogPreview.vue
 *
 * Migrated from X-portfolio-main/components/sections/BlogSection.tsx
 *
 * Blog preview section for the portfolio landing page.
 * - Loads blog posts via VitePress createContentLoader (build-time data)
 * - Displays latest 4 posts using BlogCard components
 * - Scroll-triggered quote slide-in animation via useGsapAnimation
 * - "Read more" link points to the coding section (internal route)
 * - Section id="blog" for anchor navigation
 */
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { useGsapAnimation } from '../../composables/useGsapAnimation'
import { useScrollActive } from '../../composables/useScrollActive'
import BlogCard from './BlogCard.vue'
import { data as posts } from '../../data/posts.data'

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

// Track visibility for potential navigation highlighting
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
    id="blog"
    class="h-full bg-[hsl(var(--base-background))] py-14 px-10 lg:px-[5%]"
  >
    <div class="w-full max-w-[1100px] h-full m-auto flex flex-col items-center gap-14">
      <!-- Section heading -->
      <div class="w-[80%] md:w-full flex flex-col gap-8 items-center">
        <div
          ref="titleRef"
          class="text-xl md:text-4xl tracking-tight font-medium w-fit dark:text-accentColor"
          style="text-decoration: underline; text-decoration-color: hsl(157, 87%, 41%); text-underline-offset: 4px; text-decoration-thickness: 2px;"
        >
          Blog
        </div>

        <!-- Animated quotes -->
        <div class="overflow-hidden flex flex-col gap-1">
          <div class="qoutes-animation mx-auto text-center text-sm dark:text-white flex flex-col items-center font-normal">
            I document my journey by writing blog posts about my projects and
            experiences.
          </div>
          <div class="qoutes-animation mx-auto text-center text-sm dark:text-white flex flex-col items-center font-normal">
            <div>Check out some of my latest entries below. 🚀</div>
          </div>
        </div>
      </div>

      <!-- Blog cards list -->
      <div class="md:w-full pt-4 pb-10 flex flex-col items-start gap-6">
        <BlogCard
          v-for="(post, index) in posts"
          :key="post.url || index"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :url="post.url"
        />
      </div>

      <!-- Read more link (internal route to coding section) -->
      <a
        :href="withBase('/coding/frontend/auto-hosts/')"
        aria-label="Read more blog posts"
        class="flex items-center gap-2 no-underline"
      >
        <div class="text-accentColor navlink text-sm italic">
          Read more
        </div>
        <svg
          width="15"
          height="15"
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
      </a>
    </div>
  </section>
</template>
