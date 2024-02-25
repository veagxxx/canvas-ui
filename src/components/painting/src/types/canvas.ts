import { Graphic } from "./shape";

export interface Canvas {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export interface Paint {
  width: number;
  height: number;
  shape: string;
  lineSize: number;
  painting: boolean;
  spikes: number;
  fill: boolean;
  color: string;
  startPoint: number[];
  endPoint: number[];
  graphic: Graphic | null
}

export interface DrawState {
  shape: string;
  lineSize: number;
  fill: boolean;
  color: string;
  spikes: number;
}