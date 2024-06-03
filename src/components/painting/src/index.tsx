import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watchEffect
} from 'vue';
import { PaintingProps } from './types';
import PaintingBoard from './components/painting-board';
import Toolbar from './components/toolbar';
import { Painting } from './core/painting';
import { DRAW_STATE } from './config/paint.config';
import './style/index.css';

const NAME = 'Painting';
const defaultProps = {
  width: 800,
  height: 500,
  toolbars: [
    'lineSize',
    '-',
    'shape',
    'brush',
    'fill',
    'color',
    '=',
    'revoke',
    'next',
    'save',
    'download'
  ],
  themeColor: '#626AEF',
};

export default defineComponent({
  name: NAME,
  props: PaintingProps,
  emits: ['on-save'],
  setup(props, { emit }) {
    const width = computed(() => {
      if (typeof props.width === 'string') {
        return isNaN(+props.width) ? defaultProps.width : +props.width;
      }
      return props.width ? props.width : defaultProps.width;
    }).value;

    const height = computed(() => {
      if (typeof props.height === 'string') {
        return isNaN(parseInt(props.height))
          ? defaultProps.height
          : parseInt(props.height);
      }
      return props.height ? props.height : defaultProps.height;
    }).value;

    const splitIndex = ref(-1);

    const toolbars = computed(() => props.toolbars || defaultProps.toolbars).value;

    const getSplitIndex = () => {
      return toolbars.findIndex((toolbar) => toolbar === '=');
    };
    
    watchEffect(() => {
      if (toolbars && toolbars.length) {
        splitIndex.value = getSplitIndex();
      }
    });

    const leftToolbars = computed(() => {
      if (splitIndex.value === -1) return toolbars;
      return toolbars.slice(0, splitIndex.value);
    }).value;

    const rightToolbars = computed(() => {
      if (splitIndex.value === -1) return [];
      return toolbars.slice(splitIndex.value + 1);
    }).value;

    const state = reactive<{
      painting: Painting | null;
      canRevoke: boolean;
      canNext: boolean;
    }>({
      painting: null,
      canRevoke: false,
      canNext: false
    });

    const drawState = reactive({
      shape: '',
      lineSize: DRAW_STATE.defaultLineSize,
      fill: false,
      color: '#000000',
      spikes: 0,
      sizes: DRAW_STATE.default
    });

    onMounted(() => {
      state.painting = new Painting('shape-canvas', 'line-canvas');
      if (props.shapes && props.shapes.length) {
        state.painting.initGraphics(props.shapes);
      }
      state.canRevoke = state.painting.canRevoke();
    });

    const setState = () => {
      state.painting?.setDrawState(drawState, (data) => {
        drawState.shape = data.shape;
        drawState.lineSize = data.lineSize;
        drawState.fill = data.fill;
        drawState.spikes = data.spikes;
        updateState();
      });
    };

    const updateState = () => {
      state.canRevoke = state.painting!.canRevoke();
      state.canNext = state.painting!.canNext();
    };

    const onShape = (value: string, spikes: number) => {
      if (spikes) {
        drawState.shape =
          drawState.shape === value && drawState.spikes === spikes ? '' : value;
      } else {
        drawState.shape = drawState.shape === value ? '' : value;
      }
      if (value === 'brush') {
        drawState.sizes = DRAW_STATE.brush;
        drawState.lineSize = DRAW_STATE.brushLineSize;
      } else {
        drawState.lineSize = DRAW_STATE.defaultLineSize;
        drawState.sizes = DRAW_STATE.default;
      }
      drawState.fill = false;
      drawState.spikes = spikes;
      setState();
    };

    const onLineSize = (value: number) => {
      drawState.lineSize = value;
      setState();
    };

    const onUseFill = () => {
      drawState.fill = !drawState.fill;
      drawState.shape = '';
      setState();
    };
    const onColor = (value: string) => {
      drawState.color = value;
      setState();
    };

    const onRevoke = () => {
      state.painting?.doRevoke();
      updateState();
    };

    const onNext = () => {
      state.painting?.doNext();
      updateState();
    };

    const onSave = () => {
      emit('on-save', state.painting?.getShapeData());
    };

    const onDownload = () => {
      const canvas = document.getElementById('shape-canvas') as HTMLCanvasElement;
      // a 标签
      const a: HTMLAnchorElement = document.createElement('a');
      a.style.display = 'none';
      const href: string = canvas.toDataURL();
      a.href = href;
      // 下载后文件名
      a.download = 'painting.png';
      document.body.appendChild(a);
      // 点击下载
      a.click();
      // 下载完成移除元素
      document.body.removeChild(a);
      // 释放掉blob对象
      window.URL.revokeObjectURL(href);
    };

    onBeforeUnmount(() => {
      state.painting?.destroy();
    });

    return () => (
      <div id="painting" class="painting" style={{ width: width + 'px', height: height + 'px' }}>
        <div class="painting-toolbar">
          <div class="toolbar toolbar-left">
            <Toolbar
              {...drawState}
              canRevoke={state.canRevoke}
              canNext={state.canNext}
              toolbars={leftToolbars}
              onColor={onColor}
              onShape={onShape}
              onFill={onUseFill}
              onLineSize={onLineSize}
              onRevoke={onRevoke}
              onNext={onNext}
              onSave={onSave}
              onDownload={onDownload}
            ></Toolbar>
          </div>
          <div class="toolbar toolbar-right">
            <Toolbar
              {...drawState}
              canRevoke={state.canRevoke}
              canNext={state.canNext}
              toolbars={rightToolbars}
              onColor={onColor}
              onShape={onShape}
              onFill={onUseFill}
              onLineSize={onLineSize}
              onRevoke={onRevoke}
              onNext={onNext}
              onSave={onSave}
              onDownload={onDownload}
            ></Toolbar>
          </div>
        </div>
        <div class="painting-board">
          <PaintingBoard></PaintingBoard>
        </div>
      </div>
    );
  }
});
