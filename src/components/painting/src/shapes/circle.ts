import { Circle, Paint, Point } from "../types";
import { Shape } from "../enums/shape.enum";
import { drawStyle } from "./style";

export const drawCircle = (ctx: CanvasRenderingContext2D, circle: Circle) => {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  drawStyle(ctx, circle);
}

/**
 * 判断点是否在圆内
 * @param point 点坐标
 * @param center 圆心坐标
 * @param radius 圆半径
 * @returns 圆内return true 否则 return false
 */
export const isPointInCircle = (
  point: [number, number], center: [number, number], radius: number
): boolean => {
  const [x1, y1] = point, 
        [x2, y2] = center;
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) <= radius * radius;
}

export const createCircle = (paint: Paint) => {
  const [x1, y1] = paint.startPoint;
  const [x2, y2] = paint.endPoint;
  const x = x1 + (x2 - x1) / 2;
  const y = y1 + (y2 - y1) / 2;
  const radius = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 2;
  return { shape: Shape.Circle, x, y, radius };
}