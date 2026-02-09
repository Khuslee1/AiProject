import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  },
};

export default nextConfig;
