import { MaybeRef, ref } from 'vue';

type IUseTiltOptions = MaybeRef<{
  width: number;
  height: number;
}>;

const DEFAULT_STYLE =
  'transform:perspective(1400px) rotateX(0deg) rotateY(0deg)';
const DEFAULT_TILT_DEG = 10;

export function useTilt(params: IUseTiltOptions) {
  const styles = ref(DEFAULT_STYLE);

  const mouseMove = (e: MouseEvent) => {
    let halfHeight = 0;
    let halfWidth = 0;
    if ('value' in params) {
      halfWidth = params.value.width / 2;
      halfHeight = params.value.height / 2;
    } else {
      halfWidth = params.width / 2;
      halfHeight = params.height / 2;
    }
    if (!halfWidth || !halfHeight) {
      return;
    }
    const { offsetX, offsetY } = e;
    let rotateX = 0;
    let rotateY = 0;

    rotateX = -((halfHeight - offsetY) / halfHeight) * DEFAULT_TILT_DEG;
    rotateY = ((halfWidth - offsetX) / halfWidth) * DEFAULT_TILT_DEG;

    styles.value = `transform:perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  const mouseLeave = () => {
    styles.value = '';
  };
  return {
    styles,
    mouseMove,
    mouseLeave
  };
}
