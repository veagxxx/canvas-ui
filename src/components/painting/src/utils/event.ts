import { Point } from "../types/shape";

export const getPoint = (el: HTMLElement, event: MouseEvent): Point => {
  const { left, top }  = el.getBoundingClientRect()
  const mouseX = event.clientX - left;
  const mouseY = event.clientY - top; 
  return [mouseX, mouseY];
}

export const mountEvent = (el: HTMLElement, event: string, callback: any) => {
  el.addEventListener(event, callback);
}