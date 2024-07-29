<script lang="ts" setup>
import { computed, ref, Ref } from 'vue';
import FixedTabs from './common/FixedTabs.vue';
import OutputText from './common/OutputText.vue';
import { TabNames, UNSTABLE_REQ_MAP } from '../lib/constants';
/**增加分别的数据域 */
const dataMap: Record<TabNames, Ref<string>> = {
  Tab0: ref(''),
  Tab1: ref('')
};
const curActiveTab = ref<TabNames | ''>('');
const itemStr = computed(() => {
  if (!curActiveTab.value) {
    return '';
  } else {
    return dataMap[curActiveTab.value].value;
  }
});

const clickTab = async (str: TabNames) => {
  curActiveTab.value = str;
  dataMap[str].value = await UNSTABLE_REQ_MAP[str](str);
};
</script>

<template>
  <div class="p-5">
    <FixedTabs @click="clickTab" />
    <OutputText :text="itemStr" />
  </div>
</template>
