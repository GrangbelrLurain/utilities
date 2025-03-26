/* eslint-disable no-useless-escape */
export const formatObjectLiteral = (value: string): string => {
  try {
    const cleanValue = value.replace(/,(\s*})*$/, '$1');
    let processedValue = cleanValue.replace(/'/g, '"');
    processedValue = processedValue.replace(/(\{|\,)\s*([a-zA-Z0-9_]+)\s*\:/g, '$1"$2":');
    const parsedObj = JSON.parse(processedValue);
    return JSON.stringify(parsedObj, null, 2);
  } catch (error) {
    console.warn('formatObjectLiteral 실패:', error);
    return value;
  }
};

/**
 * 문자열에서 유효한 JSON 부분을 추출하는 함수
 * @param input - 입력 문자열
 * @returns 추출된 유효한 JSON 문자열
 */
export const extractValidJson = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // 입력 문자열 정리
  let cleanedInput = input.trim();

  // 유효한 JSON 시작 지점 찾기
  const jsonStart = cleanedInput.search(/[\[{]/);
  if (jsonStart !== -1) {
    cleanedInput = cleanedInput.substring(jsonStart);
  }

  // 괄호 매칭을 통해 유효한 JSON 끝점 찾기
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let validEnd = -1;

  for (let i = 0; i < cleanedInput.length; i++) {
    const char = cleanedInput[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{' || char === '[') {
      depth++;
    } else if (char === '}' || char === ']') {
      depth--;
      if (depth === 0) {
        validEnd = i + 1;
        break;
      }
    }
  }

  if (validEnd !== -1) {
    cleanedInput = cleanedInput.substring(0, validEnd);
  }

  return cleanedInput;
};

/**
 * JavaScript 객체 리터럴 또는 비정상적인 JSON을 유효한 JSON 문자열로 변환
 * @param input - 입력 문자열 (JavaScript 객체 리터럴 또는 JSON 형식)
 * @returns 포맷팅된 JSON 문자열
 */
export const convertToValidJson = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // 먼저 유효한 JSON 부분 추출
  const extractedJson = extractValidJson(input);

  // 이미 JSON 형식인지 확인
  try {
    const parsed = JSON.parse(extractedJson);
    return JSON.stringify(parsed, null, 2);
  } catch {
    // JSON 파싱 실패 시 변환 시도
  }

  let result = extractedJson;

  try {
    // 1. 주석 제거 (한 줄 및 여러 줄 주석)
    result = result.replace(/\/\/.*$/gm, '');
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');

    // 2. 따옴표가 없는 속성명에 큰따옴표 추가
    result = result.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

    // 3. 작은따옴표를 큰따옴표로 변환
    result = result.replace(/'([^']*)'/g, '"$1"');

    // 4. 마지막 쉼표 제거
    result = result.replace(/,(\s*[\]}])/g, '$1');

    // 5. 숫자가 아닌 값의 따옴표 없는 문자열을 큰따옴표로 감싸기
    result = result.replace(/:(\s*)([^"\d{[][\w-]+)(\s*[,}])/g, ':"$2"$3');

    // 6. 부동 소수점 수 처리
    result = result.replace(/:(\s*)NaN/g, ':"NaN"');
    result = result.replace(/:(\s*)Infinity/g, ':"Infinity"');
    result = result.replace(/:(\s*)-Infinity/g, ':"-Infinity"');

    // 7. undefined를 null로 변환
    result = result.replace(/:(\s*)undefined/g, ':null');

    // 8. 불린 값 소문자로 변환
    result = result.replace(/:(\s*)TRUE/gi, ':true');
    result = result.replace(/:(\s*)FALSE/gi, ':false');

    // 9. 잘못된 콤마 제거
    result = result.replace(/,\s*,/g, ',');

    // 10. 첫 번째 중괄호/대괄호와 마지막 중괄호/대괄호 사이의 내용만 유지
    const firstBracket = result.search(/[\[{]/);
    const lastBracket = result.search(/[\]}][^\]}]*$/);

    if (firstBracket !== -1 && lastBracket !== -1) {
      result = result.substring(firstBracket, lastBracket + 1);
    }

    try {
      // 변환된 문자열이 유효한 JSON인지 확인
      const parsed = JSON.parse(result);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // 여전히 파싱에 실패하면 마지막 수단으로 시도
      try {
        // 괄호 매칭 확인
        let bracketResult = '';
        const openBrackets = [];
        let inQuote = false;
        let escapeChar = false;

        for (let i = 0; i < result.length; i++) {
          const char = result[i];

          if (escapeChar) {
            bracketResult += char;
            escapeChar = false;
            continue;
          }

          if (char === '\\' && inQuote) {
            bracketResult += char;
            escapeChar = true;
            continue;
          }

          if (char === '"' && !escapeChar) {
            inQuote = !inQuote;
            bracketResult += char;
            continue;
          }

          if (inQuote) {
            bracketResult += char;
            continue;
          }

          if (char === '{' || char === '[') {
            openBrackets.push(char);
            bracketResult += char;
          } else if (char === '}') {
            if (openBrackets.length > 0 && openBrackets[openBrackets.length - 1] === '{') {
              openBrackets.pop();
              bracketResult += char;
            }
          } else if (char === ']') {
            if (openBrackets.length > 0 && openBrackets[openBrackets.length - 1] === '[') {
              openBrackets.pop();
              bracketResult += char;
            }
          } else {
            bracketResult += char;
          }
        }

        // 닫히지 않은 괄호 처리
        while (openBrackets.length > 0) {
          const lastOpen = openBrackets.pop();
          bracketResult += lastOpen === '{' ? '}' : ']';
        }

        // 괄호 매칭 검증 전에 추가 확인 및 디버깅
        console.log('bracketResult 길이:', bracketResult.length);
        console.log('bracketResult 부분 샘플:', bracketResult.substring(0, 100) + '...');

        // 유효한 JSON 문자열인지 간단히 체크
        if (!bracketResult.trim().startsWith('{') && !bracketResult.trim().startsWith('[')) {
          console.error('유효한 JSON 시작 문자가 아님');
          throw new Error('유효한 JSON 시작 문자가 아님');
        }

        if (!bracketResult.trim().endsWith('}') && !bracketResult.trim().endsWith(']')) {
          console.error('유효한 JSON 종료 문자가 아님');
          throw new Error('유효한 JSON 종료 문자가 아님');
        }

        // JSON.parse 직전에 더 안전한 방식 시도
        try {
          // 안전한 방식으로 JSON 파싱 시도
          const parsedObj = JSON.parse(bracketResult);
          return JSON.stringify(parsedObj, null, 2);
        } catch (jsonError) {
          if (jsonError instanceof Error) {
            console.error('JSON 파싱 오류:', jsonError.message);
            console.log('오류가 발생한 JSON 문자열:', bracketResult);
          }

          // 직접 속성 이름에 따옴표 추가
          let fixedJson = bracketResult.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');

          // 작은따옴표를 큰따옴표로 변환
          fixedJson = fixedJson.replace(/'([^']*)'/g, '"$1"');

          // 불필요한 콤마 제거
          fixedJson = fixedJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

          // 미완성된 JSON 구조 수정
          if ((fixedJson.match(/{/g) || []).length > (fixedJson.match(/}/g) || []).length) {
            const diff =
              (fixedJson.match(/{/g) || []).length - (fixedJson.match(/}/g) || []).length;
            fixedJson += '}'.repeat(diff);
          }

          if ((fixedJson.match(/\[/g) || []).length > (fixedJson.match(/\]/g) || []).length) {
            const diff =
              (fixedJson.match(/\[/g) || []).length - (fixedJson.match(/\]/g) || []).length;
            fixedJson += ']'.repeat(diff);
          }

          try {
            const reParsedObj = JSON.parse(fixedJson);
            return JSON.stringify(reParsedObj, null, 2);
          } catch (finalError) {
            // 모든 시도가 실패하면 오류 상세 정보 포함
            if (finalError instanceof Error) {
              console.error('최종 JSON 파싱 실패:', finalError.message);
            }
            // 원본 반환
            return input;
          }
        }
      } catch (outerError) {
        console.error('괄호 매칭 과정 오류:', outerError);
        return input;
      }
    }
  } catch (outerError) {
    console.error('JSON 변환 과정에서 오류:', outerError);
    return input;
  }
};

/**
 * 입력된 텍스트가 유효한 JSON 배열인지 확인하고 변환
 * @param text - 변환할 텍스트
 * @returns 변환된 JSON 배열 문자열 또는 원본 텍스트
 */
export const safelyParseJsonArray = (text: string): string => {
  if (!text || text.trim() === '') {
    return '[]';
  }

  try {
    // 안전하게 JSON으로 변환 시도
    const validJson = convertToValidJson(text);

    // 실제로 파싱하여 검증
    const parsed = JSON.parse(validJson);

    // 배열 형태로 반환
    if (Array.isArray(parsed)) {
      return JSON.stringify(parsed, null, 2);
    } else {
      // 배열이 아닌 경우 배열로 감싸서 반환
      return JSON.stringify([parsed], null, 2);
    }
  } catch (finalError) {
    console.error('모든 JSON 변환 시도 실패:', finalError);
    // 정말 모든 변환 방법이 실패하면 원본 반환
    return text;
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

/**
 * JSON 배열을 CSV 문자열로 변환하는 함수
 * @param jsonArray - 변환할 객체 배열 (object[])
 * @returns CSV 형식의 문자열
 */
export const jsonToMatrix = (jsonArray: Record<string, unknown>[]): string[][] => {
  // 빈 배열인 경우 빈 문자열 반환
  if (!jsonArray || jsonArray.length === 0) {
    return [];
  }

  // 모든 객체에서 고유한 헤더(키) 추출
  const headers = Array.from(new Set(jsonArray.flatMap((obj) => Object.keys(obj))));

  // 헤더 행 생성
  const csvRows: string[][] = [headers];

  // 각 객체를 CSV 행으로 변환
  for (const obj of jsonArray) {
    const values = headers.map((header) => {
      const value = obj[header as keyof typeof obj];
      // 값이 문자열이고 콤마나 큰따옴표를 포함하면 큰따옴표로 감싸고 내부 큰따옴표는 두 번 사용
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      // null이나 undefined는 빈 문자열로 처리
      return value === null || value === undefined ? '' : String(value);
    });
    csvRows.push(values);
  }

  return csvRows;
};

/**
 * JSON 문자열을 CSV 문자열로 변환하는 함수
 * @param jsonString - JSON 형식의 문자열
 * @returns CSV 형식의 문자열
 */
export const parseJsonToMatrix = (jsonString: string): string[][] => {
  try {
    console.log(jsonString);
    console.log(typeof jsonString);
    const jsonData = JSON.parse(jsonString);
    // JSON이 배열인지 확인
    if (Array.isArray(jsonData)) {
      return jsonToMatrix(jsonData);
    } else {
      // 단일 객체인 경우 배열로 감싸서 처리
      return jsonToMatrix([jsonData]);
    }
  } catch (error) {
    console.error('JSON 파싱 오류:', error);
    return [];
  }
};

export const MatrixToCsv = (matrix: string[][]): string => {
  return matrix
    .map((row) =>
      row
        .map((cell) => {
          if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(','),
    )
    .join('\n');
};
