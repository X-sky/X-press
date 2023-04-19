<script lang="ts" setup>
import { computed, ref, shallowReactive } from 'vue';
import StableRequest from '../StableRequest.vue';
import UnstableRequest from '../UnstableRequest.vue';
import DataSplit from '../DataSplit.vue';
import ValidateFlag from '../ValidateFlag.vue';

const compInfoList = shallowReactive([
  {
    name: 'stable',
    component: StableRequest
  },
  {
    name: 'unstable',
    component: UnstableRequest
  },
  {
    name: 'solution<data-splitting>',
    component: DataSplit
  },
  {
    name: 'solution<validate-flag>',
    component: ValidateFlag
  }
]);

const activeIdx = ref(0);
const changeHandler = (idx: number) => {
  activeIdx.value = idx;
};

const activeComp = computed(() => compInfoList[activeIdx.value].component);
</script>
<template>
  <div class="flex items-center">
    <span
      v-for="(compInfo, idx) in compInfoList"
      :key="compInfo.name"
      class="p-2 mr-5 rounded border transition-all cursor-pointer"
      :class="
        activeIdx === idx
          ? 'border-blue-300 bg-blue-300 text-white'
          : 'border-slate-300 hover:bg-slate-300 hover:text-white'
      "
      @click="changeHandler(idx)"
    >
      {{ compInfo.name }}
    </span>
  </div>
  <component :is="activeComp" />
</template>
