import { createRouter, createWebHistory } from 'vue-router';
import StableRequest from '../views/StableRequest.vue';

export const routeList = [
  {
    path: '/',
    name: '稳定请求',
    component: StableRequest
  },
  {
    path: '/unstable',
    name: '不稳定请求',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/UnstableRequest.vue')
  },
  {
    path: '/data-splitting',
    name: '数据分割法',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/DataSplit.vue')
  },
  {
    path: '/expired-flag',
    name: '验证标识法',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ValidateFlag.vue')
  },
  {
    path: '/abort-request',
    name: '取消请求法',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AbortRequest.vue')
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeList
});

export default router;
