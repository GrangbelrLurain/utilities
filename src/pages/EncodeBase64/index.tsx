import { ENCODES } from '@Entities/encode/constants/translation';
import { TTranslationCodes } from '@Entities/encode/structures/translationCodes';
import ObjTextarea from '@Shared/ui/obj-differ/ObjTextarea';
import { useState } from 'react';
import useChange from '@Shared/hooks/useChange';
import { encode } from '@Entities/encode/utils/code-translation';

const EncodeBase64Container = () => {
  const [text, handleTextChange] = useChange('');
  const [type, handleTypeChange] = useChange<HTMLSelectElement, TTranslationCodes>('base64');
  const [result, setResult] = useState('');

  const toEncode = () => {
    try {
      const encodeResult = encode(text, type);
      setResult(encodeResult?.toString() ?? '');
    } catch (error) {
      console.error('Encoding failed:', error);
      setResult('');
    }
  };
  return (
    <section className="flex flex-col gap-4">
      <article className="mx-auto max-w-screen-xl w-full">
        <h2 className="text-xl font-bold">인코딩할 텍스트를 입력합니다.</h2>
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
          인코딩
        </button>
      </article>
      <article className="mx-auto max-w-screen-xl w-full">
        <h2 className="text-xl font-bold">인코딩 결과</h2>
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
