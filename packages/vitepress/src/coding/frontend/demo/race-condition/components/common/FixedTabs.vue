<script lang="ts" setup>
import { ref } from 'vue';
import { TAB_LIST, TabItem, TabNames } from '../../lib/constants';
const emits = defineEmits<{
  (e: 'click', payload: TabNames): void;
}>();

const selectedIdx = ref('');
const clickTab = async (item: TabItem) => {
  selectedIdx.value = item.id;
  emits('click', item.name);
};
</script>
<template>
  <div class="flex items-center mb-5">
    <div
      v-for="item in TAB_LIST"
      class="border border-r-0 last:border-r text-md px-8 py-2 hover:cursor-pointer first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg transition"
      :class="[item.id === selectedIdx ? 'border-blue-300 bg-blue-300 text-white' : 'border-slate-300 hover:bg-slate-300 hover:text-white']"
      @click="clickTab(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>
