// pages/api/recommendations.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAIRecommendations } from '../../lib/recommendations';
import { getMockSkinAnalysis } from '../../lib/youcam';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { category, preferences, skinAnalysis } = req.body;
    const skin = skinAnalysis || getMockSkinAnalysis();
    const products = await getAIRecommendations(skin, category, preferences);
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ error: 'Recommendations failed' });
  }
}
