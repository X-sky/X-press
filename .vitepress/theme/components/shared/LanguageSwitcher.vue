<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { useI18n } from '../../composables/useI18n'

/**
 * LanguageSwitcher - Toggle between English and Chinese
 *
 * Props:
 * - mode: 'inline' (compact, for desktop nav bar) | 'block' (wider, for mobile panel)
 *
 * Displays the target language label. Clicking navigates to the
 * equivalent page in the other language using switchLocale.
 */

interface Props {
  mode?: 'inline' | 'block'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'inline',
})

const { locale, t, switchLocale } = useI18n()
const router = useRouter()

/** The locale we will switch TO */
const targetLocale = computed(() => (locale.value === 'en' ? 'zh' : 'en'))

/** Human-readable label for the current language */
const currentLabel = computed(() => t('languageSwitcher.' + locale.value))

/** Human-readable label for the target language */
const targetLabel = computed(() => t('languageSwitcher.' + targetLocale.value))

/** Navigate to the other language version of the current page */
function switchLanguage() {
  const targetPath = switchLocale(targetLocale.value)
  router.go(withBase(targetPath))
}
</script>

<template>
  <button
    class="lang-switcher"
    :class="{
      'lang-switcher--inline': props.mode === 'inline',
      'lang-switcher--block': props.mode === 'block',
    }"
    :aria-label="`Switch language to ${targetLabel}`"
    @click="switchLanguage"
  >
    <svg
      class="lang-switcher__icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
    <span class="lang-switcher__label">
      {{ currentLabel }}
    </span>
  </button>
</template>

<style scoped>
/* ============================================
   LanguageSwitcher: shared base styles
   Glass-morphism consistent with UnifiedNav
   ============================================ */
.lang-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--navbar-text-color);
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.lang-switcher:focus-visible {
  outline: 2px solid hsl(var(--accent-color));
  outline-offset: 2px;
}

/* ============================================
   Inline mode (desktop nav bar)
   Compact button matching .unified-nav__theme-btn
   ============================================ */
.lang-switcher--inline {
  height: 2.25rem;
  padding: 0 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
}

.lang-switcher--inline:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.dark .lang-switcher--inline:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

/* ============================================
   Block mode (mobile nav panel)
   Wider button matching .mobile-nav__theme-btn
   ============================================ */
.lang-switcher--block {
  width: 100%;
  padding: 0.75rem 0;
  font-size: 0.95rem;
  border-radius: 0;
  color: #374151;
}

.dark .lang-switcher--block {
  color: #d1d5db;
}

.lang-switcher--block:hover {
  color: hsl(var(--accent-color));
}

.lang-switcher--block:focus-visible {
  border-radius: 2px;
}

/* ============================================
   Icon
   ============================================ */
.lang-switcher__icon {
  flex-shrink: 0;
}

.dark .lang-switcher--inline .lang-switcher__icon {
  color: #e5e7eb;
}

/* ============================================
   Label
   ============================================ */
.lang-switcher__label {
  font-family: 'Jost', sans-serif;
  white-space: nowrap;
}
</style>
