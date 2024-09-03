/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL
    }
}

module.exports = nextConfig
