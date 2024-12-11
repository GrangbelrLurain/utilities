import { useState } from 'react';
import ObjTextarea from '../presentationals/obj-differ/obj-textarea';
import { formatObjectLiteral } from '@/utils/text-format/obj-format';

const ObjContainer = () => {
  const [obj1, setObj1] = useState<string>('');
  const [obj2, setObj2] = useState<string>('');
  const [differences, setDifferences] = useState<string[]>([]);

  const compareObjects = () => {
    try {
      const parsed1 = JSON.parse(obj1);
      const parsed2 = JSON.parse(obj2);

      const diffs: string[] = [];

      const findDifferences = (obj1: object, obj2: object, path: string[] = []) => {
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
            findDifferences(value1, value2, currentPath);
          }
          // 값이 다른 경우
          else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
            const pathStr = currentPath.join('.');
            diffs.push(
              `{"${pathStr}": {"value1": ${JSON.stringify(value1)}, "value2": ${JSON.stringify(value2)}}}`,
            );
          }
        });
      };

      findDifferences(parsed1, parsed2);
      setDifferences(diffs);
    } catch {
      setDifferences(['유효하지 않은 JSON 형식입니다.']);
    }
  };

  return (
    <section className="flex flex-col gap-4 pt-10">
      <article className="max-w-screen-xl flex gap-4 mx-auto w-full">
        <div className="border border-gray-200 rounded-lg w-full h-full max-h-[80vh] overflow-y-auto">
          <ObjTextarea
            value={obj1}
            onChange={(e) => setObj1(e.target.value)}
            className="w-full h-full"
          />
        </div>
        <div className="border border-gray-200 rounded-lg w-full h-full max-h-[80vh] overflow-y-auto">
          <ObjTextarea
            value={obj2}
            onChange={(e) => setObj2(e.target.value)}
            className="w-full h-full"
          />
        </div>
      </article>
      <button
        onClick={compareObjects}
        className="max-w-screen-md mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        비교하기
      </button>
      <div className="max-w-screen-md mx-auto mt-4">
        <h3 className="font-bold mb-2">차이점:</h3>
        {differences.length > 0 ? (
          <p className="whitespace-pre-wrap">
            {differences.map((diff) => formatObjectLiteral(diff)).join('\n')}
          </p>
        ) : (
          <p className="whitespace-pre-wrap">차이점이 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default ObjContainer;
