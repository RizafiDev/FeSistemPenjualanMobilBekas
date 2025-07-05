import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "appsdealer.rizafidev.site",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
