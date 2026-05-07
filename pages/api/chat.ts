// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBeautyAdvice } from '../../lib/recommendations';
import { getMockSkinAnalysis } from '../../lib/youcam';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { message, history } = req.body;
    const skinAnalysis = getMockSkinAnalysis();
    const reply = await getBeautyAdvice(message, skinAnalysis, history || []);
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('[chat error]', err);
    return res.status(200).json({
      reply: "Based on your skin analysis, I'd recommend focusing on hydration and SPF daily. What specific concern can I help you with?"
    });
  }
}
