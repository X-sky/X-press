<script lang="ts" setup>
import ArticleGroup from './ArticleGroup.vue';
import { ARTICLE_GROUPS } from './articleGroups';
import HeroSection from './HeroSection.vue';

const articleGroups = ARTICLE_GROUPS;

</script>
<template>
  <div class="lg:px-16 sm:px-10 px-6 box-border">
    <HeroSection />
    <ArticleGroup v-for="group in articleGroups" v-bind="group" class="pb-5" />
  </div>
</template>