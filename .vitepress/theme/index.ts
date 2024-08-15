import DefaultTheme from 'vitepress/theme';
import './custom.css';
import 'virtual:uno.css';

import useImageZoomRegister from './hooks/useImageZoom';

export default {
  ...DefaultTheme,
  setup() {
    // Using
    useImageZoomRegister();
  }
};
