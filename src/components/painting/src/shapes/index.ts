import { Shape } from './../enums/shape.enum';
import { Circle, Ellipse, Graphic, Line, Paint, Point, Polygon, Rect } from "../types"
import { createCircle, drawCircle, isPointInCircle } from "./circle"
import { createEllipse, drawEllipse, isPointInEllipse } from "./ellipse"
import { createPolygon, createSpikes, drawPolygon, isPointInPolygon } from "./polygon"
import { createRect, drawRect, isPointInRect } from "./rect"
import { createLeftTriangle, createRightTriangle, createTriangle } from './triangle';
import { createLine, drawLine } from './line';

export const drawShape = (ctx: CanvasRenderingContext2D, graphic: Graphic) => {
  return {
    [Shape.Circle]: () => drawCircle(ctx, <Circle>graphic),
    [Shape.Rect]: () => drawRect(ctx, <Rect>graphic),
    [Shape.Polygon]: () => drawPolygon(ctx, <Polygon>graphic),
    [Shape.Ellipse]: () => drawEllipse(ctx, <Ellipse>graphic),
    [Shape.Line]: () => drawLine(ctx, <Line>graphic),
  }
}
export const drawCurve = (
  ctx: CanvasRenderingContext2D, 
  sx: number, 
  sy: number, 
  ctrlx1: number, 
  ctrly1: number, 
  ctrlx2: number, 
  ctrly2: number,
  ex: number, 
  ey: number,
  lineWidth?: number,
  style?: string,
) => {
  ctx.moveTo(sx, sy);
  ctx.lineWidth = lineWidth || 1;
  ctx.strokeStyle = style || '#000000';
  ctx.bezierCurveTo(ctrlx1, ctrly1, ctrlx2, ctrly2, ex, ey);
  ctx.stroke();
}
// 创建图形
export const createGraphic = (paint: Paint) => {
  switch (paint.shape) {
    case Shape.Rect:
      return createRect(paint);
    case Shape.Circle:
      return createCircle(paint);
    case Shape.Ellipse:
      return createEllipse(paint);
    case Shape.Triangle:
      return createTriangle(paint);
    case Shape.RightTriangle:
      return createRightTriangle(paint);
    case Shape.LeftTriangle:
      return createLeftTriangle(paint);
    case Shape.Polygon:
      return createPolygon(paint);
    case Shape.Line:
      return createLine(paint);
    case Shape.SPIKES:
      return createSpikes(paint);
  }
}

/**
 * 是否选中图形
 * @param point 点坐标
 * @param shape 图形
 * @returns 
 */
export const isPointInShape = (point: Point, shape: Graphic) => {
  const inside = {
    [Shape.Circle]: () => isPointInCircle(
      point, 
      [(<Circle>shape).x, (<Circle>shape).y], 
      (<Circle>shape).radius
    ),
    [Shape.Rect]: () => isPointInRect(
      point, 
      [(<Rect>shape).x, (<Rect>shape).y], 
      (<Rect>shape).width, 
      (<Rect>shape).height
    ),
    [Shape.Polygon]: () => isPointInPolygon(point, (<Polygon>shape).points),
    [Shape.Ellipse]: () => isPointInEllipse(
      point, 
      (<Ellipse>shape).x, 
      (<Ellipse>shape).y, 
      (<Ellipse>shape).rx, 
      (<Ellipse>shape).ry
    ),
    [Shape.Line]: () => false
  }
  if (inside[shape.shape]) {
    return inside[shape.shape]();
  }
  return false;
}