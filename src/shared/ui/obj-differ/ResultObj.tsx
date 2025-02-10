import { formatObjectLiteral, parseObjectRecursive } from '@Shared/utils/text-format/obj-format';
import { useMemo } from 'react';
import ObjTextarea from './ObjTextarea';

type TResultObj = {
  value: object;
};

const ResultObj = ({ value }: TResultObj) => {
  const valueFormatJSON = useMemo(() => {
    try {
      const parsedValue = parseObjectRecursive(JSON.stringify(value));
      const formatValue = formatObjectLiteral(JSON.stringify(parsedValue));
      return formatValue;
    } catch {
      return '잘못된 JSON 형식입니다.';
    }
  }, [value]);
  return (
    <div className="max-w-screen-xl mx-auto mt-4 border border-primary rounded-lg p-4 w-full">
      <h3 className="font-bold mb-2 text-primary">Result</h3>
      {Object.keys(value).length > 0 ? (
        <ObjTextarea value={valueFormatJSON} className="w-full h-full" />
      ) : (
        <p className="whitespace-pre-wrap">해당되는 값이 없습니다.</p>
      )}
    </div>
  );
};

export default ResultObj;
