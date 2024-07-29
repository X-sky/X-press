<script lang="ts" setup>
import GlitchText from '../../../components/GlitchText/index.vue';
import Typewriter from '../../../components/Typewriter/index.vue';

const textList = ["Keep looking, don't settle", "Stay hungry, stay foolish"]
</script>
<template>
  <div class="pt-3 pb-12">
    <GlitchText text="X-PRESS" class="mb-4 sm:text-[128px] text-6xl" />
    <Typewriter :textList="textList" :speed="60" class="flex justify-center text-xl" />
  </div>
</template>