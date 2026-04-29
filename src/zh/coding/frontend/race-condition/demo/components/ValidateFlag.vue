<script lang="ts" setup>
import { ref } from 'vue';
import FixedTabs from './common/FixedTabs.vue';
import OutputText from './common/OutputText.vue';
import { TabNames, UNSTABLE_REQ_MAP } from '../lib/constants';

// 验证标识
let curTabFlag = '';

const clickTab = async (str: TabNames) => {
  curTabFlag = str;
  const res = await UNSTABLE_REQ_MAP[str](str);
  if (curTabFlag === str) {
    itemStr.value = res;
  }
};
const itemStr = ref('');
</script>

<template>
  <div class="p-5">
    <FixedTabs @click="clickTab" />
    <OutputText :text="itemStr" />
  </div>
</template>
