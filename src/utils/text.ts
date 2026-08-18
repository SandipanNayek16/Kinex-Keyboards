// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function replaceBrandName(obj: any): any {
  if (typeof obj === "string") {
    return obj
      .replace(/vapor\s*75/gi, "Mecha 16")
      .replace(/Nimbus\s*Keyboards/gi, "Kinex Keyboards")
      .replace(/Nimbus/gi, "Kinex");
  }
  if (Array.isArray(obj)) {
    return obj.map(replaceBrandName);
  }
  if (obj !== null && typeof obj === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = replaceBrandName(obj[key]);
    }
    return newObj;
  }
  return obj;
}
