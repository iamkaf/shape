// TODO: implement dimension parsing and validation
export function parseDimensions(
  widthStr: string,
  heightStr: string
): { width: number; height: number } {
  return {
    width: Number.parseInt(widthStr, 10),
    height: Number.parseInt(heightStr, 10),
  };
}
