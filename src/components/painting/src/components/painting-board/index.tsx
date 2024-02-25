import { defineComponent } from "vue";
const NAME = 'painting-board'
export default defineComponent({
  name: NAME,
  setup(props, ctx) {
    return () => (
      <>
        <canvas class="shape-canvas" id="shape-canvas"></canvas>
        <canvas class="line-canvas" id="line-canvas"></canvas>
      </>
    )
  },
});