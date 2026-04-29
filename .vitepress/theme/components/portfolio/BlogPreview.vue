<script lang="ts" setup>
/**
 * BlogPreview.vue
 *
 * Migrated from X-portfolio-main/components/sections/BlogSection.tsx
 *
 * Blog preview section for the portfolio landing page.
 * - Loads blog posts via VitePress createContentLoader (build-time data)
 * - Displays latest 4 posts using BlogCard components
 * - Selects posts based on current locale (en/zh), with fallback to English
 * - Scroll-triggered quote slide-in animation via useGsapAnimation
 * - "Read more" link points to the coding section (internal route)
 * - Section id="blog" for anchor navigation
 */
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import { useGsapAnimation } from '../../composables/useGsapAnimation'
import { useI18n } from '../../composables/useI18n'
import { useScrollActive } from '../../composables/useScrollActive'
import BlogCard from './BlogCard.vue'
import { data as postsData } from '../../data/posts.data'
import { locales } from '../../../../src/locales'
import type { BlogPost } from '../../data/posts.data'

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const { t, locale, localePath } = useI18n()

// Track visibility for potential navigation highlighting
const _isActive = useScrollActive(sectionRef)

/**
 * Build locale-aware fallback posts from the translation files.
 * Uses the blogFallback data from the current locale, with English fallback URLs.
 */
const fallbackUrls = [
  '/coding/frontend/performance/',
  '/coding/frontend/data-analytics/',
  '/coding/frontend/vue-uni-comp/test',
  '/coding/frontend/auto-hosts/',
]

const fallbackDates = [
  '2024-07-02',
  '2024-06-09',
  '2024-03-30',
  '2023-05-10',
]

const localeFallbackPosts = computed<BlogPost[]>(() => {
  const currentLocale = locale.value
  const messages = locales[currentLocale] as Record<string, any>
  const fallbackMessages = locales.en as Record<string, any>
  const posts = messages?.blogFallback?.posts || fallbackMessages?.blogFallback?.posts || []

  return posts.map((post: { title: string; description: string }, index: number) => ({
    title: post.title,
    description: post.description,
    date: fallbackDates[index] || '2024-01-01',
    url: currentLocale === 'zh'
      ? `/zh${fallbackUrls[index] || '/'}`
      : (fallbackUrls[index] || '/'),
  }))
})

/**
 * Select posts based on current locale.
 * - For the current locale, use its posts if available
 * - Fall back to English posts if current locale has no posts
 * - Fall back to locale-aware hardcoded data if no posts exist at all
 */
const posts = computed<BlogPost[]>(() => {
  const currentLocale = locale.value
  const localePosts = postsData[currentLocale] || []
  const enPosts = postsData.en || []

  // Use current locale posts if available
  if (localePosts.length > 0) return localePosts
  // Fall back to English posts
  if (enPosts.length > 0) return enPosts
  // Fall back to locale-aware hardcoded data
  return localeFallbackPosts.value
})

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
          {{ t('blog.title') }}
        </div>

        <!-- Animated quotes -->
        <div class="overflow-hidden flex flex-col gap-1">
          <div class="qoutes-animation mx-auto text-center text-sm dark:text-white flex flex-col items-center font-normal">
            {{ t('blog.description') }}
          </div>
          <div class="qoutes-animation mx-auto text-center text-sm dark:text-white flex flex-col items-center font-normal">
            <div>{{ t('blog.checkOut') }}</div>
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
        :href="withBase(localePath('/coding/frontend/auto-hosts/'))"
        aria-label="Read more blog posts"
        class="flex items-center gap-2 no-underline"
      >
        <div class="text-accentColor navlink text-sm italic">
          {{ t('blog.readMore') }}
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
