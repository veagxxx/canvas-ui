import { Graphic, Paint } from './../types/index';
import { Point, Polygon } from "../types";
import { drawStyle } from './style';
import { Shape } from '../enums/shape.enum';
import { cos, sin } from '../utils/func';

/**
 * 绘制多边形
 * @param ctx 
 * @param polygon 
 */
export const drawPolygon = (ctx: CanvasRenderingContext2D, polygon: Polygon) => {
  ctx.save();
  if (polygon.scale && polygon.transition) {
    ctx.translate(polygon.transition[0], polygon.transition[1]);
    ctx.scale(polygon.scale[0], polygon.scale[1]);
  }
  ctx.beginPath();
  for (let i = 0; i < polygon.points.length; i++) {
    const point = polygon.points[i];
    if (i === 0) {
      ctx.moveTo(...point);
    } else {
      ctx.lineTo(...point);
    }
  }
  ctx.closePath();
  drawStyle(ctx, polygon);
  ctx.restore();
}

/**
 * 射线法：判断点是否在多边形内
 * @param point 点
 * @param polygon 多边形二维点数组
 * @returns 
 */
export const isPointInPolygon = (point: Point, polygon: Array<Point>): boolean => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * 放大多边形
 * 计算多边形中心点，每个x坐标点左/右移，y坐标上/下移
 * @param ratio 放大倍率
 * @param polygon 多边形二维点数组
 * @returns 
 */
export const enlargePolygon = (ratio: number, polygon: Array<Point>): Array<Point> => {
  const cx = polygon.reduce((sum, point: Point) => sum + point[0], 0) / polygon.length;
  const cy = polygon.reduce((sum, point: Point) => sum + point[1], 0) / polygon.length;
  const newPolygon = polygon.map(point => {
    return [
      cx + (point[0] - cx) * ratio,
      cy + (point[1] - cy) * ratio
    ];
  }) as Point[];
  return newPolygon;
}

/**
 * 创建多边形
 * @param paint 
 */
export const createPolygon = (paint: Paint) => {
  const [sx, sy] = paint.startPoint, [ex, ey] = paint.endPoint;
  // 中心点坐标
  const cx = sx + (ex - sx) / 2, cy = sy + (ey - sy) / 2;
  // 移动 x 轴和 y 轴距离
  const dx = Math.abs(ex - sx), dy = Math.abs(ey - sy);
  const radius = Math.max(dx / 2, dy / 2);
  const points = getPolygonPoints(cx, cy, paint.spikes, radius);
  return { shape: Shape.Polygon, points: points };
}

const getPolygonPoints = (cx: number, cy: number, size: number, radius: number) => {
  const points: Point[] = [];
  // 内角和 = (n - 2) * 180;
  const interiorAngle = (size - 2) * 180;
  // 每个内角 = 内角和 / 边数
  const angle = interiorAngle / size;
  points.push([cx, cy - radius]);
  for (let i = 1; i < size; i++) {
    const x = cx + radius * sin((180 - angle) * i);
    const y = cy - radius * cos((180 - angle) * i);
    points.push([x, y]);
  }
  return points;
}

/**
 * 创建角星
 * @param paint 
 * @returns 
 */
export const createSpikes = (paint: Paint): Graphic => {
  const [sx, sy] = paint.startPoint, [ex, ey] = paint.endPoint; 
  const dx = Math.abs(ex - sx), dy = Math.abs(ey - sy);
  const cx = sx + (ex - sx) / 2, cy = sy + (ey - sy) / 2;
  const radius = Math.max(dx / 2, dy / 2);
  const points = getSpikesPoints(cx, cy, paint.spikes, radius);
  return { shape: Shape.Polygon, points };
}

/**
 * 获取角星坐标点
 * @param cx 
 * @param cy 
 * @param spikes 
 * @param R 
 * @returns 
 */
const getSpikesPoints = (cx: number, cy: number, spikes: number, R: number) => {
  const points: Point[] = [];
  const r = R / 2;
  const angle = 360 / spikes;
  for (let i = 0; i < spikes; i++) {
    const outerX = cx + R * cos(90 + angle * i);
    const outerY = cy - R * sin(90 + angle * i);
    points.push([outerX, outerY]);
    const innerX = cx + r * cos((angle / 2) + 90 + angle * i);
    const innerY = cy - r * sin((angle / 2) + 90 + angle * i);
    points.push([innerX, innerY]);
  }
  return points;
}