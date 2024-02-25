import { Point } from "../types";

export const drawLineByBrush = (
  ctx: CanvasRenderingContext2D, 
  startPoint: Point, 
  endPoint: Point,
  { color, lineWidth }: { color: string, lineWidth: number}, 
) => {
  const [sx, sy] = startPoint;
  const [x, y] = endPoint;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.bezierCurveTo(sx, sy, x, y, x, y);
  ctx.stroke();
  ctx.closePath();
}