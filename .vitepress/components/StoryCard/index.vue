<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useTilt } from './useTilt';

const props = defineProps<{
  title: string;
  desc: string;
  hoverTilt?: boolean;
  link?: string;
}>();

const elRef = ref<HTMLDivElement>();

const syncedStyle = computed(() => {
  const el = elRef.value
  if (!el) {
    return {};
  }
  const style = getComputedStyle(el);
  return {
    width: style.width,
    height: style.height
  }
})

const parseRectLen = (s: string | undefined) => {
  if (!s) {
    return 0;
  }
  const num = parseFloat(s.replace('px', ''));
  return isNaN(num) ? 0 : num;
}
const parsedSyncedStyle = computed(() => {
  const style = syncedStyle.value;
  return {
    width: parseRectLen(style.width),
    height: parseRectLen(style.height)
  }
})
const { styles, mouseLeave, mouseMove } = useTilt(parsedSyncedStyle)

const mouseMoveHandler = (e: MouseEvent) => {
  if (props.hoverTilt) {
    mouseMove(e);
  }
}
const jumpTo = () => {
  if (props.link) {
    window.location.href = props.link;
  }
}
</script>
<template>
  <div class="relative">
    <div @mousemove="mouseMoveHandler" @mouseleave="mouseLeave" class="opacity-0 cursor-pointer" :style="syncedStyle"
      @click="jumpTo">
    </div>
    <!-- shadow-content -->
    <div id="card" ref="elRef"
      class="absolute top-0 left-0 -z-10 md:p-6 p-4 bg-white border border-solid border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 pointer"
      :style="styles">
      <h5 class="pb-2 md:text-2xl text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ title }}
      </h5>
      <p class="text-gray-700 dark:text-gray-400">
        {{ desc }}
      </p>
    </div>
  </div>

</template>
<style></style>