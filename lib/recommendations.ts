// lib/recommendations.ts
// AI-powered product recommendations using skin analysis + OpenAI

import OpenAI from 'openai';
import { SkinAnalysisResult } from './youcam';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  shade?: string;
  shadeHex?: string;
  ingredients?: string[];
  sustainability_score: number; // 0-100
  cruelty_free: boolean;
  vegan: boolean;
  compatibility_score?: number; // computed per user
  compatibility_reason?: string;
  tags: string[];
  url?: string;
}

// ─── Product Catalog (demo) ───────────────────────────────────────────────────

export const PRODUCT_CATALOG: Product[] = [
  // Lipsticks
  { id: 'lip-001', name: 'Velvet Lip Mousse', brand: 'Charlotte Tilbury', category: 'lipstick', price: 34, image: '/products/lip1.jpg', shade: 'Pillow Talk', shadeHex: '#C97B8E', sustainability_score: 72, cruelty_free: true, vegan: false, tags: ['bestseller', 'matte', 'hydrating'] },
  { id: 'lip-002', name: 'Satin Lip Color', brand: 'NARS', category: 'lipstick', price: 28, image: '/products/lip2.jpg', shade: 'Dragon Girl', shadeHex: '#B03050', sustainability_score: 68, cruelty_free: true, vegan: true, tags: ['bold', 'satin', 'longwear'] },
  { id: 'lip-003', name: 'Lip Balm SPF 25', brand: 'EltaMD', category: 'lipstick', price: 18, image: '/products/lip3.jpg', shade: 'Nude', shadeHex: '#D4A090', sustainability_score: 85, cruelty_free: true, vegan: true, tags: ['spf', 'natural', 'hydrating'] },
  { id: 'lip-004', name: 'Ultra Slim Lip Pencil', brand: 'MAC', category: 'lipstick', price: 22, image: '/products/lip4.jpg', shade: 'Whirl', shadeHex: '#A07060', sustainability_score: 60, cruelty_free: false, vegan: false, tags: ['precise', 'liner', 'nude'] },
  // Foundations
  { id: 'fnd-001', name: 'Pro Filt\'r Foundation', brand: 'Fenty Beauty', category: 'foundation', price: 38, image: '/products/fnd1.jpg', shade: '230N', shadeHex: '#C49A6C', sustainability_score: 78, cruelty_free: true, vegan: true, tags: ['inclusive', 'matte', 'full-coverage'] },
  { id: 'fnd-002', name: 'Natural Finish Foundation', brand: 'ILIA', category: 'foundation', price: 54, image: '/products/fnd2.jpg', shade: 'Nevis 15N', shadeHex: '#D4A882', sustainability_score: 94, cruelty_free: true, vegan: true, tags: ['clean', 'skin-first', 'spf'] },
  { id: 'fnd-003', name: 'Luminous Silk Foundation', brand: 'Giorgio Armani', category: 'foundation', price: 65, image: '/products/fnd3.jpg', shade: '5.75', shadeHex: '#C8906A', sustainability_score: 55, cruelty_free: false, vegan: false, tags: ['luxury', 'luminous', 'medium-coverage'] },
  // Skincare
  { id: 'skn-001', name: 'Hyaluronic Acid Serum', brand: 'The Ordinary', category: 'skincare', price: 12, image: '/products/skn1.jpg', sustainability_score: 88, cruelty_free: true, vegan: true, ingredients: ['Hyaluronic Acid', 'Pentavitin'], tags: ['hydration', 'affordable', 'fragrance-free'] },
  { id: 'skn-002', name: 'Vitamin C Glow Serum', brand: 'Drunk Elephant', category: 'skincare', price: 78, image: '/products/skn2.jpg', sustainability_score: 80, cruelty_free: true, vegan: true, ingredients: ['L-Ascorbic Acid', 'Vitamin E', 'Ferulic Acid'], tags: ['brightening', 'anti-aging', 'clean'] },
  { id: 'skn-003', name: 'Niacinamide 10% + Zinc', brand: 'The Ordinary', category: 'skincare', price: 8, image: '/products/skn3.jpg', sustainability_score: 90, cruelty_free: true, vegan: true, ingredients: ['Niacinamide', 'Zinc PCA'], tags: ['pores', 'oil-control', 'affordable'] },
  { id: 'skn-004', name: 'Retinol 0.3% Serum', brand: 'Paula\'s Choice', category: 'skincare', price: 42, image: '/products/skn4.jpg', sustainability_score: 76, cruelty_free: true, vegan: true, ingredients: ['Retinol', 'Peptides', 'Antioxidants'], tags: ['anti-aging', 'firmness', 'science-backed'] },
  // Eyeshadow
  { id: 'eye-001', name: 'Mini Eyeshadow Palette', brand: 'Urban Decay', category: 'eyeshadow', price: 29, image: '/products/eye1.jpg', sustainability_score: 65, cruelty_free: true, vegan: false, tags: ['neutral', 'beginner-friendly', 'pigmented'] },
  { id: 'eye-002', name: 'Mono Eyeshadow', brand: 'Chanel', category: 'eyeshadow', price: 37, image: '/products/eye2.jpg', shade: 'Rose Gold', shadeHex: '#C9956E', sustainability_score: 58, cruelty_free: false, vegan: false, tags: ['luxury', 'shimmer', 'versatile'] },
];

// ─── Compatibility Scoring ────────────────────────────────────────────────────

export function scoreProductCompatibility(
  product: Product,
  skinAnalysis: SkinAnalysisResult
): { score: number; reason: string } {
  let score = 70; // base
  const reasons: string[] = [];

  // Skin tone matching for makeup
  if (product.shadeHex && skinAnalysis.skin_tone.hex) {
    const skinBrightness = hexToBrightness(skinAnalysis.skin_tone.hex);
    const shadeBrightness = hexToBrightness(product.shadeHex);
    const delta = Math.abs(skinBrightness - shadeBrightness);
    if (delta < 20) { score += 15; reasons.push('Excellent shade match'); }
    else if (delta < 40) { score += 8; reasons.push('Good shade match'); }
    else { score -= 5; reasons.push('Different shade range'); }
  }

  // Skin concern matching for skincare
  if (product.category === 'skincare' && product.ingredients) {
    const { pores, hydration, dark_spots, wrinkles } = skinAnalysis.concerns;
    if (pores > 30 && product.ingredients.includes('Niacinamide')) { score += 12; reasons.push('Targets your pore concerns'); }
    if (hydration < 70 && product.ingredients.includes('Hyaluronic Acid')) { score += 12; reasons.push('Addresses your hydration needs'); }
    if (dark_spots > 20 && product.ingredients.includes('L-Ascorbic Acid')) { score += 10; reasons.push('Brightens dark spots'); }
    if (wrinkles > 15 && product.ingredients.includes('Retinol')) { score += 10; reasons.push('Targets fine lines'); }
  }

  // Sustainability bonus
  if (product.sustainability_score > 85) { score += 5; reasons.push('Eco-friendly choice'); }
  if (product.vegan) score += 3;
  if (product.cruelty_free) score += 3;

  // Skin type matching
  if (product.tags.includes('oil-control') && skinAnalysis.skin_type === 'oily') { score += 8; }
  if (product.tags.includes('hydrating') && skinAnalysis.skin_type === 'dry') { score += 8; }

  return {
    score: Math.min(99, Math.max(40, score)),
    reason: reasons.slice(0, 2).join(' · ') || 'General compatibility',
  };
}

function hexToBrightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

// ─── AI Recommendation Engine ─────────────────────────────────────────────────

export async function getAIRecommendations(
  skinAnalysis: SkinAnalysisResult,
  category: string = 'all',
  userPreferences?: string
): Promise<Product[]> {
  // Filter catalog
  let filtered = category === 'all'
    ? PRODUCT_CATALOG
    : PRODUCT_CATALOG.filter(p => p.category === category);

  // Score all products
  const scored = filtered.map(product => ({
    ...product,
    ...scoreProductCompatibility(product, skinAnalysis),
  }));

  // Sort by compatibility
  scored.sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0));

  // Use OpenAI to further personalize if key available
  if (process.env.OPENAI_API_KEY && userPreferences) {
    try {
      const prompt = `
You are a beauty AI. Given these top products and user preferences, rerank them.

User skin: ${JSON.stringify(skinAnalysis)}
User preferences: ${userPreferences}
Products: ${JSON.stringify(scored.slice(0, 10).map(p => ({ id: p.id, name: p.name, tags: p.tags, score: p.compatibility_score })))}

Return a JSON array of product IDs in recommended order. Just the array, no explanation.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      });

      const rankedIds: string[] = JSON.parse(completion.choices[0].message.content || '[]');
      if (rankedIds.length > 0) {
        const reranked = rankedIds.map(id => scored.find(p => p.id === id)).filter(Boolean) as Product[];
        const remaining = scored.filter(p => !rankedIds.includes(p.id));
        return [...reranked, ...remaining].slice(0, 8);
      }
    } catch (e) {
      console.error('[OpenAI rerank error]', e);
    }
  }

  return scored.slice(0, 8);
}

// ─── AI Chat for Beauty Advice ────────────────────────────────────────────────

export async function getBeautyAdvice(
  message: string,
  skinAnalysis: SkinAnalysisResult,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return getMockAdvice(message);
  }

  const systemPrompt = `You are AURA, an expert AI beauty advisor. You have analyzed the user's skin:
- Skin tone: ${skinAnalysis.skin_tone.value} (${skinAnalysis.skin_tone.undertone} undertone)
- Skin type: ${skinAnalysis.skin_type}
- Skin age: ${skinAnalysis.skin_age}
- Key concerns: Pores ${skinAnalysis.concerns.pores}%, Hydration ${skinAnalysis.concerns.hydration}%, Dark spots ${skinAnalysis.concerns.dark_spots}%
- Overall score: ${skinAnalysis.overall_score}/100

Give personalized, actionable beauty advice. Be warm, expert, concise. Max 3 sentences.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message },
    ],
    max_tokens: 200,
  });

  return completion.choices[0].message.content || 'I can help you with that! Could you tell me more?';
}

function getMockAdvice(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('foundation')) return 'Based on your warm medium skin tone, I\'d recommend ILIA\'s Natural Finish in shade 15N — it matches your undertone perfectly and has SPF for daily protection. Your combination skin will love the balanced coverage.';
  if (lower.includes('moistur') || lower.includes('hydrat')) return 'Your skin analysis shows 71% hydration — adding a hyaluronic acid serum before moisturizer will boost this significantly. Layer it on damp skin for maximum absorption.';
  if (lower.includes('pore')) return 'Your pore score of 34% responds well to Niacinamide 10%. Use it morning and night after cleansing for 4 weeks — you\'ll see visible improvement.';
  return 'Your skin is in great shape overall! Your main focus should be hydration and SPF protection daily. I can recommend specific products for any of your concerns.';
}
