import OpenapiToTs from '@Features/openapi-to-typescript/ui/OpenapiToTs';

const OpenapiToTsPage = () => {
  return (
    <section className="flex flex-col gap-4 max-w-screen-xl mx-auto h-full">
      <h1 className="text-2xl font-bold">OpenAPI to TypeScript</h1>
      <OpenapiToTs />
    </section>
  );
};

export default OpenapiToTsPage;
