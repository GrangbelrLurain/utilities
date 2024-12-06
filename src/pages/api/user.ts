import { createMockUser } from '@/schemas/user';
import { NextApiRequest, NextApiResponse } from 'next';

export type TTestQuery = {
  limit?: string;
  page?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { limit = '10', page = '1' } = req.query as TTestQuery;

  res.status(200).json(
    Array.from({ length: Number(limit) }, (_, index) => {
      const nowIndex = index + Number(page) * Number(limit);
      return createMockUser(nowIndex);
    }),
  );
}
