import { useState } from 'react';
import ObjTextarea from '../presentationals/obj-differ/obj-textarea';
import to from 'to-case';
import { formatObjectLiteral } from '@/utils/text-format/obj-format';

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
      const matchingKeys = new Set<string>();

      // 객체의 모든 key를 재귀적으로 검사하는 함수
      const searchKeys = (obj: object) => {
        if (typeof obj !== 'object' || obj === null) return;

        Object.keys(obj).forEach((key) => {
          // 현재 key의 case 확인
          const keyCase = to(key);
          if (keyCase === selectCase) {
            matchingKeys.add(key);
          }

          // 값이 객체인 경우 재귀적으로 검사
          if (
            typeof obj[key as keyof typeof obj] === 'object' &&
            obj[key as keyof typeof obj] !== null
          ) {
            searchKeys(obj[key as keyof typeof obj]);
          }
        });
      };

      searchKeys(parsed);
      setFindCases(Array.from(matchingKeys));
    } catch (error) {
      console.error('JSON 파싱 에러:', error);
      setFindCases([]);
    }
  };

  return (
    <section className="flex flex-col gap-4 pt-10">
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
      <div className="max-w-screen-md mx-auto mt-4">
        <h3 className="font-bold mb-2">결과:</h3>
        {findCases.length > 0 ? (
          <p className="whitespace-pre-wrap">
            {findCases.map((diff) => formatObjectLiteral(diff)).join('\n')}
          </p>
        ) : (
          <p className="whitespace-pre-wrap">차이점이 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default SearchJsonContainer;
