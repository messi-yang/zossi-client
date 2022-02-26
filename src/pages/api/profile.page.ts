import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  nickname: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ nickname: 'Dynamic Shohei Ohtani' });
}
