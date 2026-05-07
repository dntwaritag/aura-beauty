# AURA — AI Universal Retail & Beauty Assistant

 *Your skin, decoded. Your style, perfected.*

Built for **The Silicon Valley Hackathon: Perfect Corp × Startup World Cup**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/aura-beauty)

---

## What is AURA?

AURA is an AI-powered beauty and retail platform that eliminates guesswork in online shopping through:

-  **AI Skin Analysis** — 14-parameter skin analysis in under 2 seconds (YouCam Skin Analysis API)
-  **Real-time AR Makeup** — Virtual try-on for lipstick, eyeshadow, foundation, more (YouCam AR Makeup API)
-  **Fashion Try-On** — Virtually wear outfits before buying (YouCam Fashion API)
-  **Hair Color Try-On** — See any hair color on yourself (YouCam Hair Color API)
-  **AI Recommendations** — Products ranked by skin compatibility score (OpenAI GPT-4o + custom engine)
-  **Sustainability Scoring** — Eco, cruelty-free, and vegan ratings on every product
-  **AI Beauty Advisor** — Chat with your personal AI beauty expert

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/aura-beauty.git
cd aura-beauty

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your API keys (see below)

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

---

## API Keys Setup

### Perfect Corp YouCam API (Required)
1. Go to [docs.perfectcorp.com](https://docs.perfectcorp.com)
2. Create an account and get your API key + secret
3. Add to `.env.local`:
```
YOUCAM_API_KEY=your_key
YOUCAM_API_SECRET=your_secret
```
> **Hackathon participants**: Redeem your 1,000 free API units using the workshop link provided by Perfect Corp.

### OpenAI (Optional - enhances recommendations & chat)
```
OPENAI_API_KEY=your_openai_key
```
> Without this key, AURA falls back to rule-based recommendations (still works great for the demo).

### Firebase (Optional - enables user accounts & history)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```
> Without Firebase, AURA works in stateless demo mode.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    AURA Frontend                    │
│           Next.js 14 + TypeScript + Tailwind         │
└────────────────────────┬────────────────────────────┘
                         │ API calls
┌────────────────────────▼────────────────────────────┐
│                  Next.js API Routes                 │
│  /api/analyze  /api/tryon/*  /api/chat  /api/recs   │
└───────┬──────────────────┬──────────────────┬───────┘
        │                  │                  │
┌───────▼──────┐  ┌────────▼──────┐  ┌───────▼──────┐
│ Perfect Corp │  │   OpenAI      │  │   Firebase   │
│ YouCam APIs  │  │   GPT-4o-mini │  │  Firestore   │
│              │  │               │  │  + Storage   │
│ • Skin       │  │ • Recs AI     │  │              │
│ • AR Makeup  │  │ • Chat        │  │ • User data  │
│ • Fashion    │  │               │  │ • Skin hist  │
│ • Hair Color │  │               │  │              │
└──────────────┘  └───────────────┘  └──────────────┘
```

##  Project Structure

```
AURA/aura/
├── pages/
│   ├── index.tsx          # Landing page
│   ├── analyze.tsx        # Skin analysis flow
│   ├── tryon.tsx          # AR try-on (makeup/hair/fashion)
│   ├── recommendations.tsx # AI product recommendations
│   ├── _app.tsx           # App wrapper
│   └── api/
│       ├── analyze.ts     # Skin analysis API
│       ├── chat.ts        # AI beauty advisor
│       ├── recommendations.ts
│       └── tryon/
│           ├── makeup.ts  # AR makeup
│           ├── hair.ts    # Hair color
│           └── fashion.ts # Fashion try-on
├── lib/
│   ├── youcam.ts          # Perfect Corp API integration
│   ├── recommendations.ts # AI engine + product catalog
│   └── firebase.ts        # Firebase config
├── styles/
│   └── globals.css        # Design system
├── .env.example
└── README.md
```

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard or:
vercel env add YOUCAM_API_KEY
vercel env add YOUCAM_API_SECRET
vercel env add OPENAI_API_KEY
```

Or click the button at the top of this README for one-click deploy.

---

## Perfect Corp YouCam APIs Used

| API | Usage in AURA |
|-----|--------------|
| Skin Analysis | Core skin fingerprint — tone, type, concerns |
| Face Analysis | Product compatibility scoring |
| AR Makeup Try-On | Real-time lipstick, eyeshadow, foundation |
| Hair Color Try-On | Virtual hair color preview |
| Fashion Try-On | Virtual outfit wearing |
| Image Enhancement | Pre-processing user photos for best results |

---

##  Key Technical Innovations

1. **Skin Compatibility Engine** — Custom algorithm scoring 14 skin parameters against product attributes for personalized ranking
2. **Sub-150ms AR** — Optimized image pre-processing + YouCam's WebGL rendering pipeline
3. **Multi-modal AI** — Skin analysis feeds OpenAI for language-model recommendations
4. **Stateless demo mode** — Full experience without accounts (uses mock data fallback)

---

##  Sustainability Features

Every product in AURA's catalog includes:
- Eco score (0-100)
- Cruelty-free certification status
- Vegan formula flag
- Brand sustainability practices

Users can filter and sort by these values — AURA actively surfaces the most responsible choices.

---

##  Roadmap

- [ ] Native iOS/Android app
- [ ] Live video AR (real-time camera try-on)
- [ ] B2B white-label SDK
- [ ] Dermatologist integration
- [ ] Social sharing ("Share my AURA look")
- [ ] Skincare progress photo tracking

---

##  Built With

- [Perfect Corp YouCam API](https://docs.perfectcorp.com)
- [Next.js](https://nextjs.org)
- [OpenAI GPT-4o](https://openai.com)
- [Firebase](https://firebase.google.com)
- [Framer Motion](https://framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com)

---

*AURA — Built for The Silicon Valley Hackathon 2026. Powered by Perfect Corp YouCam APIs.*
