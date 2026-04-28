<script lang="ts" setup>
import { ref, onMounted, shallowRef } from 'vue'
import { withBase } from 'vitepress'
import LottiePlayer from '../shared/LottiePlayer.vue'
import { useGsapAnimation } from '../../composables/useGsapAnimation'

const containerRef = ref<HTMLElement | null>(null)
const heroLottieData = shallowRef<object | null>(null)

// Load Lottie JSON on client side only
onMounted(async () => {
  try {
    const res = await fetch(withBase('/assets/lottie/hero-lottie.json'))
    heroLottieData.value = await res.json()
  } catch (e) {
    console.warn('[HeroTool] Failed to load hero lottie data:', e)
  }
})

// GSAP spinner rotation (matches original even though spinner images are commented out,
// the rotation refs are kept for potential future use)
useGsapAnimation(containerRef, {
  setup({ gsap, el }) {
    const spinners = el.querySelectorAll('.hero-spinner')
    if (spinners.length) {
      gsap.to(spinners, {
        rotation: 70,
        duration: 30,
        repeat: -1,
      })
    }
  },
})
</script>

<template>
  <div
    ref="containerRef"
    class="max-w-[75rem] min-h-[5rem] m-auto w-full absolute top-[55%] md:gap-40 xl:gap-0 md:top-1/2 md:-translate-y-1/2 left-0 right-0 flex items-center justify-between"
  >
    <!-- Left Circle -->
    <div
      class="relative overflow-hidden xl:overflow-visible w-full h-[16rem] md:w-[27rem] md:h-[27rem] flex justify-center items-center"
    >
      <!-- Lottie animation (visible on xl screens) -->
      <div
        v-if="heroLottieData"
        class="absolute hidden xl:block select-none pointer-events-none left-[-10rem] bottom-[3rem] rotate-270"
      >
        <LottiePlayer
          :animation-data="heroLottieData"
          :loop="true"
          :autoplay="true"
        />
      </div>

      <!-- Center icon -->
      <div
        class="w-14 h-14 md:w-20 md:h-20 select-none pointer-events-none absolute z-[1] bg-gradient-to-tl from-[#22375e] to-[#13191B] shadow-md rounded-full flex justify-center items-center"
      >
        <img
          class="w-4 md:w-6"
          :src="withBase('/assets/hero/source.png')"
          alt="Source icon"
        />
      </div>
    </div>

    <!-- Right Circle -->
    <div
      class="relative overflow-hidden xl:overflow-visible w-full h-[16rem] md:w-[27rem] md:h-[27rem] flex justify-center items-center"
    >
      <!-- Center icon -->
      <div
        class="w-14 h-14 md:w-20 md:h-20 select-none pointer-events-none absolute z-[1] bg-gradient-to-tl from-[#22375e] to-[#13191B] shadow-md rounded-full flex justify-center items-center"
      >
        <img
          class="w-4 md:w-6"
          :src="withBase('/assets/hero/code.png')"
          alt="Code icon"
        />
      </div>
    </div>
  </div>
</template>
