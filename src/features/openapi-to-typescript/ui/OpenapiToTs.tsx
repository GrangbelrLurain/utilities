import { useState } from 'react';

const OpenapiToTs = () => {
  const [typecript, setTypecript] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!process.env.NEXT_PUBLIC_IS_LOCAL_HOST) {
      alert('API URL is not set');
      return;
    }

    const openapiUrl = (e.target as HTMLFormElement).openapiUrl.value;

    const ts = await fetch('/api/openapi-to-ts', {
      method: 'POST',
      body: JSON.stringify({ openapiUrl }),
    });
    const data = await ts.json();
    setTypecript(data.ts);
  };

  return (
    <article className="flex flex-col gap-4 w-full h-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor="openapiUrl">OpenAPI URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="openapiUrl"
            className="input input-primary w-full"
            placeholder="https://api.example.com/openapi.json"
          />
          <button type="submit" className="btn btn-primary">
            Convert
          </button>
        </div>
      </form>
      <textarea value={typecript} className="textarea textarea-primary" />
    </article>
  );
};

export default OpenapiToTs;
