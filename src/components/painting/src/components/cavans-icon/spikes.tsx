import { defineComponent, onMounted, reactive, watch } from 'vue';
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
    onMounted(() => {
      const canvas = document.getElementById(`spikes-${props.spikes}`) as HTMLCanvasElement;
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
      const cos = (angle: number) => Math.cos((Math.PI / 180) * angle)
      const sin = (angle: number) => Math.sin((Math.PI / 180) * angle)
      state.ctx?.beginPath();
      for (let i = 0; i < props.spikes; i++) {
        const outerX = cx + R * cos(90 + angle * i);
        const outerY = cy - R * sin(90 + angle * i);
        state.ctx?.lineTo(outerX, outerY);
        const innerX = cx + r * cos((angle / 2) + 90 + angle * i);
        const innerY = cy - r * sin((angle / 2) + 90 + angle * i);
        state.ctx?.lineTo(innerX, innerY);
      }
      state.ctx?.closePath();
      state.ctx!.strokeStyle = props.color || '#000000';
      state.ctx!.lineWidth = 1;
      state.ctx?.stroke();
    }
    return () => (
      <canvas id={`spikes-${props.spikes}`}></canvas>
    );
  }
  
});