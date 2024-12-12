export type TUrlToJsonReturn = {
  origin: string;
  pathname: string;
  searchParams?: { [key: string]: string };
} | null;

export const urlToJson = (url: string): TUrlToJsonReturn => {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    const json: TUrlToJsonReturn = {
      origin: urlObj.origin,
      pathname: urlObj.pathname,
    };
    if (params.size > 0) {
      const searchParams: { [key: string]: string } = {};
      params.forEach((value, key) => {
        searchParams[key] = value;
      });
      json.searchParams = searchParams;
    }
    return json;
  } catch {
    return null;
  }
};
