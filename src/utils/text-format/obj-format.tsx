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

export const parseJSONToStructureRecursive = (
  structureValue: unknown,
  parentKey = '',
  seenMap = new Map<string, JSONStructure>(),
): JSONStructure[] => {
  if (Array.isArray(structureValue)) {
    return handleArrayValue(structureValue, parentKey, seenMap);
  }

  if (typeof structureValue === 'object' && structureValue !== null) {
    return handleObjectValue(structureValue as Record<string, unknown>, parentKey, seenMap);
  }

  return [];
};

const handleArrayValue = (
  array: unknown[],
  parentKey: string,
  seenMap: Map<string, JSONStructure>,
): JSONStructure[] => {
  const arrayKey = parentKey ? `${parentKey}` : '/*array*/';
  const mergedResults = new Map<string, JSONStructure>();

  array.forEach((item) => {
    if (item && typeof item === 'object') {
      const results = parseJSONToStructureRecursive(
        item as Record<string, unknown>,
        arrayKey,
        seenMap,
      );
      results.forEach((result) => {
        mergedResults.set(result.key, result);
      });
    }
  });

  if (!parentKey) {
    const structure = createStructure(arrayKey, array, parentKey);
    structure.children = Array.from(mergedResults.values());
    return [structure];
  }

  return Array.from(mergedResults.values());
};

const handleObjectValue = (
  obj: Record<string, unknown>,
  parentKey: string,
  seenMap: Map<string, JSONStructure>,
): JSONStructure[] => {
  return Object.entries(obj).flatMap(([key, value]) => {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;

    if (seenMap.has(currentKey)) {
      return handleExistingKey(currentKey, value, seenMap);
    }

    const structure = createStructure(key, value, parentKey);
    seenMap.set(currentKey, structure);

    if (value && typeof value === 'object') {
      const childResults = parseJSONToStructureRecursive(
        value as Record<string, unknown>,
        currentKey,
        seenMap,
      );
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
  const existingStructure = seenMap.get(currentKey)!;
  if (value && typeof value === 'object') {
    const newChildren = parseJSONToStructureRecursive(
      value as Record<string, unknown>,
      currentKey,
      seenMap,
    );
    existingStructure.children = existingStructure.children || [];
    newChildren.forEach((child) => {
      existingStructure.children!.push(child);
    });
  }
  return [];
};

const createStructure = (key: string, value: unknown, parentKey: string): JSONStructure => {
  const structure: JSONStructure = {
    key,
    depth: parentKey ? parentKey.split('.').length : 0,
  };

  setStructureType(structure, value);
  setStructureValue(structure, value);

  return structure;
};

const setStructureType = (structure: JSONStructure, value: unknown): void => {
  if (!(typeof value === 'object' && value === null) && !(typeof value === 'undefined')) {
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        structure.type = 'array';
      }
    } else {
      structure.type = typeof value;
    }
  }
};

const setStructureValue = (structure: JSONStructure, value: unknown): void => {
  if (Array.isArray(value) && value.some((item) => typeof item !== 'object')) {
    structure.value = `[${value
      .map((item) => {
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
  switch (typeof value) {
    case 'string':
      return `"${value}"`;
    case 'number':
      return value.toString();
    case 'boolean':
      return value.toString();
    default:
      return '';
  }
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
