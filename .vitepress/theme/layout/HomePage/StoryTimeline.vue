<script lang="ts" setup>
import Chip from '../../../components/Chip/index.vue';
import StoryCard from '../../../components/StoryCard/StoryCard.vue';
interface TimelineItem {
  date: string;
  title: string;
  desc: string;
}
defineProps<{
  list: TimelineItem[]
}>();
</script>
<template>
  <ul class="flex">
    <li class="md:w-96 w-72 first:pl-3 pr-3 pb-2 overflow-hidden" v-for="item in list">
      <Chip class="ml-1">
        {{ item.date }}
      </Chip>
      <div class="relative w-full h-4 mb-2">
        <div class="absolute -z-10 left-0 top-0 w-[110%] h-full flex items-center">
          <!-- split-line -->
          <div class="w-full h-[2px] bg-gray-100 dark:bg-neutral-700">
          </div>
        </div>
        <div class="w-4 h-4 bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-white"></div>
      </div>
      <div class="w-full px-2">
        <StoryCard v-bind="item" hover-tilt />
      </div>
    </li>
  </ul>
</template>