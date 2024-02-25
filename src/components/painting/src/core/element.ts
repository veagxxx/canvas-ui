import { DPR } from '../config/paint.config';

export const initElement = (elID: string) => {
  const canvas = <HTMLCanvasElement>document.getElementById(elID);
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d', { willReadFrequently: true });
  const wrapper = <HTMLElement>canvas.parentElement;
  const width = wrapper.offsetWidth, height = wrapper.offsetHeight;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * DPR;
  canvas.height = height * DPR;
  ctx.scale(DPR, DPR);
  return { el: canvas, width, height, ctx };
}