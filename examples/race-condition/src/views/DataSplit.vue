<script setup>
import { computed, ref } from 'vue';
import FixedTabs from '../components/FixedTabs.vue';
import { requestA, requestB } from '../lib/request';
const requestMap = {
  Tab0: requestA,
  Tab1: requestB
};
/**增加分别的数据域 */
const dataMap = {
  Tab0: ref(''),
  Tab1: ref('')
};
const curActiveTab = ref('');
const itemStr = computed(() => {
  return (dataMap[curActiveTab.value] || {}).value || '默认什么都没有';
});

const clickTab = async (str) => {
  curActiveTab.value = str;
  dataMap[str].value = await requestMap[str](str);
};
</script>

<template>
  <div class="p-5">
    <FixedTabs @click="clickTab" />
    <div class="text-lg">
      {{ itemStr }}
    </div>
  </div>
</template>
