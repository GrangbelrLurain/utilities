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

export interface JSONStructure {
  key: string;
  depth: number;
  value?: string;
  type?: string;
  children?: JSONStructure[];
}

// 상수로 구분자 정의
const KEY_SEPARATOR = 'CELL_SEPARATOR';

const KEY_ARRAY = '/*array*/';

export const parseJSONToStructureRecursive = (
  structureValue: unknown,
  parentKey = '',
  seenMap = new Map<string, JSONStructure>(),
): JSONStructure[] => {
  if (typeof structureValue === 'object' && structureValue !== null) {
    if (Array.isArray(structureValue)) {
      return setArrayStructure(structureValue as unknown[], parentKey, seenMap);
    }
    return setObjectStructure(structureValue as Record<string, unknown>, parentKey, seenMap);
  }

  return [];
};

const arrayToString = (array: unknown[]): string => {
  return `[${array
    .map((item) => {
      if (Array.isArray(item)) {
        return arrayToString(item);
      }
      if (item && typeof item === 'object') {
        return '[Object object]';
      }
      return formatPrimitiveValue(item);
    })
    .join(', ')}]`;
};

const setArrayStructure = (
  array: unknown[],
  parentKey: string,
  seenMap: Map<string, JSONStructure>,
): JSONStructure[] => {
  const currentKey = parentKey ? `${parentKey}${KEY_SEPARATOR}${KEY_ARRAY}` : KEY_ARRAY;
  if (seenMap.has(currentKey)) {
    return handleExistingKey(currentKey, array, seenMap);
  }

  const structure = createStructure(KEY_ARRAY, array, parentKey);
  seenMap.set(currentKey, structure);
  structure.children = structure.children || [];

  array.forEach((value) => {
    if (value && typeof value === 'object') {
      const childResults = parseJSONToStructureRecursive(value, currentKey, seenMap);
      structure.children!.push(...(childResults || []));
    }
  });

  return [structure];
};

const setObjectStructure = (
  obj: Record<string, unknown>,
  parentKey: string,
  seenMap: Map<string, JSONStructure>,
): JSONStructure[] => {
  const isParentArray = Array.isArray(obj);

  return Object.entries(obj).flatMap(([key, value]) => {
    let currentKey = parentKey ? `${parentKey}${KEY_SEPARATOR}${key}` : key;
    if (isParentArray) {
      currentKey = `${parentKey}${KEY_SEPARATOR}${KEY_ARRAY}`;
    }

    if (seenMap.has(currentKey)) {
      return handleExistingKey(currentKey, value, seenMap);
    }

    const structure = createStructure(isParentArray ? KEY_ARRAY : key, value, parentKey);
    seenMap.set(currentKey, structure);

    if (value && typeof value === 'object') {
      const childResults = parseJSONToStructureRecursive(value, currentKey, seenMap);
      structure.children = childResults;
    }

    return [structure];
  });
};

const handleExistingKey = (
  currentKey: string,
  value: unknown,
  seenMap: Map<string, JSONStructure>,
): JSONStructure[] => {
  const structure = seenMap.get(currentKey);
  if (structure) {
    const lastValue = structure.value;
    if (typeof value === 'object') {
      structure.children = structure.children || [];
      structure.children.push(...parseJSONToStructureRecursive(value, currentKey, seenMap));
    } else if ((!lastValue && typeof lastValue === 'object') || lastValue === undefined) {
      structure.value = lastValue
        ? lastValue + `, ${formatPrimitiveValue(value)}`
        : formatPrimitiveValue(value);
    }
    if (!structure.type?.includes(switchType(value))) {
      structure.type = structure.type + `, ${switchType(value)}`;
      structure.value = lastValue
        ? lastValue + `, ${formatPrimitiveValue(value)}`
        : formatPrimitiveValue(value);
    }
  }

  return [];
};

const createStructure = (key: string, value: unknown, parentKey: string): JSONStructure => {
  const structure: JSONStructure = {
    key,
    depth: parentKey ? parentKey.split(KEY_SEPARATOR).length : 0,
  };

  setStructureType(structure, value);
  setStructureValue(structure, value);

  return structure;
};

const switchType = (value: unknown): string => {
  if (value === undefined) {
    return '';
  }
  if (!value && typeof value === 'object') {
    return 'null';
  }
  if (Array.isArray(value)) {
    const types = value.reduce((acc, item) => {
      if (acc.includes(switchType(item))) {
        return acc;
      }
      acc.push(switchType(item));
      return acc;
    }, []);
    return 'Array<' + (types.length ? types.join(' | ') : 'unknown') + '>';
  }
  if (typeof value === 'object') {
    return 'object';
  }
  return typeof value;
};

const setStructureType = (structure: JSONStructure, value: unknown): void => {
  structure.type = switchType(value);
};

const setStructureValue = (structure: JSONStructure, value: unknown): void => {
  if (
    Array.isArray(value) &&
    value.some((item) => typeof item !== 'object' || Array.isArray(item))
  ) {
    structure.value = `[${value
      .map((item) => {
        if (typeof item === 'object' && Array.isArray(item)) {
          return arrayToString(item);
        }
        if (typeof item !== 'object') {
          return formatPrimitiveValue(item);
        }
        return item.toString();
      })
      .join(', ')}]`;
  } else if (value === null) {
    structure.value = 'null';
  } else if (typeof value !== 'object') {
    structure.value = formatPrimitiveValue(value);
  }
};

const formatPrimitiveValue = (value: unknown): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
};

export const structureToRows = (structure: JSONStructure[]): string[][] => {
  const rows: string[][] = [];
  const values: (string | undefined)[] = []; // value들을 따로 저장
  const types: (string | undefined)[] = []; // type들을 따로 저장
  function processStructure(items: JSONStructure[]) {
    items.forEach((item) => {
      // depth만큼 빈 셀을 만들되, 마지막에 현재 키를 추가
      const row = new Array(item.depth).fill('').concat(item.key);
      rows.push(row);
      values.push(item.value !== undefined ? String(item.value) : undefined);
      types.push(item.type !== undefined ? String(item.type) : undefined);

      if (item.children) {
        processStructure(item.children);
      }
    });
  }

  processStructure(structure);

  const maxLength = Math.max(...rows.map((row) => row.length));
  rows.forEach((row) => {
    while (row.length < maxLength) {
      row.push('');
    }
  });

  rows.forEach((row, index) => {
    row.push(values[index] || '');
    row.push(types[index] || '');
  });

  return rows;
};
