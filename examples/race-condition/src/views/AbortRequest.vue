<script setup>
import { ref } from 'vue';
import FixedTabs from '../components/FixedTabs.vue';
import { requestServer, requestServerDelay } from '../lib/request';
const requestMap = {
  Tab0: requestServer,
  Tab1: requestServerDelay
};

let controller = new AbortController();
let signal = controller.signal;

const resetController = () => {
  controller = new AbortController();
  signal = controller.signal;
};

const clickTab = async (str) => {
  // 中断上次请求;
  controller.abort();
  resetController();
  try {
    itemStr.value = await requestMap[str](signal);
  } catch (err) {
    console.warn(err);
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
