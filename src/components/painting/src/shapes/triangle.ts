import { Paint } from "../types";
import { Shape } from '../enums/shape.enum';

export const createTriangle = (paint: Paint) => {
  const [sx, sy] = paint.startPoint,
        [ex, ey] = paint.endPoint;
  const topX  = sx + (ex - sx) / 2, 
        topY = sy, 
        leftX = sx, leftY = ey, 
        rightX = ex, rightY = ey;
  const points = [[topX, topY], [leftX, leftY], [rightX, rightY]];
  return { shape: Shape.Polygon, points };
}

export const createRightTriangle = (paint: Paint) => {
  const [sx, sy] = paint.startPoint, 
        [ex, ey] = paint.endPoint;
  const topX = sx, topY = sy, leftX = sx, leftY = ey, rightX = ex, rightY = ey;
  return { shape: Shape.Polygon, points: [[topX, topY], [leftX, leftY], [rightX, rightY]] };
}

export const createLeftTriangle = (paint: Paint) => {
  const [sx, sy] = paint.startPoint, 
        [ex, ey] = paint.endPoint;
  const topX = ex, topY = sy, leftX = sx, leftY = ey, rightX = ex, rightY = ey;
  return { shape: Shape.Polygon, points: [[topX, topY], [leftX, leftY], [rightX, rightY]] };
}