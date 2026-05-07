// pages/api/tryon/hair.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { hairColorTryOn } from '../../../lib/youcam';
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { image, colorHex } = req.body;
    const result = await hairColorTryOn({ imageBase64: image, colorHex });
    return res.status(200).json({ result });
  } catch { return res.status(500).json({ error: 'Hair try-on failed' }); }
}
