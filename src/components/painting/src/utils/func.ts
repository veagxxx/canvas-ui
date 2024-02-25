const _self = this;
export function debounce(func: Function, delay: number = 33.34) {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(_self, args);
    }, delay);
  };
}
// export const debounce = (fn: () => void, wait = 33.34) => {
//   let timmer: ReturnType<typeof setTimeout> | null
//   return () => {
//     timmer && clearTimeout(timmer)
//     timmer = setTimeout(() => {
//       fn()
//     }, wait)
//   }
// }

export function invertRGB(rgb: string): string {
  // Extract the RGB values from the string
  const values = rgb.match(/\d+/g);
  if (!values) {
    throw new Error("Invalid RGB string");
  }

  // Calculate the inverse values
  const invertedValues = values.map((value) => 255 - parseInt(value, 10));

  // Construct the inverted RGB string
  const invertedRGB = `rgb(${invertedValues.join(", ")})`;

  return invertedRGB;
}

export const getThemeColor = () => {
  const rootStyles = window.getComputedStyle(document.documentElement);
  const themeColor = rootStyles.getPropertyValue('--painting-theme');
  return themeColor;
}

/**
 * 合并对象
 * @param target 目标
 * @param source 来源
 * @returns 
 */
export const mergeOptions = <T extends object>(target: T, source: object): T => {
  return Object.assign(target, source);
}

export const sin = (angle: number) => Math.sin((Math.PI / 180) * angle);
export const cos = (angle: number) => Math.cos((Math.PI / 180) * angle);


export const setThemeColor = (color: string) => {
  document.documentElement.style.setProperty('--painting-theme', color);
  document.documentElement.style.setProperty('--shape-selected', color);
}

function convertColorToHex(color: string) {
  // 创建一个用于存储转换后颜色的变量
  let hexColor = '';
  
  // 如果颜色以 '#' 开头，则直接返回
  if (color.startsWith('#')) {
    return color;
  }
  
  // 创建一个用于获取颜色通道值的辅助函数
  const getColorChannelValue = (channel: number) => {
    const hexValue = channel.toString(16);
    return hexValue.length === 1 ? '0' + hexValue : hexValue;
  }
  
  // 创建一个用于解析颜色通道值的辅助函数
  const parseColorChannelValue = (value: string) => {
    return parseInt(value, 16);
  }
  
  // 如果颜色以 'rgb' 或 'rgba' 开头，则解析颜色通道值
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match) {
      const red = parseColorChannelValue(match[0]);
      const green = parseColorChannelValue(match[1]);
      const blue = parseColorChannelValue(match[2]);
      hexColor = `#${getColorChannelValue(red)}${getColorChannelValue(green)}${getColorChannelValue(blue)}`;
    }
  }
  // 返回转换后的颜色
  return hexColor;
}