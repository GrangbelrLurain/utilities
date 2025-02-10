import { useState } from 'react';
import ObjTextarea from '@Shared/ui/obj-differ/ObjTextarea';
import ResultStrings from '@Shared/ui/obj-differ/ResultStrings';
import { compareTwiceObjRecursive } from '@Shared/utils/compare/obj-compare';

const ObjContainer = () => {
  const [obj1, setObj1] = useState<string>('');
  const [obj2, setObj2] = useState<string>('');
  const [differences, setDifferences] = useState<string[]>([]);

  const compareObjects = () => {
    try {
      const parsed1 = JSON.parse(obj1);
      const parsed2 = JSON.parse(obj2);

      const diffs = compareTwiceObjRecursive(parsed1, parsed2);

      setDifferences([JSON.stringify(diffs)]);
    } catch {
      setDifferences(['유효하지 않은 JSON 형식입니다.']);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <article className="max-w-screen-xl flex flex-col gap-4 mx-auto w-full">
        <h1 className="text-2xl font-bold">두 JSON 값을 비교합니다.</h1>
      </article>
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
      <ResultStrings values={differences} />
    </section>
  );
};

export default ObjContainer;
