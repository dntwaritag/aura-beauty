// pages/api/tryon/makeup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { applyARMakeup } from '../../../lib/youcam';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { image, productId, productType, color, intensity } = req.body;
    const result = await applyARMakeup({ imageBase64: image, productId, productType, color, intensity });
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: 'Try-on failed' });
  }
}
