export const compareTwiceObj = (obj1: object, obj2: object, path: string[] = []) => {
  const diffs: string[] = [];
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  allKeys.forEach((key) => {
    const value1 = obj1[key as keyof typeof obj1];
    const value2 = obj2[key as keyof typeof obj2];
    const currentPath = [...path, key];

    // 둘 다 객체인 경우 재귀적으로 비교
    if (
      typeof value1 === 'object' &&
      value1 !== null &&
      typeof value2 === 'object' &&
      value2 !== null
    ) {
      compareTwiceObj(value1, value2, currentPath);
    }
    // 값이 다른 경우
    else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
      const pathStr = currentPath.join('.');
      diffs.push(
        `{"${pathStr}": {"value1": ${JSON.stringify(value1)}, "value2": ${JSON.stringify(value2)}}}`,
      );
    }
  });

  return diffs;
};

export const compareObjKey = (
  obj: object,
  targetKey: string,
  keyFormater?: (key: string) => string,
) => {
  if (typeof obj !== 'object' || obj === null) return [];

  const matchingKeys = new Set<string>();

  Object.keys(obj).forEach((key) => {
    // 현재 key의 case 확인

    const formattedKey = keyFormater ? keyFormater(key) : key;
    if (formattedKey === targetKey) {
      matchingKeys.add(key);
    }

    // 값이 객체인 경우 재귀적으로 검사
    if (typeof obj[key as keyof typeof obj] === 'object' && obj[key as keyof typeof obj] !== null) {
      compareObjKey(obj[key as keyof typeof obj], targetKey);
    }
  });

  return Array.from(matchingKeys);
};
