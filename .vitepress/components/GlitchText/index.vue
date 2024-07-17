<script lang="ts" setup>
// could be invalid due to prefers-reduced-motion setting
import { ref } from 'vue';
const clockRef = ref<HTMLDivElement>();
defineProps<{
  text: string
}>();

setTimeout(() => {
  clockRef.value?.classList.remove('is-off');
}, 2000)
</script>
<template>
  <div class="screen glitch">
    <div ref="clockRef" class="clock is-off">
      <div :data-time="text" class="content">{{ text }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import './index.scss';
</style>