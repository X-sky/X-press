<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const cursorRef = ref<HTMLElement | null>(null)

let onMouseMove: ((e: MouseEvent) => void) | null = null
let onMouseLeave: (() => void) | null = null
let onMouseDown: (() => void) | null = null
let onMouseUp: (() => void) | null = null

onMounted(() => {
  const el = cursorRef.value
  if (!el) return

  onMouseMove = (e: MouseEvent) => {
    gsap.to(el, {
      x: e.clientX,
      y: e.clientY,
      opacity: 1,
      delay: 0,
    })
  }

  onMouseLeave = () => {
    gsap.to(el, { opacity: 0 })
  }

  onMouseDown = () => {
    gsap.to(el, { opacity: 0 })
  }

  onMouseUp = () => {
    gsap.to(el, { opacity: 1 })
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  if (onMouseMove) document.removeEventListener('mousemove', onMouseMove)
  if (onMouseLeave) document.removeEventListener('mouseleave', onMouseLeave)
  if (onMouseDown) document.removeEventListener('mousedown', onMouseDown)
  if (onMouseUp) document.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <div
    ref="cursorRef"
    class="hidden lg:block w-4 h-4 opacity-0 pointer-events-none rounded-full border-2 border-accentColor z-[9999] fixed -translate-x-1/2 -translate-y-1/2"
    aria-hidden="true"
  />
</template>
