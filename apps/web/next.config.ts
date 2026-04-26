import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./next-intl.config.ts");

const nextConfig: NextConfig = {
  webpack(config) {
    // Integrate SVGR to handle SVG files as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    // Configure remote patterns for authorized image optimization via API assets
    remotePatterns: [
      {
        protocol: (process.env.NEXT_PUBLIC_API_PROTOCOL as "http" | "https") || "http",
        port: process.env.NEXT_PUBLIC_API_PORT,
        hostname: process.env.NEXT_PUBLIC_API_HOSTNAME,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);