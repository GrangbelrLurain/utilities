import { useState } from 'react';
import ObjTextarea from '@Shared/ui/obj-differ/ObjTextarea';
import { urlToString } from '@Shared/utils/text-format/query-format';
import TextareaAutoResize from '@Shared/ui/textarea/TextareaAutoResize';

const UrlToStringContainer = () => {
  const [url, setUrl] = useState<string>('');
  const [string, setString] = useState<string>('');

  const formatUrl = () => {
    const string = urlToString(url);
    if (string) {
      setString(string);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <article className="max-w-screen-xl flex flex-col gap-4 mx-auto w-full">
        <h1 className="text-2xl font-bold">URL 및 Query를 읽기 편한 문자열로 변환합니다.</h1>
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
        변환
      </button>
      <TextareaAutoResize
        value={string}
        placeholder="변환된 문자열"
        className="w-full max-w-screen-xl overflow-y-auto mx-auto textarea textarea-bordered"
        readOnly
      />
    </section>
  );
};

export default UrlToStringContainer;
