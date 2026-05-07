// pages/analyze.tsx
import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type AnalysisState = 'idle' | 'uploading' | 'scanning' | 'done';

interface SkinData {
  skin_tone: { value: string; hex: string; undertone: string };
  skin_age: number;
  skin_type: string;
  concerns: Record<string, number>;
  overall_score: number;
  recommendations: string[];
}

export default function AnalyzePage() {
  const [state, setState] = useState<AnalysisState>('idle');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [skinData, setSkinData] = useState<SkinData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scanProgress = useRef(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(',')[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const runAnalysis = async () => {
    if (!imageBase64) return;
    setState('uploading');
    setError(null);

    try {
      setState('scanning');
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      setSkinData(data);
      setState('done');
    } catch (err) {
      setError('Analysis failed. Please try with a clearer photo.');
      setState('idle');
    }
  };

  const CONCERN_LABELS: Record<string, string> = {
    hydration: 'Hydration',
    firmness: 'Firmness',
    pores: 'Pores',
    dark_spots: 'Dark Spots',
    redness: 'Redness',
    wrinkles: 'Fine Lines',
  };

  const getConcernColor = (key: string, val: number) => {
    if (['hydration', 'firmness'].includes(key)) return val > 70 ? '#8BAF8D' : val > 50 ? '#C9A96E' : '#E8A598';
    return val < 20 ? '#8BAF8D' : val < 40 ? '#C9A96E' : '#E8A598';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--aura-black)', paddingTop: 80 }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--aura-rose)', textDecoration: 'none' }}>AURA</Link>
        <div style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.4)' }}>Skin Analysis</div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 16 }}>
            Your Skin<br /><span className="text-gradient" style={{ fontStyle: 'italic' }}>Fingerprint</span>
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '1.05rem' }}>
            Upload a selfie — our AI analyzes 14 skin parameters in seconds
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: state === 'done' ? '1fr 1fr' : '1fr', gap: 32, maxWidth: state === 'done' ? '100%' : 600, margin: '0 auto', transition: 'all 0.5s ease' }}>

          {/* Upload / Preview Panel */}
          <motion.div layout>
            {!imagePreview ? (
              <div {...getRootProps()} style={{ border: `2px dashed ${isDragActive ? 'var(--aura-rose)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 24, padding: '64px 32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', background: isDragActive ? 'rgba(232,165,152,0.05)' : 'transparent' }}>
                <input {...getInputProps()} />
                <div style={{ fontSize: '3rem', marginBottom: 20 }}>📸</div>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', marginBottom: 12 }}>
                  {isDragActive ? 'Drop your photo here' : 'Upload your selfie'}
                </p>
                <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.875rem', marginBottom: 24 }}>
                  JPG, PNG or WebP · Max 10MB · Front-facing, good lighting
                </p>
                <button className="btn-primary">Choose Photo</button>
              </div>
            ) : (
              <div className="glass-light" style={{ borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
                <img src={imagePreview} alt="Your photo" style={{ width: '100%', display: 'block', maxHeight: 480, objectFit: 'cover' }} />

                {/* Scan overlay */}
                <AnimatePresence>
                  {state === 'scanning' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                      <div className="scan-line" />
                      {/* Corner brackets */}
                      {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
                        <div key={`${v}${h}`} style={{ position: 'absolute', [v]: 24, [h]: 24, width: 32, height: 32, borderTop: v === 'top' ? '2px solid var(--aura-rose)' : 'none', borderBottom: v === 'bottom' ? '2px solid var(--aura-rose)' : 'none', borderLeft: h === 'left' ? '2px solid var(--aura-rose)' : 'none', borderRight: h === 'right' ? '2px solid var(--aura-rose)' : 'none' }} />
                      ))}
                      <p style={{ color: 'var(--aura-rose)', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', letterSpacing: '0.15em' }}>ANALYZING SKIN...</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['Tone', 'Texture', 'Pores', 'Hydration'].map(label => (
                          <span key={label} style={{ fontSize: '0.65rem', padding: '3px 8px', border: '1px solid rgba(232,165,152,0.4)', borderRadius: 20, color: 'var(--aura-rose)', letterSpacing: '0.08em' }}>{label}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions overlay */}
                {state === 'idle' && (
                  <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={runAnalysis}>Analyze This Photo ✦</button>
                    <button className="btn-ghost" style={{ fontSize: '0.85rem' }} onClick={() => { setImagePreview(null); setImageBase64(null); }}>Retake</button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <p style={{ color: '#E8A598', textAlign: 'center', marginTop: 16, fontSize: '0.9rem' }}>{error}</p>
            )}
          </motion.div>

          {/* Results Panel */}
          <AnimatePresence>
            {state === 'done' && skinData && (
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>

                {/* Score card */}
                <div className="glass" style={{ borderRadius: 24, padding: 32, marginBottom: 20, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
                    {/* Score circle */}
                    <div style={{ position: 'relative', width: 100, height: 100 }}>
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - skinData.overall_score / 100)}`}
                          transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="var(--aura-rose)" />
                            <stop offset="100%" stopColor="var(--aura-gold)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--aura-cream)', lineHeight: 1 }}>{skinData.overall_score}</span>
                        <span style={{ fontSize: '0.6rem', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.1em' }}>/ 100</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', marginBottom: 6 }}>Skin Score</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(139,175,141,0.4)', color: 'var(--aura-sage)' }}>{skinData.skin_type}</span>
                        <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(232,165,152,0.3)', color: 'var(--aura-rose)' }}>Age ~{skinData.skin_age}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skin tone swatch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: skinData.skin_tone.hex, border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{skinData.skin_tone.value}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)' }}>{skinData.skin_tone.undertone} undertone</div>
                    </div>
                  </div>
                </div>

                {/* Skin concerns */}
                <div className="glass" style={{ borderRadius: 24, padding: 28, marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20 }}>Skin Analysis</h3>
                  {Object.entries(skinData.concerns).map(([key, val]) => (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.6)' }}>{CONCERN_LABELS[key] || key}</span>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'DM Mono, monospace', color: getConcernColor(key, val) }}>{val}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1, delay: 0.2 }}
                          style={{ height: '100%', borderRadius: 2, background: getConcernColor(key, val) }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="glass" style={{ borderRadius: 24, padding: 28, marginBottom: 24 }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 16 }}>Your Skin Rx</h3>
                  {skinData.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <span style={{ color: 'var(--aura-rose)', flexShrink: 0, marginTop: 2 }}>✦</span>
                      <span style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.6 }}>{rec}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <Link href={`/recommendations?from=analyze`} style={{ flex: 1 }}>
                    <button className="btn-primary" style={{ width: '100%' }}>See My Products ✦</button>
                  </Link>
                  <Link href="/tryon" style={{ flex: 1 }}>
                    <button className="btn-ghost" style={{ width: '100%' }}>Try On Products</button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
