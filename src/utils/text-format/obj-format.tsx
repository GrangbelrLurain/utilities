/* eslint-disable no-useless-escape */
export const formatObjectLiteral = (value: string): string => {
  try {
    const cleanValue = value.replace(/,(\s*})*$/, '$1');
    let processedValue = cleanValue.replace(/'/g, '"');
    processedValue = processedValue.replace(/(\{|\,)\s*([a-zA-Z0-9_]+)\s*\:/g, '$1"$2":');
    const parsedObj = JSON.parse(processedValue);
    return JSON.stringify(parsedObj, null, 2);
  } catch {
    return value;
  }
};

export const parseObjectRecursive = (value: string) => {
  try {
    const parsedObj = JSON.parse(value);
    Object.keys(parsedObj).forEach((key) => {
      if (typeof parsedObj[key] === 'string') {
        parsedObj[key] = parseObjectRecursive(parsedObj[key]);
      } else if (typeof parsedObj[key] === 'object' && parsedObj[key] !== null) {
        parsedObj[key] = parseObjectRecursive(JSON.stringify(parsedObj[key]));
      }
    });
    return parsedObj;
  } catch {
    return value;
  }
};
