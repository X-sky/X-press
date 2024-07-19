import DefaultTheme from 'vitepress/theme';
import './custom.css';
import 'virtual:uno.css';
import CustomLayout from './layout/CustomLayout.vue';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout
};
