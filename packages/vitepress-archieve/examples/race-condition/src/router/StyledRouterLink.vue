<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
const defaultClassStr = ref(
  'p-2 mr-5 rounded border border-blue-300 hover:text-white hover:bg-blue-300 transition-all'
);
const activeClassStr = ref(
  'bg-blue-300 text-white'
)
defineProps(['to']);
</script>
<template>
  <RouterLink :class="defaultClassStr" :active-class="activeClassStr" :to="to" exact>
    <slot />
  </RouterLink>
</template>
