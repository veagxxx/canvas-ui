import { Ellipse, Paint, Point } from "../types";
import { Shape } from '../enums/shape.enum';
import { drawStyle } from "./style";

export const drawEllipse = (ctx: CanvasRenderingContext2D, ellipse: Ellipse) => {
  ctx.beginPath();
  ctx.ellipse(ellipse.x, ellipse.y, ellipse.rx, ellipse.ry, 0, 0, Math.PI * 2);
  drawStyle(ctx, ellipse);
}

/**
 * 判断点是否在椭圆内：椭圆方程 (x - x1)² / a² + (y - y1)² / b² = 1，a为x半轴，b为y半轴
 * @param point 点坐标
 * @param x 椭圆圆心 x 坐标
 * @param y 椭圆圆心 y 坐标
 * @param rx x 半轴
 * @param ry y 半轴
 */
export const isPointInEllipse = (point: Point, x: number, y: number, rx: number, ry: number) => {
  const [px, py] = point;
  return ((x - px) ** 2) / (rx ** 2) + ((y - py) ** 2) / (ry ** 2) <= 1;
}

export const createEllipse = (paint: Paint) => {
  const [sx, sy] = paint.startPoint, 
        [ex, ey] = paint.endPoint;
  const rx = Math.abs((ex - sx) / 2);
  const ry = Math.abs((ey - sy) / 2);
  const x = Math.min(sx, ex) + rx;
  const y = Math.min(sy, ey) + ry;
  return { shape: Shape.Ellipse, x, y, rx, ry };
}