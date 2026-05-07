// pages/api/tryon/fashion.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { fashionTryOn } from '../../../lib/youcam';
export const config = { api: { bodyParser: { sizeLimit: '20mb' } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { userImage, garmentImage } = req.body;
    const result = await fashionTryOn({ userImageBase64: userImage, garmentImageBase64: garmentImage });
    return res.status(200).json({ result });
  } catch { return res.status(500).json({ error: 'Fashion try-on failed' }); }
}
