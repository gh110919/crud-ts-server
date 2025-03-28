export const singleton = <T>(
  cache: Map<string, any>,
  data: T,
  table: string
): T => {
  if (!cache.has(table)) {
    cache.set(table, data);
  }

  return cache.get(table);
};
