import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ADMIN_USER: process.env.ADMIN_USER,
    NEXT_PUBLIC_ADMIN_PASS: process.env.ADMIN_PASS,
  },
  images: {
    domains: ['res.cloudinary.com',
      'your-domain.com'], // Add your image domains here
  },
};

export default nextConfig;
