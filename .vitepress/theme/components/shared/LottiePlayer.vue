<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import type { AnimationItem } from 'lottie-web'

export interface LottiePlayerProps {
  animationData: object
  loop?: boolean
  autoplay?: boolean
  renderer?: 'svg' | 'canvas'
}

const props = withDefaults(defineProps<LottiePlayerProps>(), {
  loop: true,
  autoplay: true,
  renderer: 'svg',
})

const containerRef = ref<HTMLElement | null>(null)
const hasError = ref(false)

let animationInstance: AnimationItem | null = null

onMounted(async () => {
  const el = containerRef.value
  if (!el) return

  try {
    // Dynamic import to ensure lottie-web is only loaded on the client side
    const lottie = (await import('lottie-web')).default

    animationInstance = lottie.loadAnimation({
      container: el,
      renderer: props.renderer,
      loop: props.loop,
      autoplay: props.autoplay,
      animationData: props.animationData,
    })

    animationInstance.addEventListener('error', () => {
      hasError.value = true
    })
  } catch (e) {
    console.warn('[LottiePlayer] Failed to initialize lottie animation:', e)
    hasError.value = true
  }
})

onUnmounted(() => {
  if (animationInstance) {
    animationInstance.destroy()
    animationInstance = null
  }
})
</script>

<template>
  <div class="lottie-player">
    <div
      v-show="!hasError"
      ref="containerRef"
      class="lottie-container"
    />
    <div
      v-if="hasError"
      class="lottie-placeholder"
    >
      <span class="lottie-placeholder-icon">🎬</span>
    </div>
  </div>
</template>

<style scoped>
.lottie-player {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottie-container {
  width: 100%;
  height: 100%;
}

.lottie-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-bg-soft, #f5f5f5);
  border-radius: 8px;
  min-height: 100px;
}

.lottie-placeholder-icon {
  font-size: 2rem;
  opacity: 0.5;
}
</style>
