export type Point = [number, number];

export interface GOption {
  x: number;
  y: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
  selected?: boolean;
  scale?: number[];
  transition?: number[];
  lineSize?: number;
}
export interface Circle extends GOption {
  shape: 'circle';
  radius: number;
}

export interface Rect extends GOption {
  shape: 'rectangle'
  width: number;
  height: number;
}

export interface Polygon extends Omit<GOption, 'x' | 'y'> {
  shape: 'polygon';
  points: Array<[number, number]>;
}

export interface Ellipse extends GOption {
  shape: 'ellipse';
  rx: number;
  ry: number;
}

export interface Line extends GOption {
  shape: 'line';
  ex: number;
  ey: number;
}

export interface SPIKES extends GOption {
  shape: 'spikes';
}

export type Graphic = Circle | Rect | Polygon | Ellipse | Line;