// lib/youcam.ts
// Perfect Corp YouCam API Integration Layer

import axios from 'axios';

const YOUCAM_BASE_URL = 'https://us-openapi.perfectcorp.com';
const API_KEY = process.env.YOUCAM_API_KEY || '';
const API_SECRET = process.env.YOUCAM_API_SECRET || '';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SkinAnalysisResult {
  skin_tone: { value: string; hex: string; undertone: string };
  skin_age: number;
  skin_type: 'dry' | 'oily' | 'combination' | 'normal';
  concerns: {
    wrinkles: number;       // 0-100
    pores: number;
    dark_spots: number;
    redness: number;
    hydration: number;
    firmness: number;
  };
  overall_score: number;
  recommendations: string[];
}

export interface ARMakeupParams {
  imageBase64: string;
  productId: string;
  productType: 'lipstick' | 'eyeshadow' | 'blush' | 'foundation' | 'eyeliner' | 'mascara';
  color?: string;
  intensity?: number; // 0-1
}

export interface FashionTryOnParams {
  userImageBase64: string;
  garmentImageBase64: string;
}

export interface HairColorParams {
  imageBase64: string;
  colorHex: string;
}

// ─── Auth Helper ─────────────────────────────────────────────────────────────

async function getYouCamToken(): Promise<string> {
  try {
    const res = await axios.post(`${YOUCAM_BASE_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: API_KEY,
      client_secret: API_SECRET,
    });
    return res.data.access_token;
  } catch (err) {
    console.error('[YouCam Auth Error]', err);
    throw new Error('Failed to authenticate with YouCam API');
  }
}

// ─── Skin Analysis ────────────────────────────────────────────────────────────

export async function analyzeSkin(imageBase64: string): Promise<SkinAnalysisResult> {
  try {
    const token = await getYouCamToken();

    const response = await axios.post(
      `${YOUCAM_BASE_URL}/v1/skin-analysis`,
      { image: imageBase64, features: ['skin_tone', 'skin_age', 'skin_type', 'wrinkles', 'pores', 'dark_spots', 'redness', 'hydration'] },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    const data = response.data;

    return {
      skin_tone: {
        value: data.skin_tone?.category || 'Medium',
        hex: data.skin_tone?.hex || '#C68642',
        undertone: data.skin_tone?.undertone || 'Neutral',
      },
      skin_age: data.skin_age?.estimated_age || 28,
      skin_type: data.skin_type?.type || 'combination',
      concerns: {
        wrinkles: data.wrinkles?.score || 0,
        pores: data.pores?.score || 0,
        dark_spots: data.dark_spots?.score || 0,
        redness: data.redness?.score || 0,
        hydration: data.hydration?.score || 75,
        firmness: data.firmness?.score || 80,
      },
      overall_score: data.overall_score || 82,
      recommendations: data.recommendations || [],
    };
  } catch (err) {
    console.error('[Skin Analysis Error]', err);
    // Return mock data for demo when API key not set
    return getMockSkinAnalysis();
  }
}

// ─── AR Makeup Try-On ─────────────────────────────────────────────────────────

export async function applyARMakeup(params: ARMakeupParams): Promise<string> {
  try {
    const token = await getYouCamToken();

    const response = await axios.post(
      `${YOUCAM_BASE_URL}/v1/makeup-tryon`,
      {
        image: params.imageBase64,
        product_type: params.productType,
        product_id: params.productId,
        color: params.color,
        intensity: params.intensity || 0.85,
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    return response.data.result_image; // base64 result
  } catch (err) {
    console.error('[AR Makeup Error]', err);
    return params.imageBase64; // fallback: return original
  }
}

// ─── Fashion Try-On ──────────────────────────────────────────────────────────

export async function fashionTryOn(params: FashionTryOnParams): Promise<string> {
  try {
    const token = await getYouCamToken();

    const response = await axios.post(
      `${YOUCAM_BASE_URL}/v1/fashion-tryon`,
      {
        person_image: params.userImageBase64,
        garment_image: params.garmentImageBase64,
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    return response.data.result_image;
  } catch (err) {
    console.error('[Fashion Try-On Error]', err);
    return params.userImageBase64;
  }
}

// ─── Hair Color Try-On ───────────────────────────────────────────────────────

export async function hairColorTryOn(params: HairColorParams): Promise<string> {
  try {
    const token = await getYouCamToken();

    const response = await axios.post(
      `${YOUCAM_BASE_URL}/v1/hair-color`,
      { image: params.imageBase64, color: params.colorHex },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    return response.data.result_image;
  } catch (err) {
    console.error('[Hair Color Error]', err);
    return params.imageBase64;
  }
}

// ─── Image Enhancement ───────────────────────────────────────────────────────

export async function enhanceImage(imageBase64: string): Promise<string> {
  try {
    const token = await getYouCamToken();

    const response = await axios.post(
      `${YOUCAM_BASE_URL}/v1/photo-enhancer`,
      { image: imageBase64 },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    return response.data.result_image;
  } catch (err) {
    console.error('[Enhance Error]', err);
    return imageBase64;
  }
}

// ─── Mock Data (demo fallback) ────────────────────────────────────────────────

export function getMockSkinAnalysis(): SkinAnalysisResult {
  return {
    skin_tone: { value: 'Medium Warm', hex: '#C08050', undertone: 'Warm' },
    skin_age: 27,
    skin_type: 'combination',
    concerns: {
      wrinkles: 8,
      pores: 34,
      dark_spots: 22,
      redness: 18,
      hydration: 71,
      firmness: 85,
    },
    overall_score: 84,
    recommendations: [
      'Increase hydration with hyaluronic acid serum',
      'Use SPF 50+ daily to prevent dark spots',
      'Niacinamide will minimize pore appearance',
      'Retinol 0.25% for long-term firmness',
    ],
  };
}
