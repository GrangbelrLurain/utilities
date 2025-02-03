import ObjTextarea from '@/components/presentationals/obj-differ/obj-textarea';
import { useState } from 'react';

interface KeyStructure {
  key: string;
  depth: number;
  children?: KeyStructure[];
}

function parseJsonStructureRecursive(
  obj: Record<string, unknown> | unknown[],
  parentKey = '',
  seenKeys = new Map<string, KeyStructure>(),
): KeyStructure[] {
  // 배열인 경우 처리
  if (Array.isArray(obj)) {
    return obj.flatMap((item, index) => {
      if (item && typeof item === 'object') {
        return parseJsonStructureRecursive(
          item as Record<string, unknown>,
          parentKey ? `${parentKey}[${index}]` : `[${index}]`,
          seenKeys,
        );
      }
      return [];
    });
  }

  // 객체인 경우 처리
  return Object.entries(obj).flatMap(([key, value]) => {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;

    // 이미 본 키가 있는 경우, 해당 구조에 자식 노드 추가
    if (seenKeys.has(currentKey)) {
      const existingStructure = seenKeys.get(currentKey)!;
      if (value && typeof value === 'object') {
        const newChildren = parseJsonStructureRecursive(
          value as Record<string, unknown>,
          currentKey,
          seenKeys,
        );
        existingStructure.children = existingStructure.children || [];
        existingStructure.children.push(...newChildren);
      }
      return [];
    }

    const structure: KeyStructure = {
      key,
      depth: parentKey ? parentKey.split('.').length : 0,
    };

    seenKeys.set(currentKey, structure);

    if (value && typeof value === 'object') {
      structure.children = parseJsonStructureRecursive(
        value as Record<string, unknown>,
        currentKey,
        seenKeys,
      );
    }

    return [structure];
  });
}

function convertToRows(structure: KeyStructure[]): string[][] {
  const rows: string[][] = [];

  function processStructure(items: KeyStructure[]) {
    items.forEach((item) => {
      // depth만큼 빈 셀을 만들되, 마지막에 현재 키를 추가
      const row = new Array(item.depth).fill('').concat(item.key);
      rows.push(row);

      if (item.children) {
        processStructure(item.children);
      }
    });
  }

  processStructure(structure);
  return rows;
}

// 사용 예시:

// CSV 문자열로 변환
function downloadCSV(csvContent: string, filename: string = 'json-structure.csv') {
  // CSV BOM 추가 (Excel에서 한글 깨짐 방지)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  // 클린업
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

const Page = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [csvPreview, setCsvPreview] = useState('');

  // 사용 예시:
  const handleConvert = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const structure = parseJsonStructureRecursive(jsonData);
      const rows = convertToRows(structure);
      const csvContent = rows
        .map((row) =>
          row
            .map((cell) => {
              // 콤마나 줄바꿈이 포함된 경우 따옴표로 감싸기
              if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
                // 셀 내의 따옴표는 두 번 써서 이스케이프
                return `"${cell.replace(/"/g, '""')}"`;
              }
              return cell;
            })
            .join(','),
        )
        .join('\n');
      setCsvPreview(csvContent);
    } catch (error) {
      console.error(error);
      alert('올바른 JSON 형식이 아닙니다.');
    }
  };

  const handleDownload = () => {
    if (!csvPreview) {
      alert('먼저 JSON을 변환해주세요.');
      return;
    }
    downloadCSV(csvPreview);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setCsvPreview('');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-4 flex flex-col h-screen max-h-screen">
        <div className="flex flex-col flex-shrink-0 h-0 flex-grow overflow-hidden">
          <label className="block text-sm font-medium mb-2">JSON 입력</label>
          <div className="overflow-y-auto">
            <ObjTextarea
              className="w-full border border-primary overflow-y-auto"
              value={jsonInput}
              onChange={handleChange}
              placeholder="JSON을 입력하세요..."
            />
          </div>
        </div>

        <div className="flex space-x-2 flex-shrink">
          <button
            onClick={handleConvert}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            변환
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={!csvPreview}
          >
            CSV 다운로드
          </button>
        </div>

        <div>{csvPreview ? '변환 완료' : '변환 필요'}</div>
      </div>
    </div>
  );
};

export default Page;
