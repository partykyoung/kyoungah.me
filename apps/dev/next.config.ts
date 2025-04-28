import type { NextConfig } from "next";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  output: "export",
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};

export default withVanillaExtract(nextConfig);
