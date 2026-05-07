// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { analyzeSkin } from '../../lib/youcam';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Image required' });

    const result = await analyzeSkin(image);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[/api/analyze]', err);
    return res.status(500).json({ error: 'Analysis failed' });
  }
}
