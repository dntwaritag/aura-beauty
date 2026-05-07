// pages/recommendations.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CATEGORIES = ['all', 'lipstick', 'foundation', 'skincare', 'eyeshadow'];

const DEMO_PRODUCTS = [
  { id: 'skn-002', name: 'Vitamin C Glow Serum', brand: 'Drunk Elephant', category: 'skincare', price: 78, compatibility_score: 96, compatibility_reason: 'Targets dark spots · Brightening for warm undertones', sustainability_score: 80, cruelty_free: true, vegan: true, tags: ['brightening', 'anti-aging', 'clean'], shadeHex: null },
  { id: 'skn-003', name: 'Niacinamide 10% + Zinc', brand: 'The Ordinary', category: 'skincare', price: 8, compatibility_score: 94, compatibility_reason: 'Targets your pore concerns · Oil-control', sustainability_score: 90, cruelty_free: true, vegan: true, tags: ['pores', 'oil-control', 'affordable'], shadeHex: null },
  { id: 'fnd-001', name: "Pro Filt'r Foundation", brand: 'Fenty Beauty', category: 'foundation', price: 38, compatibility_score: 91, compatibility_reason: 'Excellent shade match · Full coverage for combination skin', sustainability_score: 78, cruelty_free: true, vegan: true, tags: ['inclusive', 'matte', 'full-coverage'], shadeHex: '#C49A6C' },
  { id: 'lip-001', name: 'Velvet Lip Mousse', brand: 'Charlotte Tilbury', category: 'lipstick', price: 34, compatibility_score: 89, compatibility_reason: 'Complements warm undertone · Hydrating formula', sustainability_score: 72, cruelty_free: true, vegan: false, tags: ['bestseller', 'matte', 'hydrating'], shadeHex: '#C97B8E' },
  { id: 'fnd-002', name: 'Natural Finish Foundation', brand: 'ILIA', category: 'foundation', price: 54, compatibility_score: 87, compatibility_reason: 'SPF protection · Clean ingredients', sustainability_score: 94, cruelty_free: true, vegan: true, tags: ['clean', 'skin-first', 'spf'], shadeHex: '#D4A882' },
  { id: 'skn-004', name: 'Retinol 0.3% Serum', brand: "Paula's Choice", category: 'skincare', price: 42, compatibility_score: 85, compatibility_reason: 'Targets fine lines · Peptide complex', sustainability_score: 76, cruelty_free: true, vegan: true, tags: ['anti-aging', 'firmness', 'science-backed'], shadeHex: null },
  { id: 'lip-002', name: 'Satin Lip Color', brand: 'NARS', category: 'lipstick', price: 28, compatibility_score: 82, compatibility_reason: 'Good shade match · Long-wearing', sustainability_score: 68, cruelty_free: true, vegan: true, tags: ['bold', 'satin', 'longwear'], shadeHex: '#B03050' },
  { id: 'eye-001', name: 'Mini Eyeshadow Palette', brand: 'Urban Decay', category: 'eyeshadow', price: 29, compatibility_score: 79, compatibility_reason: 'Neutral tones complement warm undertone', sustainability_score: 65, cruelty_free: true, vegan: false, tags: ['neutral', 'beginner-friendly', 'pigmented'], shadeHex: '#C9956E' },
];

export default function RecommendationsPage() {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'compatibility' | 'price' | 'sustainability'>('compatibility');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AURA beauty advisor. I\'ve analyzed your skin and I\'m ready to help you find your perfect products. What are you looking for today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const filtered = DEMO_PRODUCTS
    .filter(p => category === 'all' || p.category === category)
    .sort((a, b) => {
      if (sortBy === 'compatibility') return b.compatibility_score - a.compatibility_score;
      if (sortBy === 'price') return a.price - b.price;
      return b.sustainability_score - a.sustainability_score;
    });

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had a moment there. Try asking again!' }]);
    }
    setChatLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--aura-black)', paddingTop: 80 }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--aura-rose)', textDecoration: 'none' }}>AURA</Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/analyze" style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.5)', textDecoration: 'none' }}>Analyze</Link>
          <Link href="/tryon" style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.5)', textDecoration: 'none' }}>Try-On</Link>
          <button onClick={() => setChatOpen(o => !o)} className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 18px' }}>
            💬 Ask AURA
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 8 }}>
            Your <span className="text-gradient" style={{ fontStyle: 'italic' }}>Perfect Match</span>
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '0.95rem' }}>
            Products ranked by compatibility with your skin analysis
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ padding: '6px 18px', borderRadius: 50, border: `1px solid ${category === cat ? 'var(--aura-rose)' : 'rgba(255,255,255,0.1)'}`, background: category === cat ? 'rgba(232,165,152,0.1)' : 'transparent', color: category === cat ? 'var(--aura-rose)' : 'rgba(245,240,232,0.5)', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'capitalize', transition: 'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', color: 'var(--aura-cream)', fontSize: '0.8rem', cursor: 'pointer' }}>
            <option value="compatibility">Sort: Best Match</option>
            <option value="price">Sort: Price ↑</option>
            <option value="sustainability">Sort: Eco Score</option>
          </select>
        </div>

        {/* Products grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass product-card" style={{ borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>

              {/* Compatibility badge */}
              <div style={{ position: 'absolute', top: 16, right: 16, background: product.compatibility_score >= 90 ? 'rgba(139,175,141,0.15)' : product.compatibility_score >= 80 ? 'rgba(201,169,110,0.15)' : 'rgba(232,165,152,0.1)', border: `1px solid ${product.compatibility_score >= 90 ? 'rgba(139,175,141,0.4)' : product.compatibility_score >= 80 ? 'rgba(201,169,110,0.4)' : 'rgba(232,165,152,0.3)'}`, borderRadius: 50, padding: '3px 10px', fontSize: '0.7rem', color: product.compatibility_score >= 90 ? 'var(--aura-sage)' : product.compatibility_score >= 80 ? 'var(--aura-gold)' : 'var(--aura-rose)', fontFamily: 'DM Mono, monospace' }}>
                {product.compatibility_score}% match
              </div>

              {/* Shade swatch or category icon */}
              <div style={{ width: 48, height: 48, borderRadius: product.shadeHex ? '50%' : 12, background: product.shadeHex || 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {!product.shadeHex && (product.category === 'skincare' ? '🌿' : product.category === 'eyeshadow' ? '✨' : '💄')}
              </div>

              <div style={{ marginBottom: 6 }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', marginBottom: 2, paddingRight: 70 }}>{product.name}</h3>
                <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)' }}>{product.brand}</p>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', lineHeight: 1.5, marginBottom: 16 }}>
                {product.compatibility_reason}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {product.cruelty_free && <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20, background: 'rgba(139,175,141,0.1)', color: 'var(--aura-sage)', border: '1px solid rgba(139,175,141,0.2)' }}>🐰 Cruelty-Free</span>}
                {product.vegan && <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20, background: 'rgba(139,175,141,0.1)', color: 'var(--aura-sage)', border: '1px solid rgba(139,175,141,0.2)' }}>🌱 Vegan</span>}
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20, background: 'rgba(201,169,110,0.1)', color: 'var(--aura-gold)', border: '1px solid rgba(201,169,110,0.2)' }}>Eco {product.sustainability_score}</span>
              </div>

              {/* Bottom row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: 'var(--aura-cream)' }}>${product.price}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/tryon?product=${product.id}`}>
                    <button style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(232,165,152,0.3)', background: 'transparent', color: 'var(--aura-rose)', fontSize: '0.75rem', cursor: 'pointer' }}>Try On</button>
                  </Link>
                  <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>Add to Bag</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat sidebar */}
      <motion.div animate={{ x: chatOpen ? 0 : 400 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(30px)', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', zIndex: 100 }}>

        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--aura-rose)' }}>AURA Advisor</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginTop: 2 }}>AI Beauty Expert</div>
          </div>
          <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: msg.role === 'user' ? 'linear-gradient(135deg, var(--aura-rose), var(--aura-gold))' : 'rgba(255,255,255,0.06)', color: msg.role === 'user' ? 'var(--aura-black)' : 'var(--aura-cream)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {msg.content}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div style={{ display: 'flex', gap: 6, padding: '10px 14px' }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--aura-rose)', animation: `float ${0.6 + i * 0.2}s ease-in-out infinite` }} />)}
            </div>
          )}
        </div>

        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()}
            placeholder="Ask about your skin or products..."
            style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, padding: '10px 16px', color: 'var(--aura-cream)', fontSize: '0.875rem', outline: 'none' }} />
          <button onClick={sendChat} className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.875rem' }}>→</button>
        </div>
      </motion.div>
    </div>
  );
}
