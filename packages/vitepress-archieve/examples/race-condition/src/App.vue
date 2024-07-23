<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { routeList } from './router';
import StyledRouterLink from './router/StyledRouterLink.vue';
const router = ref(routeList);
</script>

<template>
  <header>
    <div class="p-5">
      <nav class="flex items-center">
        <StyledRouterLink v-for="item in router" :to="item.path">
          {{ item.name }}
        </StyledRouterLink>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>
