type TURLObj = {
  [key: string]: string | TURLObj | undefined;
};

export type TUrlToJsonReturn = TURLObj | null;

export const urlToJson = (url: string): TUrlToJsonReturn => {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    const json: TUrlToJsonReturn = {
      host: urlObj.host,
      hostname: urlObj.hostname,
      href: urlObj.href,
      origin: urlObj.origin,
      pathname: urlObj.pathname,
      hash: urlObj.hash,
      protocol: urlObj.protocol,
      username: urlObj.username,
      password: urlObj.password,
      port: urlObj.port,
    };
    if (params.size > 0) {
      const searchParams: { [key: string]: string } = {};
      params.forEach((value, key) => {
        searchParams[key] = value;
      });
      json.params = searchParams;
    }
    return json;
  } catch {
    return null;
  }
};

export const urlToString = (url: string): string => {
  try {
    return decodeURIComponent(url);
  } catch {
    return '유효하지 않은 URL입니다.';
  }
};
