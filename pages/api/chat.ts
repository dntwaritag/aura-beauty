// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBeautyAdvice, getMockSkinAnalysis } from '../../lib/recommendations';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { message, history } = req.body;
    // In production, load user's actual skin analysis from session/Firebase
    const skinAnalysis = getMockSkinAnalysis();
    const reply = await getBeautyAdvice(message, skinAnalysis, history || []);
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ reply: 'I\'m having a moment — please try again!' });
  }
}
