import ButtonBack from '@/components/presentationals/buttons/button-back';
import ObjTextarea from '@/components/presentationals/obj-differ/obj-textarea';
import { parseJSONToStructureRecursive, structureToRows } from '@/utils/text-format/obj-format';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdCopyAll, MdDownload } from 'react-icons/md';

const Page = () => {
  const { back } = useRouter();
  const [jsonInput, setJsonInput] = useState('');
  const [csvRows, setCsvRows] = useState<string[][]>([]);

  const handleConvert = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const structure = parseJSONToStructureRecursive(jsonData);
      const rows = structureToRows(structure);
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
    <div className="flex flex-col gap-4">
      <article className="max-w-screen-xl flex gap-4 mx-auto w-full">
        <ButtonBack onClick={back} />
      </article>
      <div className="max-w-screen-xl flex flex-col gap-4 mx-auto w-full">
        <h1 className="text-2xl font-bold">JSON key to CSV</h1>
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
