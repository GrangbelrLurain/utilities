import CsvToJson from '@Pages/CsvToJson';

const Page = () => {
  return (
    <div className="max-w-screen-lg mx-auto flex flex-col gap-4 h-[calc(100vh-200px)]">
      <h1 className="text-2xl font-bold">CSV to JSON</h1>
      <CsvToJson />
    </div>
  );
};

export default Page;
