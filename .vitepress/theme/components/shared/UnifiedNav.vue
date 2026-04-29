<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'
import { useTheme } from '../../composables/useTheme'
import { useScrollActive } from '../../composables/useScrollActive'
import { useI18n } from '../../composables/useI18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

/**
 * UnifiedNav - Dual-mode navigation component
 *
 * Portfolio mode (homepage): anchor links (About, Blog, Projects, Contact) + blog entry (Coding →)
 * Blog mode (/coding/*): back-to-home (← Home) + category links (Frontend, Python, Others)
 *
 * Desktop only — hidden below 768px (MobileNav handles mobile).
 * Fixed at top with glass-morphism backdrop blur.
 */

// --- Route detection ---
const route = useRoute()
const router = useRouter()

// --- i18n ---
const { t, localePath, locale } = useI18n()

const isPortfolioMode = computed(() => {
  const path = route.path
  return (
    path === '/' ||
    path === '/index.html' ||
    path === '/zh/' ||
    path === '/zh/index.html' ||
    path === withBase('/') ||
    path === withBase('/index.html') ||
    path === withBase('/zh/') ||
    path === withBase('/zh/index.html')
  )
})

// --- Theme ---
const { isDark, toggleTheme } = useTheme()

// --- Portfolio nav links (i18n) ---
const portfolioLinks = computed(() => [
  { title: t('nav.about'), href: '#about' },
  { title: t('nav.blog'), href: '#blog' },
  { title: t('nav.projects'), href: '#project' },
  { title: t('nav.contact'), href: '#contact' },
])

// --- Blog category links (i18n) ---
const blogCategories = computed(() => [
  { title: t('nav.frontend'), link: localePath('/coding/frontend/auto-hosts/index.html') },
  { title: t('nav.python'), link: localePath('/coding/python/markdowns/pythonCrashCourse/index.html') },
  { title: t('nav.others'), link: localePath('/coding/others/shortcuts/index.html') },
])

// --- Scroll active tracking for portfolio mode ---
const aboutRef = ref<HTMLElement | null>(null)
const blogRef = ref<HTMLElement | null>(null)
const projectRef = ref<HTMLElement | null>(null)
const contactRef = ref<HTMLElement | null>(null)

const aboutActive = useScrollActive(aboutRef)
const blogActive = useScrollActive(blogRef)
const projectActive = useScrollActive(projectRef)
const contactActive = useScrollActive(contactRef)

// Map section ids to their active state
const sectionActiveMap = computed(() => ({
  '#about': aboutActive.value,
  '#blog': blogActive.value,
  '#project': projectActive.value,
  '#contact': contactActive.value,
}))

// Bind section refs on mount (find DOM elements by id)
onMounted(() => {
  aboutRef.value = document.getElementById('about') || null
  blogRef.value = document.getElementById('blog') || null
  projectRef.value = document.getElementById('project') || null
  contactRef.value = document.getElementById('contact') || null
})

// --- GSAP header entrance animation ---
const headerRef = ref<HTMLElement | null>(null)
let gsapCtx: any = null

onMounted(async () => {
  if (!isPortfolioMode.value) return
  try {
    const gsapModule = await import('gsap')
    const gsap = gsapModule.default || gsapModule
    gsapCtx = gsap.context(() => {
      gsap.fromTo(
        headerRef.value,
        { y: -120, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 2.2, ease: 'power2.out' }
      )
    }, headerRef.value!)
  } catch {
    // Fallback: make header visible immediately
    if (headerRef.value) {
      headerRef.value.style.transform = 'translateY(0)'
      headerRef.value.style.opacity = '1'
    }
  }
})

onUnmounted(() => {
  gsapCtx?.revert()
})

// --- Smooth scroll for portfolio anchor links ---
function scrollToSection(href: string) {
  const el = document.querySelector(href)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// --- Navigate to blog category ---
function navigateTo(link: string) {
  router.go(withBase(link))
}

// --- Navigate home ---
function goHome() {
  router.go(withBase(localePath('/')))
}

// --- Active blog category detection ---
function isCategoryActive(link: string): boolean {
  const currentPath = route.path
  // Extract category from link path, e.g. /coding/frontend/... → frontend
  const categoryMatch = link.match(/\/coding\/([^/]+)\//)
  if (!categoryMatch) return false
  return currentPath.includes(`/coding/${categoryMatch[1]}/`)
}
</script>

<template>
  <header
    ref="headerRef"
    class="unified-nav"
    :style="isPortfolioMode ? { transform: 'translateY(-120px)', opacity: '0' } : {}"
  >
    <div class="unified-nav__inner">
      <!-- Logo -->
      <div class="unified-nav__logo">
        <a
          href="javascript:void(0)"
          class="unified-nav__logo-link"
          @click.prevent="goHome"
          aria-label="Go to homepage"
        >
          <span class="unified-nav__logo-text">X-Press</span>
        </a>
      </div>

      <!-- Navigation links (center) -->
      <nav class="unified-nav__links" aria-label="Main navigation">
        <!-- Portfolio mode: anchor links -->
        <template v-if="isPortfolioMode">
          <a
            v-for="link in portfolioLinks"
            :key="link.title"
            :href="link.href"
            class="navlink"
            :data-active="sectionActiveMap[link.href as keyof typeof sectionActiveMap] || false"
            @click.prevent="scrollToSection(link.href)"
          >
            {{ link.title }}
          </a>
          <a
            href="javascript:void(0)"
            class="navlink unified-nav__coding-entry"
            @click.prevent="navigateTo(localePath('/coding/frontend/auto-hosts/index.html'))"
          >
            {{ t('nav.coding') }}
            <svg
              class="unified-nav__arrow-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </template>

        <!-- Blog mode: home link + category links -->
        <template v-else>
          <a
            href="javascript:void(0)"
            class="navlink unified-nav__home-link"
            @click.prevent="goHome"
          >
            <svg
              class="unified-nav__arrow-icon unified-nav__arrow-icon--left"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            {{ t('nav.home') }}
          </a>
          <span class="unified-nav__divider" aria-hidden="true">|</span>
          <a
            v-for="cat in blogCategories"
            :key="cat.title"
            href="javascript:void(0)"
            class="navlink"
            :data-active="isCategoryActive(cat.link)"
            @click.prevent="navigateTo(cat.link)"
          >
            {{ cat.title }}
          </a>
        </template>
      </nav>

      <!-- Right side: theme toggle + language switcher -->
      <div class="unified-nav__actions">
        <LanguageSwitcher mode="inline" />
        <button
          class="unified-nav__theme-btn"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <!-- Sun icon (shown in light mode) -->
          <svg
            v-if="!isDark"
            class="unified-nav__theme-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <!-- Moon icon (shown in dark mode) -->
          <svg
            v-else
            class="unified-nav__theme-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ============================================
   UnifiedNav: Fixed header with glass-morphism
   ============================================ */
.unified-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background-color: rgba(249, 250, 251, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  /* Hide on mobile — MobileNav handles < 768px */
  display: none;
}

.dark .unified-nav {
  background-color: rgba(17, 24, 39, 0.75);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
  .unified-nav {
    display: block;
  }
}

/* Inner container */
.unified-nav__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 4.5rem;
  padding: 0 5%;
  max-width: 100%;
}

/* ============================================
   Logo
   ============================================ */
.unified-nav__logo {
  justify-self: start;
}

.unified-nav__logo-link {
  text-decoration: none;
  font-size: 1.25rem;
}

.unified-nav__logo-text {
  font-weight: 700;
  color: hsl(var(--accent-color));
  font-family: 'Jost', sans-serif;
}

/* ============================================
   Navigation links (center)
   ============================================ */
.unified-nav__links {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  justify-self: center;
}

/* Coding entry with arrow */
.unified-nav__coding-entry {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* Home link with left arrow */
.unified-nav__home-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* Arrow icons */
.unified-nav__arrow-icon {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.unified-nav__coding-entry:hover .unified-nav__arrow-icon {
  transform: translateX(3px);
}

.unified-nav__home-link:hover .unified-nav__arrow-icon--left {
  transform: translateX(-3px);
}

/* Divider between Home and categories */
.unified-nav__divider {
  color: var(--navbar-text-color);
  opacity: 0.3;
  user-select: none;
  font-size: 0.85rem;
}

/* ============================================
   Actions (right side)
   ============================================ */
.unified-nav__actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Theme toggle button */
.unified-nav__theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  cursor: pointer;
  color: var(--navbar-text-color);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.unified-nav__theme-btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.dark .unified-nav__theme-btn:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.unified-nav__theme-btn:focus-visible {
  outline: 2px solid hsl(var(--accent-color));
  outline-offset: 2px;
}

.unified-nav__theme-icon {
  flex-shrink: 0;
}

.dark .unified-nav__theme-icon {
  color: #e5e7eb;
}
</style>
