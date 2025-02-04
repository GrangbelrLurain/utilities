import { ENCODES, type TTranslationCodes } from '@/schemas/translation';

import { useRouter } from 'next/router';
import ButtonBack from '../presentationals/buttons/button-back';
import ObjTextarea from '../presentationals/obj-differ/obj-textarea';
import { useState } from 'react';
import useChange from '@/hooks/event-handler/useChange';
import { decode } from '@/utils/translation/code-translation';

const EncodeBase64Container = () => {
  const router = useRouter();
  const [text, handleTextChange] = useChange('');
  const [type, handleTypeChange] = useChange<HTMLSelectElement, TTranslationCodes>('base64');
  const [result, setResult] = useState('');

  const toEncode = () => {
    try {
      const decodeResult = decode(text, type);
      setResult(decodeResult?.toString() ?? '');
    } catch (error) {
      console.error('Decoding failed:', error);
      setResult('');
    }
  };
  return (
    <section className="flex flex-col gap-4">
      <article className="mx-auto max-w-screen-xl w-full">
        <ButtonBack onClick={() => router.back()} />
      </article>
      <article className="mx-auto max-w-screen-xl w-full">
        <h2 className="text-xl font-bold">디코딩할 텍스트를 입력합니다.</h2>
      </article>
      <article className="mx-auto max-w-screen-xl w-full">
        <div className="border border-gray-200 rounded-lg w-full h-full max-h-[80vh] overflow-y-auto">
          <ObjTextarea className="w-full" onChange={handleTextChange} />
        </div>
      </article>
      <article className="mx-auto max-w-screen-xl w-full join">
        <select className="select select-bordered select-sm join-item" onChange={handleTypeChange}>
          {Object.keys(ENCODES).map((key) => (
            <optgroup key={key} label={key}>
              {ENCODES[key as keyof typeof ENCODES].map((item) => {
                if (!item) return null;
                return (
                  <option key={`${key}-${item.code}`} value={item.code}>
                    {item.name}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
        <button className="btn btn-primary btn-sm join-item" onClick={toEncode}>
          디코딩
        </button>
      </article>
      <article className="mx-auto max-w-screen-xl w-full">
        <h2 className="text-xl font-bold">디코딩 결과</h2>
      </article>
      <article className="mx-auto max-w-screen-xl w-full">
        <div className="border border-gray-200 rounded-lg w-full h-full max-h-[80vh] overflow-y-auto">
          <ObjTextarea className="w-full" defaultValue={result} />
        </div>
      </article>
    </section>
  );
};

export default EncodeBase64Container;
