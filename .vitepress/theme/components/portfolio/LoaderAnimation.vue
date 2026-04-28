<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const loaderRef = ref<HTMLElement | null>(null)
const count = ref(0)
const isFinished = ref(false)

let intervalId: ReturnType<typeof setInterval> | null = null
let tl: gsap.core.Timeline | null = null

onMounted(() => {
  const el = loaderRef.value
  if (!el) return

  // Counter animation: count from 0 to 10 over ~1s (matching original 100ms intervals, 0–10)
  intervalId = setInterval(() => {
    if (count.value >= 10) {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      return
    }
    count.value += 1
  }, 100)

  // GSAP timeline: fade counter then collapse stripes
  tl = gsap.timeline({
    onComplete: () => {
      isFinished.value = true
    },
  })

  // Fade out the counter overlay after the count finishes (~1.1s delay)
  tl.to(
    el.querySelector('.loader-counter'),
    {
      opacity: 0,
      duration: 0.01,
      delay: 1.1,
    },
  )

  // Collapse the stripe lines from full height to 0
  tl.to(
    el.querySelectorAll('.loader-line'),
    {
      height: 0,
      duration: 1.5,
      stagger: {
        amount: 0.5,
      },
      ease: 'power4.inOut',
    },
  )
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (tl) {
    tl.kill()
    tl = null
  }
})
</script>

<template>
  <div ref="loaderRef" aria-hidden="true">
    <template v-if="!isFinished">
      <!-- Counter overlay -->
      <div
        class="loader-counter fixed w-screen h-screen z-[10000] left-0 top-0 bg-black p-10 flex justify-end items-end text-7rem font-bold text-accentColor box-border"
      >
        {{ count }}
      </div>
      <!-- Stripe lines overlay -->
      <div class="fixed w-screen h-screen z-[9999] flex left-0 top-0">
        <div
          v-for="i in 11"
          :key="i"
          class="loader-line w-full h-full bg-black"
        />
      </div>
    </template>
  </div>
</template>
