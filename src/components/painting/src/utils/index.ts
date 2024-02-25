export const deepClone = (obj: any) => {
  if (!obj && typeof obj !== 'object') {
    return;
  }
  const cloneObj: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      cloneObj[key] = deepClone(obj[key]);
    } else {
      cloneObj[key] = obj[key];
    }
  }
  return cloneObj;
}