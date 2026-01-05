import ObjTextarea from '@Shared/ui/obj-differ/ObjTextarea';
import { CsvToMatrix, MatrixToJson } from '@Shared/utils/text-format/obj-format';
import { useState } from 'react';

const CsvToJson = () => {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');

  const handleConvert = () => {
    try {
      const matrix = CsvToMatrix(csv);
      const json = MatrixToJson(matrix);
      setJson(JSON.stringify(json, null, 2));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full w-full">
      <div className="mb-2 h-1/2">
        <textarea
          className="textarea textarea-bordered textarea-sm w-full overflow-y-auto h-full"
          onChange={(e) => setCsv(e.target.value)}
        />
      </div>
      <button onClick={handleConvert} className="btn flex-shrink">
        Convert
      </button>
      <div className="overflow-y-auto h-1/2">
        <ObjTextarea value={json} className="h-full w-full" />
      </div>
    </div>
  );
};

export default CsvToJson;
