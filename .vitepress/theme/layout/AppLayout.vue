<script setup lang="ts">
/**
 * AppLayout.vue
 *
 * Root layout wrapper that routes between PortfolioLayout and DefaultTheme Layout
 * based on the page's frontmatter `layout` field.
 *
 * - layout: portfolio → PortfolioLayout (full custom portfolio landing page)
 * - Any other layout   → DefaultTheme Layout (blog pages, doc pages, etc.)
 */
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PortfolioLayout from './PortfolioLayout.vue'

const { Layout: DefaultLayout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <PortfolioLayout v-if="frontmatter.layout === 'portfolio'" />
  <DefaultLayout v-else />
</template>
