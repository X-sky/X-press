<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import Typed from 'typed.js';

const props = defineProps<{
  textList: string[]
}>();

const textRef = ref<HTMLParagraphElement>();

onMounted(() => {
  if (textRef.value) {
    new Typed(textRef.value, {
      strings: props.textList,
      typeSpeed: 50,
      loop: true
    });
  }
})


</script>
<template>
  <div class="flex">
    <p ref="textRef"></p>
  </div>
</template>