<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import HomePage from './HomePage/index.vue';

const { Layout } = DefaultTheme;
</script>
<template>
  <Layout>
    <template #home-features-after>
      <HomePage />
    </template>
  </Layout>
</template>