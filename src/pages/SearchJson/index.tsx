import { useState } from 'react';
import ObjTextarea from '@Shared/ui/obj-differ/ObjTextarea';
import to from 'to-case';
import ResultStrings from '@Shared/ui/obj-differ/ResultStrings';
import { compareObjKey } from '@Shared/utils/compare/obj-compare';

const CASES = [
  'camel',
  'capital',
  'constant',
  'dot',
  'lower',
  'pascal',
  'sentence',
  'slug',
  'snake',
  'space',
  'title',
  'upper',
] as const;

type TCase = (typeof CASES)[number];

const SearchJsonContainer = () => {
  const [obj1, setObj1] = useState<string>('');

  const [selectCase, setSelectCase] = useState<TCase>('camel');

  const [findCases, setFindCases] = useState<string[]>([]);

  const findCase = () => {
    try {
      const parsed = JSON.parse(obj1);
      const searchKeys = compareObjKey(parsed, selectCase, to);
      setFindCases(searchKeys);
    } catch (error) {
      console.error('JSON 파싱 에러:', error);
      setFindCases([]);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <article className="max-w-screen-xl flex flex-col gap-4 mx-auto w-full">
        <h1 className="text-2xl font-bold">JSON key값의 case를 검사합니다.</h1>
      </article>
      <article className="max-w-screen-xl flex flex-col gap-4 mx-auto w-full">
        <select
          value={selectCase}
          onChange={(e) => setSelectCase(e.target.value as TCase)}
          className="select select-bordered"
        >
          {CASES.map((k) => {
            return <option key={k}>{k}</option>;
          })}
        </select>
      </article>
      <article className="max-w-screen-xl flex gap-4 mx-auto w-full">
        <div className="border border-gray-200 rounded-lg w-full h-full max-h-[80vh] overflow-y-auto">
          <ObjTextarea
            value={obj1}
            onChange={(e) => setObj1(e.target.value)}
            className="w-full h-full"
          />
        </div>
      </article>
      <button
        onClick={findCase}
        className="max-w-screen-md mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        찾기
      </button>
      <ResultStrings values={findCases} />
    </section>
  );
};

export default SearchJsonContainer;
