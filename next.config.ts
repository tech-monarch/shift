import type { NextConfig } from "next";

import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // We'll leave experimental empty to stop the TS errors 
  // since you are forcing Webpack via the terminal command anyway
  experimental: {}, 
};

export default withPWA(nextConfig);