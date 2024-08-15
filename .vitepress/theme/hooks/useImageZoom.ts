import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vitepress';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.min.css';

const viewerOpt: Viewer.Options = {
  navbar: false,
  title: false,
  transition: false,
  toolbar: {
    zoomIn: 4,
    zoomOut: 4,
    oneToOne: 4,
    rotateLeft: 4,
    rotateRight: 4
  }
};

interface UseImageZoomRegisterConfig {
  selector?: string;
  /** 排除的图片路径 */
  exclude?: Array<string | RegExp>;
}
/**
 * 注册 image zoom 浏览器
 * @param selector Parameter<document.querySelector>
 * @description temporarily global
 */
const useImageZoomRegister = ({
  selector = '.vp-doc',
  exclude = []
}: UseImageZoomRegisterConfig = {}) => {
  const viewer = ref<Viewer | null>(null);
  const route = useRoute();
  // set filter function
  viewerOpt.filter = (imageEl: HTMLImageElement) => {
    const { src: imgSrc } = imageEl;
    const matchExclude = exclude.some((rule) => {
      if (typeof rule === 'string') {
        return imgSrc.includes(rule);
      }
      return rule.test(imgSrc);
    });
    return !matchExclude;
  };
  /** update viewer */
  const updateViewer = () => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) {
      return;
    }
    viewer.value = new Viewer(el, viewerOpt);
  };
  onMounted(() => {
    updateViewer();
  });
  watch(
    () => route.path,
    () => {
      nextTick(() => {
        // trigger update when route changes
        viewer.value?.destroy();
        updateViewer();
      });
    }
  );
};

export default useImageZoomRegister;
