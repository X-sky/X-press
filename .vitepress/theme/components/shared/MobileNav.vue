<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'
import { useTheme } from '../../composables/useTheme'
import { useI18n } from '../../composables/useI18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

/**
 * MobileNav - Mobile navigation component (visible below 768px)
 *
 * Features:
 * - Hamburger button fixed at top-right
 * - Full-screen overlay panel with all navigation links
 * - Supports portfolio mode (anchor links) and blog mode (category links)
 * - Theme toggle inside the menu
 * - Closes on link click, Escape key, or overlay tap
 * - Smooth slide-in transition
 * - Accessible: aria attributes, focus trap, focus management
 */

// --- State ---
const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const toggleBtnRef = ref<HTMLElement | null>(null)

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

// --- Toggle menu ---
function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

// --- Smooth scroll for portfolio anchor links ---
function scrollToSection(href: string) {
  closeMenu()
  // Small delay to let the menu close animation start
  setTimeout(() => {
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

// --- Navigate to blog category ---
function navigateTo(link: string) {
  closeMenu()
  router.go(withBase(link))
}

// --- Navigate home ---
function goHome() {
  closeMenu()
  router.go(withBase(localePath('/')))
}

// --- Active blog category detection ---
function isCategoryActive(link: string): boolean {
  const currentPath = route.path
  const categoryMatch = link.match(/\/coding\/([^/]+)\//)
  if (!categoryMatch) return false
  return currentPath.includes(`/coding/${categoryMatch[1]}/`)
}

// --- Body scroll lock ---
watch(isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    // Focus the menu panel after it opens
    nextTick(() => {
      menuRef.value?.focus()
    })
  } else {
    document.body.style.overflow = ''
    // Return focus to the toggle button
    nextTick(() => {
      toggleBtnRef.value?.focus()
    })
  }
})

// --- Keyboard handling ---
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  // Ensure body scroll is restored
  document.body.style.overflow = ''
})

// --- Close menu on route change ---
watch(() => route.path, () => {
  closeMenu()
})
</script>

<template>
  <div class="mobile-nav" aria-label="Mobile navigation">
    <!-- Hamburger toggle button -->
    <button
      ref="toggleBtnRef"
      class="mobile-nav__toggle"
      :class="{ 'mobile-nav__toggle--open': isOpen }"
      :aria-expanded="isOpen"
      aria-controls="mobile-nav-panel"
      aria-label="Toggle navigation menu"
      @click="toggleMenu"
    >
      <span class="mobile-nav__bar" aria-hidden="true" />
      <span class="mobile-nav__bar" aria-hidden="true" />
      <span class="mobile-nav__bar" aria-hidden="true" />
    </button>

    <!-- Overlay backdrop -->
    <Transition name="mobile-nav-fade">
      <div
        v-if="isOpen"
        class="mobile-nav__backdrop"
        aria-hidden="true"
        @click="closeMenu"
      />
    </Transition>

    <!-- Navigation panel -->
    <Transition name="mobile-nav-slide">
      <nav
        v-if="isOpen"
        id="mobile-nav-panel"
        ref="menuRef"
        class="mobile-nav__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        tabindex="-1"
      >
        <!-- Logo at top -->
        <div class="mobile-nav__header">
          <a
            href="javascript:void(0)"
            class="mobile-nav__logo"
            @click.prevent="goHome"
            aria-label="Go to homepage"
          >
            <span class="mobile-nav__logo-text">X-Press</span>
          </a>
        </div>

        <!-- Navigation links -->
        <div class="mobile-nav__links">
          <!-- Portfolio mode -->
          <template v-if="isPortfolioMode">
            <a
              v-for="link in portfolioLinks"
              :key="link.title"
              :href="link.href"
              class="mobile-nav__link"
              @click.prevent="scrollToSection(link.href)"
            >
              {{ link.title }}
            </a>
            <div class="mobile-nav__separator" aria-hidden="true" />
            <a
              href="javascript:void(0)"
              class="mobile-nav__link mobile-nav__link--accent"
              @click.prevent="navigateTo(localePath('/coding/frontend/auto-hosts/index.html'))"
            >
              {{ t('nav.coding') }}
              <svg
                class="mobile-nav__link-arrow"
                width="16"
                height="16"
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

          <!-- Blog mode -->
          <template v-else>
            <a
              href="javascript:void(0)"
              class="mobile-nav__link mobile-nav__link--home"
              @click.prevent="goHome"
            >
              <svg
                class="mobile-nav__link-arrow mobile-nav__link-arrow--left"
                width="16"
                height="16"
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
            <div class="mobile-nav__separator" aria-hidden="true" />
            <a
              v-for="cat in blogCategories"
              :key="cat.title"
              href="javascript:void(0)"
              class="mobile-nav__link"
              :class="{ 'mobile-nav__link--active': isCategoryActive(cat.link) }"
              @click.prevent="navigateTo(cat.link)"
            >
              {{ cat.title }}
            </a>
          </template>
        </div>

        <!-- Theme toggle + Language switcher -->
        <div class="mobile-nav__footer">
          <button
            class="mobile-nav__theme-btn"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            <!-- Sun icon -->
            <svg
              v-if="!isDark"
              class="mobile-nav__theme-icon"
              width="22"
              height="22"
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
            <!-- Moon icon -->
            <svg
              v-else
              class="mobile-nav__theme-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span class="mobile-nav__theme-label">
              {{ isDark ? t('nav.lightMode') : t('nav.darkMode') }}
            </span>
          </button>
          <LanguageSwitcher mode="block" />
        </div>
      </nav>
    </Transition>
  </div>
</template>

<style scoped>
/* ============================================
   MobileNav: Only visible below 768px
   ============================================ */
.mobile-nav {
  display: block;
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}

/* ============================================
   Hamburger toggle button
   ============================================ */
.mobile-nav__toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 210;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: rgba(249, 250, 251, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.dark .mobile-nav__toggle {
  background-color: rgba(17, 24, 39, 0.85);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.mobile-nav__toggle:focus-visible {
  outline: 2px solid hsl(var(--accent-color));
  outline-offset: 2px;
}

/* Hamburger bars */
.mobile-nav__bar {
  display: block;
  width: 1.25rem;
  height: 2px;
  background-color: #374151;
  border-radius: 1px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.dark .mobile-nav__bar {
  background-color: #d1d5db;
}

/* Animate to X when open */
.mobile-nav__toggle--open .mobile-nav__bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.mobile-nav__toggle--open .mobile-nav__bar:nth-child(2) {
  opacity: 0;
}

.mobile-nav__toggle--open .mobile-nav__bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ============================================
   Backdrop overlay
   ============================================ */
.mobile-nav__backdrop {
  position: fixed;
  inset: 0;
  z-index: 190;
  background-color: rgba(0, 0, 0, 0.5);
}

/* ============================================
   Navigation panel (slide-in from right)
   ============================================ */
.mobile-nav__panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  width: min(85vw, 320px);
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
  outline: none;
}

.dark .mobile-nav__panel {
  background-color: #111827;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
}

/* ============================================
   Panel header (logo)
   ============================================ */
.mobile-nav__header {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .mobile-nav__header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.mobile-nav__logo {
  text-decoration: none;
}

.mobile-nav__logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: hsl(var(--accent-color));
  font-family: 'Jost', sans-serif;
}

/* ============================================
   Navigation links
   ============================================ */
.mobile-nav__links {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.mobile-nav__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1.05rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
  font-family: 'Jost', sans-serif;
}

.dark .mobile-nav__link {
  color: #d1d5db;
}

.mobile-nav__link:hover,
.mobile-nav__link:focus-visible {
  background-color: rgba(0, 0, 0, 0.04);
  color: hsl(var(--accent-color));
}

.dark .mobile-nav__link:hover,
.dark .mobile-nav__link:focus-visible {
  background-color: rgba(255, 255, 255, 0.06);
  color: hsl(var(--accent-color));
}

.mobile-nav__link:focus-visible {
  outline: 2px solid hsl(var(--accent-color));
  outline-offset: -2px;
  border-radius: 2px;
}

/* Active link */
.mobile-nav__link--active {
  color: hsl(var(--accent-color));
  background-color: rgba(0, 0, 0, 0.03);
}

.dark .mobile-nav__link--active {
  color: hsl(var(--accent-color));
  background-color: rgba(255, 255, 255, 0.04);
}

/* Accent link (Coding entry) */
.mobile-nav__link--accent {
  color: hsl(var(--accent-color));
}

/* Home link */
.mobile-nav__link--home {
  color: hsl(var(--accent-color));
}

/* Arrow icons in links */
.mobile-nav__link-arrow {
  flex-shrink: 0;
}

/* Separator */
.mobile-nav__separator {
  height: 1px;
  margin: 0.5rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.06);
}

.dark .mobile-nav__separator {
  background-color: rgba(255, 255, 255, 0.08);
}

/* ============================================
   Footer (theme toggle)
   ============================================ */
.mobile-nav__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .mobile-nav__footer {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.mobile-nav__theme-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: 'Jost', sans-serif;
  transition: color 0.2s ease;
}

.dark .mobile-nav__theme-btn {
  color: #d1d5db;
}

.mobile-nav__theme-btn:hover {
  color: hsl(var(--accent-color));
}

.mobile-nav__theme-btn:focus-visible {
  outline: 2px solid hsl(var(--accent-color));
  outline-offset: 2px;
  border-radius: 2px;
}

.mobile-nav__theme-icon {
  flex-shrink: 0;
}

.mobile-nav__theme-label {
  font-family: 'Jost', sans-serif;
}

/* ============================================
   Transitions
   ============================================ */

/* Backdrop fade */
.mobile-nav-fade-enter-active,
.mobile-nav-fade-leave-active {
  transition: opacity 0.25s ease;
}

.mobile-nav-fade-enter-from,
.mobile-nav-fade-leave-to {
  opacity: 0;
}

/* Panel slide-in from right */
.mobile-nav-slide-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-nav-slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-nav-slide-enter-from,
.mobile-nav-slide-leave-to {
  transform: translateX(100%);
}
</style>
