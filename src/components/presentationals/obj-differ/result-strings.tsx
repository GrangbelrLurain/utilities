import { formatObjectLiteral } from '@/utils/text-format/obj-format';

type TResultStrings = {
  values: string[];
};

const ResultStrings = ({ values }: TResultStrings) => {
  return (
    <div className="max-w-screen-xl mx-auto mt-4 border border-primary rounded-lg p-4 w-full">
      <h3 className="font-bold mb-2 text-primary">Result</h3>
      {values.length > 0 ? (
        <p className="whitespace-pre-wrap">
          {values.map((diff) => formatObjectLiteral(diff)).join('\n')}
        </p>
      ) : (
        <p className="whitespace-pre-wrap">해당되는 값이 없습니다.</p>
      )}
    </div>
  );
};

export default ResultStrings;
