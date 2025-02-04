import { useState } from 'react';
import ObjTextarea from '../presentationals/obj-differ/obj-textarea';
import { urlToJson } from '@/utils/text-format/query-format';
import ResultObj from '../presentationals/obj-differ/result-obj';
import ButtonBack from '../presentationals/buttons/button-back';
import { useRouter } from 'next/router';

const UrlToJsonContainer = () => {
  const { back } = useRouter();

  const [url, setUrl] = useState<string>('');
  const [json, setJson] = useState<object>({});

  const formatUrl = () => {
    const json = urlToJson(url);
    if (json) {
      setJson(json);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <article className="max-w-screen-xl flex gap-4 mx-auto w-full">
        <ButtonBack onClick={back} />
      </article>
      <article className="max-w-screen-xl flex flex-col gap-4 mx-auto w-full">
        <h1 className="text-2xl font-bold">URL 및 Query를 JSON으로 변환합니다.</h1>
      </article>
      <article className="max-w-screen-xl flex gap-4 mx-auto w-full">
        <div className="border border-gray-200 rounded-lg w-full h-full max-h-[80vh] overflow-y-auto">
          <ObjTextarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-full"
          />
        </div>
      </article>
      <button onClick={formatUrl} className="px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto">
        찾기
      </button>
      <ResultObj value={json} />
    </section>
  );
};

export default UrlToJsonContainer;
