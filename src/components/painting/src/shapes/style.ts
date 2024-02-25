import { Graphic } from "../types";
import { getThemeColor } from "../utils/func";

export const drawStyle = (ctx: CanvasRenderingContext2D, shape: Graphic) => {
  // const color = shape.selected ? getThemeColor() : (shape.color || '#000000');
  const color = (shape.color || '#000000');
  ctx.lineWidth = 3;
  if (shape.lineSize) {
    ctx.lineWidth = shape.lineSize;
  }
  if (shape.fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}