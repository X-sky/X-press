<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import Typed from 'typed.js';

const props = withDefaults(defineProps<{
  textList: string[],
  speed?: number,
  loop?: boolean,
}>(), {
  speed: 50,
  loop: true
});

const textRef = ref<HTMLParagraphElement>();

onMounted(() => {
  if (textRef.value) {
    new Typed(textRef.value, {
      strings: props.textList,
      typeSpeed: props.speed,
      loop: props.loop
    });
  }
})


</script>
<template>
  <div class="flex">
    <p ref="textRef"></p>
  </div>
</template>