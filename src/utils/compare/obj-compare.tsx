export const compareTwiceObjRecursive = (obj1: object, obj2: object, path: string[] = []) => {
  const diffs: string[] = [];
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  allKeys.forEach((key) => {
    let value1: unknown = obj1[key as keyof typeof obj1];
    let value2: unknown = obj2[key as keyof typeof obj2];
    const currentPath = [...path, key];

    // 한쪽이 undefined인 경우를 먼저 처리
    if (!value1 || !value2) {
      const pathStr = currentPath.join('.');
      diffs.push(
        `{"${pathStr}": {"A": ${value1 ? JSON.stringify(value1) : 'null'}, "B": ${
          value2 ? JSON.stringify(value2) : 'null'
        }}}`,
      );
      return; // 현재 키에 대한 처리를 여기서 종료
    }

    // 배열을 객체로 변환하여 비교
    if (Array.isArray(value1) || Array.isArray(value2)) {
      const arrayToObj = (arr: object[] | null) => {
        if (!arr) return {};
        return arr.reduce((obj: { [key: string]: object }, item, index) => {
          obj[index] = item;
          return obj;
        }, {});
      };

      value1 = Array.isArray(value1) ? arrayToObj(value1) : value1;
      value2 = Array.isArray(value2) ? arrayToObj(value2) : value2;
    }

    // 둘 다 객체인 경우 재귀적으로 비교
    if (
      typeof value1 === 'object' &&
      value1 !== null &&
      typeof value2 === 'object' &&
      value2 !== null
    ) {
      diffs.push(...compareTwiceObjRecursive(value1, value2, currentPath));
    }
    // 값이 다른 경우
    else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
      const pathStr = currentPath.join('.');
      diffs.push(
        `{"${pathStr}": {"A": ${JSON.stringify(value1)}, "B": ${JSON.stringify(value2)}}}`,
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
