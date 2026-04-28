<script setup lang="ts">
/**
 * PortfolioLayout.vue
 *
 * Top-level layout for the portfolio landing page.
 * Replaces the old CustomLayout.vue that used DefaultTheme + iframe.
 *
 * This is a fully custom layout — it does NOT extend VitePress DefaultTheme Layout.
 * It composes all portfolio section components in the correct order:
 *
 * 1. LoaderAnimation (full-screen overlay, auto-hides after animation)
 * 2. MouseFollower (fixed cursor follower, desktop only)
 * 3. UnifiedNav (fixed header navigation, portfolio mode)
 * 4. MobileNav (mobile hamburger navigation, visible < 768px)
 * 5. HeroSection (includes SocialLinks as child)
 * 6. AboutSection (includes TechStack as child)
 * 7. BlogPreview (includes BlogCard as child)
 * 8. ProjectSection (includes ProjectCard as child)
 * 9. ContactSection
 *
 * Triggered via frontmatter: layout: portfolio
 * Applies the `portfolio-page` class for Jost font.
 */

import LoaderAnimation from '../components/portfolio/LoaderAnimation.vue'
import MouseFollower from '../components/portfolio/MouseFollower.vue'
import UnifiedNav from '../components/shared/UnifiedNav.vue'
import MobileNav from '../components/shared/MobileNav.vue'
import HeroSection from '../components/portfolio/HeroSection.vue'
import AboutSection from '../components/portfolio/AboutSection.vue'
import BlogPreview from '../components/portfolio/BlogPreview.vue'
import ProjectSection from '../components/portfolio/ProjectSection.vue'
import ContactSection from '../components/portfolio/ContactSection.vue'
</script>

<template>
  <div class="portfolio-page">
    <!-- Full-screen loader overlay (auto-hides after animation) -->
    <LoaderAnimation />

    <!-- Mouse cursor follower (desktop only) -->
    <MouseFollower />

    <!-- Fixed header navigation (desktop: ≥768px) -->
    <UnifiedNav />

    <!-- Mobile navigation (< 768px) -->
    <MobileNav />

    <!-- Main content sections -->
    <main>
      <HeroSection />
      <AboutSection />
      <BlogPreview />
      <ProjectSection />
      <ContactSection />
    </main>
  </div>
</template>

<style scoped>
.portfolio-page {
  /* Ensure the portfolio page takes full width, no VitePress default padding */
  width: 100%;
  min-height: 100vh;
}
</style>
