<script setup>
import { ref } from 'vue';
import FixedTabs from '../components/FixedTabs.vue';
import { requestA, requestB } from '../lib/request';
const requestMap = {
  'Tab0': requestA,
  'Tab1': requestB
}

const clickTab = async (str) => {
  itemStr.value = await requestMap[str](str);
};
const itemStr = ref('默认什么都没有');
</script>

<template>
  <div class="p-5">
    <FixedTabs @click="clickTab"/>
    <div class="text-lg">
      {{ itemStr }}
    </div>
  </div>
</template>
