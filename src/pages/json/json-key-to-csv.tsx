import ButtonBack from '@/components/presentationals/buttons/button-back';
import ObjTextarea from '@/components/presentationals/obj-differ/obj-textarea';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdCopyAll, MdDownload } from 'react-icons/md';

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
    const arrayKey = parentKey ? `${parentKey}/*array*/` : '/*array*/';
    const mergedResults: KeyStructure[] = [];

    obj.forEach((item) => {
      if (item && typeof item === 'object') {
        const results = parseJsonStructureRecursive(
          item as Record<string, unknown>,
          arrayKey,
          seenKeys,
        );
        results.forEach((result) => {
          const existingIndex = mergedResults.findIndex((r) => r.key === result.key);
          if (existingIndex === -1) {
            mergedResults.push(result);
          } else if (result.children) {
            mergedResults[existingIndex].children = mergedResults[existingIndex].children || [];
            mergedResults[existingIndex].children!.push(...(result.children || []));
          }
        });
      }
    });

    return mergedResults;
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

    let keyName = key;

    if (Array.isArray(value)) {
      keyName = `${key}/*array*/`;
    }

    const structure: KeyStructure = {
      key: keyName,
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

const Page = () => {
  const { back } = useRouter();
  const [jsonInput, setJsonInput] = useState('');
  const [csvRows, setCsvRows] = useState<string[][]>([]);

  const handleConvert = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const structure = parseJsonStructureRecursive(jsonData);
      const rows = convertToRows(structure);
      setCsvRows(rows);
      return rows;
    } catch (error) {
      console.error(error);
      alert('올바른 JSON 형식이 아닙니다.');
      setCsvRows([]);
      return [[]];
    }
  };

  const handleCopy = (rows: string[][]) => {
    if (rows.length === 0) {
      alert('먼저 JSON을 변환해주세요.');
      return;
    }

    // 엑셀 형식으로 데이터 포맷팅 (탭으로 구분)
    const excelContent = rows
      .map((row) =>
        row
          .map((cell) => {
            if (cell.includes('\t') || cell.includes('\n') || cell.includes('"')) {
              return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
          })
          .join('\t'),
      )
      .join('\n');

    navigator.clipboard.writeText(excelContent);
    alert('클립보드에 복사되었습니다. 엑셀에 붙여넣기 할 수 있습니다.');
  };

  const handleDownload = (rows: string[][]) => {
    if (rows.length === 0) {
      alert('먼저 JSON을 변환해주세요.');
      return;
    }

    // CSV BOM 추가 (Excel에서 한글 깨짐 방지)
    const excelContent = rows
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

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + excelContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'json-structure.csv');
    document.body.appendChild(link);
    link.click();

    // 클린업
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  return (
    <div className="flex flex-col pt-20 gap-4">
      <article className="max-w-screen-xl flex gap-4 mx-auto w-full">
        <ButtonBack onClick={back} />
      </article>
      <div className="max-w-screen-xl flex flex-col gap-4 mx-auto w-full">
        <h1 className="text-2xl font-bold">JSON to CSV</h1>
        <label className="block text-sm font-medium mb-2">Please write JSON</label>
        <div className="border border-gray-200 rounded-lg w-full h-full max-h-[80vh] overflow-y-auto">
          <ObjTextarea
            className="w-full h-full"
            value={jsonInput}
            onChange={handleChange}
            placeholder="JSON을 입력하세요..."
          />
        </div>
        <div className="flex space-x-2 flex-shrink">
          <button
            onClick={() => handleCopy(handleConvert() || [[]])}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 flex items-center gap-2"
          >
            <MdCopyAll />
          </button>
          <button
            onClick={() => handleDownload(handleConvert() || [[]])}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          >
            <MdDownload />
          </button>
        </div>
        {csvRows.length > 0 && (
          <>
            <label className="block text-sm font-medium mb-2">Preview</label>
            <div className="border border-gray-200 rounded-lg w-full h-full max-h-[80vh] overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${rowIndex}-${cellIndex}`}
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            cell ? 'text-gray-900' : 'text-gray-300'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
