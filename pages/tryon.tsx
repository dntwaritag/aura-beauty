// pages/tryon.tsx
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type TryOnMode = 'makeup' | 'hair' | 'fashion';
type UploadStep = 'upload' | 'processing' | 'result';

const MAKEUP_PRODUCTS = [
  { id: 'lip-001', name: 'Pillow Talk', brand: 'Charlotte Tilbury', category: 'lipstick', color: '#C97B8E', price: 34 },
  { id: 'lip-002', name: 'Dragon Girl', brand: 'NARS', category: 'lipstick', color: '#B03050', price: 28 },
  { id: 'lip-003', name: 'Whirl', brand: 'MAC', category: 'lipstick', color: '#A07060', price: 22 },
  { id: 'lip-004', name: 'Myth', brand: 'MAC', category: 'lipstick', color: '#D4A090', price: 22 },
  { id: 'lip-005', name: 'Ruby Woo', brand: 'MAC', category: 'lipstick', color: '#CC2233', price: 22 },
  { id: 'lip-006', name: 'Velvet Teddy', brand: 'MAC', category: 'lipstick', color: '#B07060', price: 22 },
];

const HAIR_COLORS = [
  { id: 'hair-001', name: 'Honey Blonde', hex: '#D4A050' },
  { id: 'hair-002', name: 'Chestnut Brown', hex: '#6B3A2A' },
  { id: 'hair-003', name: 'Jet Black', hex: '#1A1A1A' },
  { id: 'hair-004', name: 'Rose Gold', hex: '#D4866E' },
  { id: 'hair-005', name: 'Burgundy', hex: '#6B1A2A' },
  { id: 'hair-006', name: 'Platinum', hex: '#E8E0D0' },
];

export default function TryOnPage() {
  const [mode, setMode] = useState<TryOnMode>('makeup');
  const [step, setStep] = useState<UploadStep>('upload');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setUserImage(ev.target?.result as string);
      setResultImage(null);
      setSelectedProduct(null);
    };
    reader.readAsDataURL(file);
  };

  const applyMakeup = async (productId: string, colorHex: string) => {
    if (!userImage) return;
    setSelectedProduct(productId);
    setLoading(true);

    try {
      const base64 = userImage.split(',')[1];
      const res = await fetch('/api/tryon/makeup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, productId, productType: 'lipstick', color: colorHex }),
      });
      const data = await res.json();
      if (data.result) {
        setResultImage(`data:image/jpeg;base64,${data.result}`);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const applyHairColor = async (colorHex: string) => {
    if (!userImage) return;
    setLoading(true);
    try {
      const base64 = userImage.split(',')[1];
      const res = await fetch('/api/tryon/hair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, colorHex }),
      });
      const data = await res.json();
      if (data.result) setResultImage(`data:image/jpeg;base64,${data.result}`);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const applyFashion = async () => {
    if (!userImage || !garmentImage) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tryon/fashion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userImage: userImage.split(',')[1], garmentImage: garmentImage.split(',')[1] }),
      });
      const data = await res.json();
      if (data.result) setResultImage(`data:image/jpeg;base64,${data.result}`);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--aura-black)', paddingTop: 80 }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--aura-rose)', textDecoration: 'none' }}>AURA</Link>
        <div style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.4)' }}>Virtual Try-On</div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: 16 }}>
            Virtual <span className="text-gradient" style={{ fontStyle: 'italic' }}>Try-On</span>
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '1rem' }}>See any look on your face before buying</p>
        </div>

        {/* Mode switcher */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
          {(['makeup', 'hair', 'fashion'] as TryOnMode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setResultImage(null); setSelectedProduct(null); }}
              style={{ padding: '8px 24px', borderRadius: 50, border: `1px solid ${mode === m ? 'var(--aura-rose)' : 'rgba(255,255,255,0.12)'}`, background: mode === m ? 'rgba(232,165,152,0.1)' : 'transparent', color: mode === m ? 'var(--aura-rose)' : 'rgba(245,240,232,0.5)', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.9rem', transition: 'all 0.2s' }}>
              {m === 'makeup' ? '💄 Makeup' : m === 'hair' ? '✂️ Hair' : '👗 Fashion'}
            </button>
          ))}
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>

          {/* Image panel */}
          <div>
            {/* Upload */}
            {!userImage ? (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 24, padding: '80px 32px', cursor: 'pointer', textAlign: 'center', gap: 16 }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <div style={{ fontSize: '3.5rem' }}>📸</div>
                <div>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', marginBottom: 8 }}>Upload your photo</p>
                  <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.9rem' }}>Front-facing, good lighting for best results</p>
                </div>
                <button className="btn-primary" style={{ marginTop: 8 }}>Choose Photo</button>
              </label>
            ) : (
              <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
                <img src={resultImage || userImage} alt="Try-on" style={{ width: '100%', display: 'block', maxHeight: 600, objectFit: 'cover' }} />

                {/* Loading overlay */}
                <AnimatePresence>
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                      <div className="scan-line" />
                      <p style={{ color: 'var(--aura-rose)', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.15em' }}>APPLYING AR...</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toolbar */}
                <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', gap: 10, justifyContent: 'center' }}>
                  {resultImage && (
                    <a href={resultImage} download="aura-tryon.jpg">
                      <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}>💾 Save Look</button>
                    </a>
                  )}
                  <button className="btn-ghost" style={{ fontSize: '0.85rem' }} onClick={() => { setUserImage(null); setResultImage(null); }}>Retake</button>
                </div>

                {/* Mode indicator */}
                <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 12px', borderRadius: 20, background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(232,165,152,0.3)', fontSize: '0.75rem', color: 'var(--aura-rose)' }}>
                  {resultImage ? '✦ AR Applied' : 'Select a product →'}
                </div>
              </div>
            )}
          </div>

          {/* Products sidebar */}
          <div>
            {mode === 'makeup' && (
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20, color: 'var(--aura-cream)' }}>Lipstick Shades</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {MAKEUP_PRODUCTS.map(product => (
                    <button key={product.id} onClick={() => applyMakeup(product.id, product.color)} disabled={!userImage || loading}
                      className="glass product-card"
                      style={{ borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: userImage ? 'pointer' : 'not-allowed', border: selectedProduct === product.id ? '1px solid var(--aura-rose)' : '1px solid rgba(255,255,255,0.08)', textAlign: 'left', background: selectedProduct === product.id ? 'rgba(232,165,152,0.08)' : 'rgba(255,255,255,0.03)', opacity: !userImage ? 0.5 : 1, width: '100%', transition: 'all 0.2s' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: product.color, flexShrink: 0, border: '2px solid rgba(255,255,255,0.15)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--aura-cream)', marginBottom: 2 }}>{product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)' }}>{product.brand} · ${product.price}</div>
                      </div>
                      {selectedProduct === product.id && <span style={{ color: 'var(--aura-rose)', fontSize: '0.75rem' }}>✦</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'hair' && (
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20 }}>Hair Colors</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {HAIR_COLORS.map(color => (
                    <button key={color.id} onClick={() => applyHairColor(color.hex)} disabled={!userImage || loading}
                      style={{ borderRadius: 12, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: userImage ? 'pointer' : 'not-allowed', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s', opacity: !userImage ? 0.5 : 1 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: color.hex, border: '2px solid rgba(255,255,255,0.2)' }} />
                      <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.6)', textAlign: 'center' }}>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'fashion' && (
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 16 }}>Fashion Try-On</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.5)', marginBottom: 20, lineHeight: 1.6 }}>Upload a garment image to virtually try it on.</p>
                <label style={{ display: 'block', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 16, padding: '32px 16px', textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => setGarmentImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }} style={{ display: 'none' }} />
                  {garmentImage ? (
                    <img src={garmentImage} alt="Garment" style={{ width: '100%', borderRadius: 12, marginBottom: 8 }} />
                  ) : (
                    <>
                      <div style={{ fontSize: '2rem', marginBottom: 8 }}>👗</div>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.5)' }}>Upload garment photo</p>
                    </>
                  )}
                </label>
                {garmentImage && (
                  <button className="btn-primary" style={{ width: '100%' }} onClick={applyFashion} disabled={!userImage || loading}>
                    {loading ? 'Applying...' : 'Try It On ✦'}
                  </button>
                )}
              </div>
            )}

            {/* Tip */}
            <div style={{ marginTop: 24, padding: '16px', borderRadius: 14, background: 'rgba(232,165,152,0.06)', border: '1px solid rgba(232,165,152,0.15)' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--aura-rose)' }}>💡 Tip:</span> For best results, use a front-facing photo with neutral expression and good lighting.
              </p>
            </div>

            <Link href="/recommendations">
              <button className="btn-ghost" style={{ width: '100%', marginTop: 16, fontSize: '0.875rem' }}>
                View AI Recommendations →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
