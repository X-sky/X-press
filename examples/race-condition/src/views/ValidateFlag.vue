<script setup>
import { ref } from 'vue';
import FixedTabs from '../components/FixedTabs.vue';
import { requestA, requestB } from '../lib/request';

const requestMap = {
  'Tab0': requestA,
  'Tab1': requestB
}
// 验证标识
let curTabFlag = '';

const clickTab = async (str) => {
  curTabFlag = str;
  const res = await requestMap[str](str);
  if (curTabFlag === str) {
    itemStr.value = res;
  }
};
const itemStr = ref('默认什么都没有');
</script>

<template>
  <div class="p-5">
    <FixedTabs @click="clickTab" />
    <div class="text-lg">
      {{ itemStr }}
    </div>
  </div>
</template>
