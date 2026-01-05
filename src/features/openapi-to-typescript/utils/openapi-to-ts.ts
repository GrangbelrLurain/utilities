import openapiTS, { astToString } from 'openapi-typescript';

export const openapiToTs = async (openapiUrl: string) => {
  const ts = astToString(await openapiTS(openapiUrl));
  return ts;
};
