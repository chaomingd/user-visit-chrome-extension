export function groupBy<T = any>(
  arr: T[],
  getKey: (item: T) => string | number
) {
  const map: Record<string, T[]> = {};
  const keys: Array<string | number> = [];
  arr.forEach((item) => {
    const key = getKey(item);
    if (!map[key]) {
      map[key] = [item];
      keys.push(key);
    } else {
      map[key].push(item);
    }
  });
  return {
    keys,
    map,
  };
}
