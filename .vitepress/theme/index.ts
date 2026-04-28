import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';
import './portfolio.css';
import 'virtual:uno.css';
import AppLayout from './layout/AppLayout.vue';

export default {
  extends: DefaultTheme,
  Layout: AppLayout
} satisfies Theme;
