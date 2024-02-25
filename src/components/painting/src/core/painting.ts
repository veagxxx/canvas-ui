import { Canvas, Graphic, Paint, Circle, Ellipse, Polygon, Rect, DrawState } from "../types";
import { createGraphic, drawShape, isPointInShape } from '../shapes';
import { deepClone } from '../utils';
import { getPoint } from '../utils/event';
import { Shape } from '../enums/shape.enum';
import { isPointInCircle } from '../shapes/circle';
import { enlargePolygon, isPointInPolygon } from '../shapes/polygon';
import { enlargeRect, isPointInRect } from '../shapes/rect';
import { isPointInEllipse } from '../shapes/ellipse';
import { LineCanvas } from "./line";
import { DEFAULT_STATE } from "../config/paint.config";
import { mergeOptions } from "../utils/func";
import { initElement } from "./element";
import { drawLineByBrush } from "../shapes/brush";
const paintState: Paint = {
  width: 0, 
  height: 0,
  painting: false,
  fill: false,
  shape: '',
  color: DEFAULT_STATE.color,
  spikes: 0,
  lineSize: DEFAULT_STATE.lineSize,
  startPoint: [-1, -1],
  endPoint: [-1, -1],
  graphic: null
}
export class Painting {
  // 画布属性
  private canvas: Canvas;
  // 放大倍率
  private RATIO: number = 1.1;
  // 图形数组
  private graphics: Graphic[] = [];
  // 图形数组(备份)
  private originGraphics: Graphic[] = [];
  // 绘画回调
  private setShape: ((data: any) => void) | null = null;
  // 绘画参数
  private paint: Paint = mergeOptions({} as any, paintState);
  // 铅笔画布
  private lineCanvas: LineCanvas | null = null;
  // 上次选中图形下标
  private lastHasSelected: number = -1;
  // 已经绘制的图形类型
  private drawShapeTypes: string[] = [];
  // 撤销的图形
  private revokeShapes: (string | Graphic | number)[] = [];
  // 填充过的图形
  private fillIndex: number[] = [];

  constructor (paintingID: string, lineID: string) {
    this.lineCanvas = new LineCanvas(lineID);
    this.canvas = initElement(paintingID);
    this.paint.width = this.canvas.width;
    this.paint.height = this.canvas.height;
    this.mountEvent();
  }
  // 设置绘画状态
  public setDrawState(state: DrawState, callback: (data: any) => void) {
    this.paint = mergeOptions(this.paint, state);
    this.lineCanvas?.setLineState(state);
    if (state.shape) {
      this.canvas.el.style.cursor = 'crosshair';
    }
    this.setShape = callback;
  }
  /**
   * 初始化图形
   * @param graphics 图形数组
   */
  public initGraphics(graphics: Graphic[]): void {
    this.graphics = [...this.graphics, ...graphics];
    this.originGraphics = deepClone(this.graphics)
    this.drawGraphics(graphics);
  }
  /**
   * 绘制图形
   * @param graphics 
   */
  private drawGraphics(graphics: Graphic[]): void {
    this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.lineCanvas?.hasLine) {
      this.canvas.ctx.putImageData(
        this.lineCanvas!.getImageData(), 
        0, 
        0, 
        0, 
        0, 
        this.canvas.width, 
        this.canvas.height
      );
    }
    for (const graphic of graphics) {
      if (drawShape(this.canvas.ctx, graphic)[graphic.shape]) {
        drawShape(this.canvas.ctx, graphic)[graphic.shape]();
      }
    }
  }
  private setRatio(selected: boolean): number {
    return selected ? this.RATIO : 1;
  }
  /**
   * 选中图形
   * @param event 
   * @param canvas 
   */
  private selectGraphic(event: MouseEvent, canvas: HTMLCanvasElement, click?: boolean) {
    // 获取鼠标点坐标
    const point = getPoint(canvas, event);
    // 选中任意图形下标
    let anyGraphicSelected = -1;
    // 选中图形后，移入重叠部分，不选中重叠部分的另一个图形
    const selectedShapeIndex = this.graphics.findIndex((item) => item.selected);
    if (selectedShapeIndex !== -1 && isPointInShape(point, this.graphics[selectedShapeIndex])) {
      if (click) {
        this.drawShapeTypes.push('fill');
        this.fillIndex.push(selectedShapeIndex);
        this.graphics[selectedShapeIndex].fill = true;
        this.graphics[selectedShapeIndex].color = this.paint.color;
        this.drawGraphics(this.graphics);
      }
      return;
    }
    // 遍历所有图形 
    this.graphics.forEach((graphic: Graphic, index: number) => {
      const originGraphic = this.originGraphics[index];
      switch(graphic.shape) {
        case Shape.Rect: {
          graphic.selected = isPointInRect(
            point, 
            [graphic.x, graphic.y], 
            graphic.width, 
            graphic.height
          );
          const ratio = this.setRatio(!this.paint.fill && graphic.selected);
          enlargeRect(ratio, graphic, (<Rect>originGraphic));
        }
          break;
        case Shape.Circle: {
          graphic.selected = isPointInCircle(
            point, 
            [graphic.x, graphic.y], 
            graphic.radius
          );
          const ratio = this.setRatio(this.paint.fill ? false : graphic.selected);
          graphic.radius = (<Circle>originGraphic).radius * ratio;
        }
          break;
        case Shape.Polygon: {
          graphic.selected = isPointInPolygon(point, graphic.points);
          graphic.points = graphic.selected && !this.paint.fill
            ? enlargePolygon(this.RATIO, (<Polygon>originGraphic).points) 
            : (<Polygon>originGraphic).points;
        }
          break;
        case Shape.Ellipse: {
          graphic.selected = isPointInEllipse(
            point, 
            graphic.x, 
            graphic.y, 
            graphic.rx, 
            graphic.ry
          );
          const ratio = this.setRatio(this.paint.fill ? false : graphic.selected);
          graphic.rx = (<Ellipse>originGraphic).rx * ratio;
          graphic.ry = (<Ellipse>originGraphic).ry * ratio;
        }
          break;
        default:
          graphic.selected = false;
          break;
      }
      if (graphic.selected) {
        anyGraphicSelected = index;
      }
      this.canvas.el.style.cursor = anyGraphicSelected !== -1 ? 'pointer' : 'default';
    });
    // 优化鼠标每次移动都会重绘，只有上次选中状态和当前选中状态不一致才重绘
    if (this.lastHasSelected !== anyGraphicSelected) {
      this.lastHasSelected = anyGraphicSelected;
      this.drawGraphics(this.graphics);
    }
  }
  // 移动
  private onMouseMove(event: MouseEvent) {
    if (this.paint.shape) {
      this.drawShapeByMoving(event, this.canvas.el);
    } else {
      this.selectGraphic(event, this.canvas.el);
    }
  }
  // 左键按下-开始绘画
  private onMouseDown(event: MouseEvent) {
    // 没有选中图形或者右键情况
    if (this.isNotShape(event)) return;
    this.paint.painting = true;
    this.paint.startPoint = getPoint(this.canvas.el, event);
    if (this.paint.shape === Shape.BRUSH) {
      this.lineCanvas?.onMouseDown(event);
    }
    if (!this.drawShapeTypes.length) {
      this.fillIndex = [];
      this.revokeShapes = [];
    }
    this.drawShapeTypes.push(this.paint.shape);
  }
  // 绘图(图形)
  private drawShapeByMoving(event: MouseEvent, canvas: HTMLCanvasElement) {
    if (!this.paint.painting) return;
    // 画笔画线
    if (this.paint.shape === Shape.BRUSH) {
      this.lineCanvas?.onMouseMove(event);
      this.drawLineByBrush(event);
      return;
    }
    // 橡皮擦
    if (this.paint.shape === Shape.Eraser) {
      // TODO:
      return;
    }
    // 画图形
    this.paint.endPoint = getPoint(canvas, event);
    const graphic = createGraphic(this.paint) as Graphic;
    graphic.lineSize = this.paint.lineSize;
    graphic.color = this.paint.color;
    if (this.paint.graphic) {
      this.graphics.pop();
      this.originGraphics.pop();
    } 
    this.paint.graphic = graphic;
    this.graphics.push(graphic);
    this.originGraphics.push({ ...graphic });
    this.drawGraphics(this.graphics);
  }
  // 画笔绘图
  private drawLineByBrush(event: MouseEvent): void {
    const point = getPoint(this.canvas.el, event);
    const { lineColor: color, lineWidth } = this.lineCanvas!.line;
    const [sx, sy] = this.paint.startPoint;
    drawLineByBrush(this.canvas.ctx, [sx, sy], point, { color, lineWidth });
    this.paint.startPoint = point;
  }
  // 左键松开-停止绘画
  private onMouseUp(event: MouseEvent) {
    if (event.button === 2) return;
    this.paint.painting = false;
    this.paint.graphic = null;
    this.lineCanvas?.onMouseUp();
    this.doCallback();
  }
  // 右键-清除绘画状态
  private onContextmenu(event: MouseEvent) {
    event.preventDefault();
    this.paint = mergeOptions(this.paint, paintState);
    this.doCallback();
  }
  // 点击图形
  private onClickShape(event: MouseEvent): void {
    if (!this.paint.fill) return;
    this.selectGraphic(event, this.canvas.el, true);
  }
  private isNotShape(event: MouseEvent): boolean {
    return !this.paint.shape || event.button === 2 || event.type !== 'mousedown';
  }

  // 撤销
  public doRevoke() {
    if (!this.drawShapeTypes.length) return; 
    const type = this.drawShapeTypes.pop();
    // 画线撤销
    if (type === Shape.BRUSH) {
      this.lineCanvas?.doRevoke();
      this.revokeShapes.push(Shape.BRUSH);
    } else if (type === 'fill') {
      // 填充撤销
      const fillIndex = this.fillIndex.pop();
      if (fillIndex !== undefined) {
        this.graphics[fillIndex].fill = false;
        this.revokeShapes.push(fillIndex);
      }
    } else {
      // 图形撤销
      this.originGraphics.pop();
      const lastShape = this.graphics.pop();
      lastShape && this.revokeShapes.push(lastShape);
    }
    this.lineCanvas!.hasLine = this.drawShapeTypes.some(
      (type: string) => type === Shape.BRUSH
    );
    this.drawGraphics(this.graphics);
  }
  
  // 能否撤销
  public canRevoke(): boolean {
    return !!this.drawShapeTypes.length;
  }
  
  public doNext() {
    if (!this.revokeShapes.length) return;
    const graphic = this.revokeShapes.pop();
    if (graphic !== undefined) {
      // 画线
      if (typeof graphic === 'string') {
        this.lineCanvas?.doNext();
        this.drawShapeTypes.push(graphic);
      } else if (typeof graphic === 'number') {
        // 填充
        this.graphics[graphic].fill = true;
        this.drawShapeTypes.push('fill');
        this.fillIndex.push(graphic);
      } else {
        // 图形
        this.drawShapeTypes.push(graphic.shape);
        this.graphics.push(graphic);
        this.originGraphics.push(graphic);
      }
    }
    this.lineCanvas!.hasLine = this.drawShapeTypes.some(
      (type: string) => type === Shape.BRUSH
    );
    this.drawGraphics(this.graphics);
  }

  public canNext(): boolean {
    return !!this.revokeShapes.length;
  }

  // 回调重置状态
  private doCallback() {
    this.setShape && 
      this.setShape({
        shape: this.paint.shape,
        lineSize: this.paint.lineSize,
        fill: this.paint.fill,
        spikes: this.paint.spikes
      });
  }

  // 橡皮擦功能
  private useEraser() {
    // TODO:
  }

  public getShapeData() {
    const graphics = this.graphics;
    return [...graphics, { shape: 'brush', data: this.canvas.el.toDataURL() }];
  }

  // 挂载事件
  private mountEvent() {
    const el = this.canvas.el;
    el.addEventListener('contextmenu', this.onContextmenu.bind(this));
    el.addEventListener('mousemove', this.onMouseMove.bind(this));
    el.addEventListener('mousedown', this.onMouseDown.bind(this));
    el.addEventListener('mouseup', this.onMouseUp.bind(this));
    el.addEventListener('click', this.onClickShape.bind(this));
  }
  public destroy() {
    const el = this.canvas.el;
    el.removeEventListener('contextmenu', this.onContextmenu.bind(this));
    el.removeEventListener('mousemove', this.onMouseMove.bind(this));
    el.removeEventListener('mousedown', this.onMouseDown.bind(this));
    el.removeEventListener('mouseup', this.onMouseUp.bind(this));
    el.removeEventListener('click', this.onClickShape.bind(this));
  }
}

