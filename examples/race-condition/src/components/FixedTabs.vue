<script setup>
import { ref } from 'vue';
const emits = defineEmits(['click']);

const tabList = ref([
  {
    id: '0',
    name: 'Tab0'
  },
  {
    id: '1',
    name: 'Tab1'
  }
]);
const selectedIdx = ref('');
const clickTab = async (item) => {
  selectedIdx.value = item.id;
  emits('click', item.name);
};

const defaultClassList = ref([
  'border',
  'border-r-0',
  'last:border-r',
  'text-2xl',
  'px-10',
  'py-5',
  'hover:cursor-pointer'
]);
const selectedClassList = ref(['text-blue-600', 'font-bold']);
</script>
<template>
  <div class="flex items-center mb-5">
    <div
      v-for="item in tabList"
      :class="[
        ...defaultClassList,
        item.id === selectedIdx ? [...selectedClassList] : ''
      ]"
      @click="clickTab(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>
