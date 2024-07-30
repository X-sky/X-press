<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import EmbedResume from '../components/EmbedResume.vue';
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-before>
      <EmbedResume />
    </template>
  </Layout>
</template>