<script lang="ts" setup>
import { ref } from 'vue';
import FixedTabs from './common/FixedTabs.vue';
import { requestA } from '../lib/request';
import OutputText from './common/OutputText.vue';
import { TabNames } from '../lib/constants';

const clickTab = async (str: TabNames) => {
  itemStr.value = await requestA(str);
};
const itemStr = ref('');
</script>

<template>
  <div class="p-5">
    <FixedTabs @click="clickTab" />
    <OutputText :text="itemStr" />
  </div>
</template>
