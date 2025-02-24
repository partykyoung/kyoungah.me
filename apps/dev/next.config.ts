import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["md", "ts", "tsx"],
};

export default withVanillaExtract(withMDX(nextConfig));
