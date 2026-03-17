import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Turbopack configuration for Next.js 16
  turbopack: {},
  
  // Bundle size optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
};

export default nextConfig;
