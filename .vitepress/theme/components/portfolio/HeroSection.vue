<script lang="ts" setup>
import HeroContent from './HeroContent.vue'
import HeroTool from './HeroTool.vue'
import SocialLinks from './SocialLinks.vue'
</script>

<template>
  <section
    id="home"
    class="w-full relative z-50 min-h-screen bg-baseBackground pt-[4.5rem]"
  >
    <img
      class="w-[38rem] absolute top-[6.5rem] md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 select-none pointer-events-none"
      alt="Hero Background Illustration"
      src="/assets/hero/hero-lines.png"
      aria-label="Hero Background Illustration"
    />
    <HeroTool />
    <HeroContent />
    <SocialLinks />
  </section>
</template>
