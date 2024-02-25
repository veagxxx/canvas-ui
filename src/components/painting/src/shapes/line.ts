import { Shape } from "../enums/shape.enum";
import { Line, Paint } from "../types";
import { drawStyle } from "./style";

export const drawLine = (ctx: CanvasRenderingContext2D, line: Line) => {
  ctx.beginPath();
  ctx.moveTo(line.x, line.y);
  ctx.lineTo(line.ex, line.ey);
  drawStyle(ctx, line);
}

export const createLine = (paint: Paint) => {
  const [x, y] = paint.startPoint, [ex, ey] = paint.endPoint;
  return { x, y, ex, ey, shape: Shape.Line };
}