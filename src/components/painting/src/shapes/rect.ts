import { Shape } from "../enums/shape.enum";
import { Rect, Point, Paint } from "../types";
import { drawStyle } from "./style";

export const drawRect = (ctx: CanvasRenderingContext2D, rect: Rect) => {
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.width, rect.height);
  drawStyle(ctx, rect);
}

/**
 * 判断点是否在矩形内
 * @param point 点坐标
 * @param start 矩形起点坐标
 * @param width 矩形宽
 * @param height 矩形高
 * @returns 
 */
export  const isPointInRect = (
  point: Point, start: Point, width: number, height: number
): boolean => {
  const [x1, y1] = point,
        [x2, y2] = start;
  return (
    x1 >= x2 && x1 <= x2 + width
    && y1 >= y2 && y1 <= y2 + height
  );
}

/**
 * 放大矩形
 * @param ratio 放大倍率
 * @param rect 矩形
 * @param orirect 原始矩形
 */
export const enlargeRect = (ratio: number, rect: Rect, orirect: Rect) => {
  if (rect.selected) {
    rect.x = orirect.x - orirect.width * (ratio - 1) / 2;
    rect.y = orirect.y - orirect.height * (ratio - 1) / 2;
    rect.width = orirect.width * ratio;
    rect.height = orirect.height * ratio;
  } else {
    rect.x = orirect.x;
    rect.y = orirect.y;
    rect.width = orirect.width;
    rect.height = orirect.height;
  }
}

// 创建矩形
export const createRect = (paint: Paint) => {
  const [sx, sy] = paint.startPoint;
  const [ex, ey] = paint.endPoint;
  const x = Math.min(sx, ex);
  const y = Math.min(sy, ey);
  const width = Math.abs(ex - sx);
  const height = Math.abs(ey - sy);
  return { shape: Shape.Rect, x, y, width, height };
}


export const cursorInRect = (point: Point, rect: Rect, orirect: Rect, ratio: number) => {
  rect.selected = isPointInRect(point, [rect.x, rect.y], rect.width, rect.height);
  enlargeRect(ratio, rect, orirect);
}