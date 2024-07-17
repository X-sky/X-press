<script lang="ts" setup>
import StoryTimeline from './StoryTimeline.vue';

const list = [{
  date: 'July 16th, 2024',
  title: 'HostsWith: \n A Simple Chrome Extension',
  desc: '浏览器插件开发不完全指南，从入门到放弃！'
}, {
  date: 'July 16th, 2024',
  title: 'Vue Uni Component',
  desc: 'vue 跨版本通用组件库，提高开发效率，减少重复工作'
}]

</script>
<template>
  <section>
    <h2 class="mb-3">
      <div class="tracking-tight inline font-semibold text-4xl lg:text-6xl">Issues can be</div>
      <div>
        <!-- <div class="tracking-tight inline font-semibold text-4xl lg:text-6xl">be&nbsp;</div> -->
        <div
          class="tracking-tight inline font-semibold from-[#FF705B] to-[#FFB457] text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b">
          weapons
        </div>
      </div>
    </h2>
    <div>
      <StoryTimeline :list="list" />
    </div>
  </section>
</template>