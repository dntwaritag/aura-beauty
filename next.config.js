/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.perfectcorp.com', 'firebasestorage.googleapis.com'],
  },
  env: {
    YOUCAM_API_KEY: process.env.YOUCAM_API_KEY,
    YOUCAM_API_SECRET: process.env.YOUCAM_API_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  }
}
module.exports = nextConfig
