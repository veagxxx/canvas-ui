import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { cos, invertRGB, sin } from '../../utils/func';
interface Props {
  polygon: number;
  color?: string;
}
export default defineComponent({
  props: ['polygon', 'color'],
  setup(props: Props) {
    const state = reactive<{
      ctx: CanvasRenderingContext2D | null;
      el: HTMLCanvasElement | null;
      width: number;
      height: number;
    }>({
      ctx: null,
      el: null,
      width: 0,
      height: 0,
    })
    const canvasRef = ref();
    onMounted(() => {
      const canvas = canvasRef.value;
      const dpr = 2;
      const width = canvas.parentElement?.offsetWidth || 0, 
            height = canvas.parentElement?.offsetHeight || 0;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.scale(dpr, dpr);
      state.ctx = ctx;
      state.el = canvas;
      state.width = width;
      state.height = height;
      drawPolygon();
    });
    watch(() => props.color, () => {
      drawPolygon();
    })
    const drawPolygon = () => {
      // 清空画布
      state.ctx?.clearRect(0, 0, state.width, state.height);
      // 内角和 = (n - 2) * 180;
      const interiorAngle = (props.polygon - 2) * 180;
      // 每个内角 = 内角和 / 边数
      const angle = interiorAngle / props.polygon;
      // 中心点坐标
      const cx = state.width / 2, cy = state.height / 2;
      const r = Math.min(cx, cy) - 4;
      state.ctx?.beginPath();
      state.ctx?.moveTo(cx, cy - r);
      for (let i = 1; i < props.polygon; i++) {
        const x = cx + r * sin((180 - angle) * i);
        const y = cy - r * cos((180 - angle) * i);
        state.ctx?.lineTo(x, y);
      }
      const wrapperColor = getComputedStyle(canvasRef.value).backgroundColor;
      const color = props.color ? props.color : invertRGB(wrapperColor);
      state.ctx?.closePath();
      state.ctx!.strokeStyle = color;
      state.ctx!.lineWidth = 1;
      state.ctx?.stroke();

    }
    return () => (
      <canvas ref={ canvasRef } class="polygon-canvas" id={`polygon-${props.polygon}`}></canvas>
    );
  }
  
});