<script lang="ts" setup>
import StoryTimeline from './StoryTimeline.vue';

interface ILineTextPart {
  text: string;
  /** emphasis color type */
  emColorType?: string
}
interface ITimelineCardInfo {
  date: string;
  title: string;
  desc: string;
  link: string;
}
const props = defineProps<{
  titleLines: ILineTextPart[][];
  list: ITimelineCardInfo[]
}>();

const getEmColorType = (type?: string) => {
  switch (type) {
    case 'red':
      return 'type-red';
    case 'green':
      return 'type-green';
    default:
      return '';
  }
}
</script>
<template>
  <section class="article-group">
    <h2 class="mb-3 text-4xl lg:text-6xl">
      <div v-for="line in titleLines" class="tracking-tight font-semibold">
        <span v-for="textInfo in line"
          :class="[textInfo.emColorType ? 'gradient-text' : '', getEmColorType(textInfo.emColorType)]"
          v-html="textInfo.text">
        </span>
      </div>
    </h2>
    <div>
      <StoryTimeline :list="props.list" />
    </div>
  </section>
</template>
<style lang="scss" scoped>
.article-group {
  max-width: calc(var(--vp-layout-max-width) - 64px);
  margin: 0 auto;
}

.gradient-text {
  --at-apply: bg-clip-text text-transparent bg-gradient-to-b from-[#5EA2EF] to-[#0072F5];
}

.type-green {
  --at-apply: from-[#6FEE8D] to-[#17c964];
}

.type-red {
  --at-apply: from-[#FF705B] to-[#FFB457];
}
</style>