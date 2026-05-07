// pages/index.tsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const TAGLINES = [
  'Your skin, decoded.',
  'Try before you buy.',
  'Beauty, personalized.',
  'See yourself, perfected.',
];

export default function Home() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(i => (i + 1) % TAGLINES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Intersection observer for fade-in sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.fade-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--aura-black)' }}>

      {/* ── Nav ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--aura-rose)' }}>
          AURA
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Analyze', 'Try-On', 'Recommendations', 'About'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`}
              style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.6)', textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--aura-cream)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.6)')}>
              {item}
            </Link>
          ))}
        </div>
        <Link href="/analyze">
          <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 20px' }}>
            Start Free Analysis
          </button>
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center min-h-screen text-center px-6"
        style={{ paddingTop: '80px' }}>

        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,165,152,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 50, border: '1px solid rgba(232,165,152,0.3)', marginBottom: 32, fontSize: '0.75rem', color: 'var(--aura-rose)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--aura-rose)', display: 'inline-block', animation: 'glowPulse 2s ease infinite' }} />
          Powered by Perfect Corp YouCam APIs
        </motion.div>

        {/* Main headline */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: 16, maxWidth: 900 }}>
          The AI that
          <span className="text-gradient" style={{ display: 'block', fontStyle: 'italic' }}>
            knows your skin.
          </span>
        </motion.h1>

        {/* Animated tagline */}
        <div style={{ height: 40, marginBottom: 40 }}>
          <AnimatePresence mode="wait">
            <motion.p key={taglineIndex}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: '1.25rem', color: 'rgba(245,240,232,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
              {TAGLINES[taglineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/analyze">
            <button className="btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
              Analyze My Skin ✦
            </button>
          </Link>
          <Link href="/tryon">
            <button className="btn-ghost" style={{ fontSize: '1rem', padding: '14px 36px' }}>
              Try On Products
            </button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: 48, marginTop: 80, paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[['14', 'Skin parameters analyzed'], ['< 2s', 'Analysis time'], ['94%', 'Recommendation accuracy'], ['6', 'YouCam APIs integrated']].map(([num, label]) => (
            <div key={num} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--aura-rose)' }}>{num}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.05em', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features Grid ─────────────────────────────── */}
      <section className="fade-section px-6 py-32 max-w-6xl mx-auto">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 16 }}>
            One platform.<br /><span className="text-gradient">Every beauty need.</span>
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>
            AURA combines AI skin science with real-time AR to make beauty personal.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {FEATURES.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="glass product-card" style={{ borderRadius: 20, padding: '32px 28px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>{feature.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', marginBottom: 12, color: 'var(--aura-cream)' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {feature.description}
              </p>
              <div style={{ marginTop: 20, fontSize: '0.75rem', color: 'var(--aura-rose)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {feature.api}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section className="fade-section px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 64 }}>
            How AURA works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {STEPS.map((step, i) => (
              <div key={step.title} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--aura-rose), var(--aura-gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--aura-black)' }}>
                  {i + 1}
                </div>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 10 }}>{step.title}</h4>
                <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '0.875rem', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────── */}
      <section className="fade-section px-6 py-32 text-center">
        <div className="glass" style={{ maxWidth: 700, margin: '0 auto', borderRadius: 32, padding: '64px 48px', background: 'linear-gradient(135deg, rgba(232,165,152,0.08), rgba(201,169,110,0.06))' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 20 }}>
            Ready to meet <em>your</em> AURA?
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.55)', marginBottom: 36, fontSize: '1.05rem' }}>
            Free skin analysis in under 2 seconds. No account required.
          </p>
          <Link href="/analyze">
            <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 48px' }}>
              Start My Free Analysis
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: 'var(--aura-rose)', marginBottom: 12, fontStyle: 'italic' }}>AURA</div>
        <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.3)' }}>
          Built for The Silicon Valley Hackathon: Perfect Corp × Startup World Cup · Powered by YouCam APIs
        </p>
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: '🔬', title: 'AI Skin Analysis', description: 'Upload a selfie and AURA maps 14 skin parameters — tone, texture, hydration, pores, dark spots, and more — in under 2 seconds.', api: 'YouCam Skin Analysis API' },
  { icon: '💄', title: 'AR Makeup Try-On', description: 'Try any lipstick, eyeshadow, or foundation on your face in real-time. No app download, no lag, just pure AR magic in your browser.', api: 'YouCam AR Makeup API' },
  { icon: '👗', title: 'Fashion Try-On', description: 'Virtual wardrobe powered by AI. Upload any outfit and see yourself wearing it instantly, with accurate draping and color rendering.', api: 'YouCam Fashion Try-On API' },
  { icon: '🤖', title: 'AI Recommendations', description: 'Every product recommendation is scored against your unique beauty fingerprint. Your shade match, your skin type, your values.', api: 'OpenAI GPT-4o + Custom Engine' },
  { icon: '🌿', title: 'Sustainability Scoring', description: 'Every product shows its eco score, cruelty-free and vegan status. Shop beautifully and responsibly.', api: 'Proprietary Scoring Model' },
  { icon: '📊', title: 'Beauty Analytics', description: 'Track your skin health over time. See what\'s improving, what needs attention, and get monthly skin reports.', api: 'Firebase + Custom Analytics' },
];

const STEPS = [
  { title: 'Upload your selfie', desc: 'A clear photo in good lighting is all AURA needs to begin.' },
  { title: 'Get your skin profile', desc: 'AI analyzes 14 skin parameters and builds your unique beauty fingerprint.' },
  { title: 'Try products virtually', desc: 'AR overlays products matched to your skin tone in real time.' },
  { title: 'Shop with confidence', desc: 'Buy only what you\'ve seen on your own face. Returns become rare.' },
];
