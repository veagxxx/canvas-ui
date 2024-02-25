import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { cos, invertRGB, sin } from '../../utils/func';
interface Props {
  id: string;
  spikes: number;
  color?: string;
}
export default defineComponent({
  props: ['id', 'spikes', 'color'],
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
      drawSpikes();
    });
    watch(() => props.color, () => {
      drawSpikes();
    })
    const drawSpikes = () => {
      // 清空画布
      state.ctx?.clearRect(0, 0, state.width, state.height);
      const cx = state.width / 2, cy = state.height / 2, R = Math.min(cx, cy) - 4;
      const r = R / 2;
      const angle = 360 / props.spikes;
      state.ctx?.beginPath();
      for (let i = 0; i < props.spikes; i++) {
        const outerX = cx + R * cos(90 + angle * i);
        const outerY = cy - R * sin(90 + angle * i);
        state.ctx?.lineTo(outerX, outerY);
        const innerX = cx + r * cos((angle / 2) + 90 + angle * i);
        const innerY = cy - r * sin((angle / 2) + 90 + angle * i);
        state.ctx?.lineTo(innerX, innerY);
      }
      const wrapperColor = getComputedStyle(canvasRef.value).backgroundColor;
      const color = props.color ? props.color : invertRGB(wrapperColor);
      state.ctx?.closePath();
      state.ctx!.strokeStyle = color;
      state.ctx!.lineWidth = 1;
      state.ctx?.stroke();
    }
    return () => (
      <canvas ref={ canvasRef } class="spikes-canvas" id={`spikes-${props.spikes}`}></canvas>
    );
  }
  
});