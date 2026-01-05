import { openapiToTs } from '@Features/openapi-to-typescript/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const openapiUrl = JSON.parse(req.body).openapiUrl;

  if (!openapiUrl) {
    res.status(400).json({ message: 'openapiUrl is required' });
    return;
  }

  const ts = await openapiToTs(openapiUrl);
  res.status(200).json({ ts });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
