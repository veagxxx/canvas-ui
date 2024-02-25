import { DPR } from "../config/paint.config";
import { drawLineByBrush } from "../shapes/brush";
import { Canvas, DrawState } from "../types";
import { getPoint } from "../utils/event";
import { initElement } from "./element";
interface Line {
  startX: number;
  startY: number;
  lineWidth: number;
  lineCap: 'round' | 'butt' | 'square';
  lineColor: string;
}
const line = {
  startX: 0,
  startY: 0,
  lineWidth: 1,
  lineCap: 'round' as 'round',
  lineColor: '#000000'
}
export class LineCanvas {
  // 设备分辨比
  private readonly dpr: number = devicePixelRatio;
  // 画布属性
  public canvas: Canvas;
  // 
  public line: Line = line;
  // 是否绘制过线条
  public hasLine: boolean = false;

  private lining: boolean = false;

  private isLine: boolean = false;

  public canvasStates: any[] = [];

  private revokeStates: any[] = [];

  constructor (lineID: string) {
    this.canvas = initElement(lineID);
  }
  public setLineState(state: DrawState) {
    this.line.lineColor = state.color;
    this.line.lineWidth = state.lineSize;
    this.isLine = state.shape === 'brush';
  }
  public onMouseDown(event: MouseEvent) {
    if (!this.isLine || event.button === 2) return;
    const [x, y] = getPoint(this.canvas.el, event);
    this.line.startX = x;
    this.line.startY = y;
    this.lining = true;
    this.canvasStates.push(this.getImageData());
  }
  public onMouseMove(event: MouseEvent) {
    if (!this.lining) return;
    const [x, y] = getPoint(this.canvas.el, event);
    const sx = this.line.startX;
    const sy = this.line.startY;
    const { lineColor: color, lineWidth } = this.line;
    drawLineByBrush(this.canvas.ctx, [sx, sy], [x, y], { color, lineWidth });
    this.line.startX = x;
    this.line.startY = y;
    this.hasLine = true;
  }

  public onMouseUp() {
    this.lining = false;
  }

  public doRevoke() {
    if (!this.canvasStates.length) return;
    this.revokeImageData();
  }

  public doNext() {
    if (!this.revokeStates.length) return;
    this.nextImageData();
  }

  public revokeImageData() {
    this.revokeStates.push(this.getImageData());
    this.canvas.ctx.putImageData(this.canvasStates.pop(), 0, 0);
  }

  public nextImageData() {
    this.canvasStates.push(this.getImageData());
    this.canvas.ctx.putImageData(this.revokeStates.pop(), 0, 0);
  }

  public getImageData() {
    return this.canvas.ctx.getImageData(0, 0, this.canvas.width * DPR, this.canvas.height * DPR);
  }

}

