export const objectToPropsString = (object: Record<string, unknown>): string =>
  Object.keys(object)
    .map((key): string => `${key}: ${object[key]}`)
    .join(', ');

export const mapToFullUrl = (
  path: string,
  origin?: string,
  query?: Record<string, unknown>,
): string => {
  const url = new URL(path, origin ?? '');

  if (query) {
    Object.entries(query).forEach(({ 0: key, 1: value }): void =>
      url.searchParams.append(key, value?.toString() as string),
    );
  }

  return url.href;
};
