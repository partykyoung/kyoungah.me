import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import rehypeExpressiveCode from "rehype-expressive-code";

const withVanillaExtract = createVanillaExtractPlugin();

const rehypeExpressiveCodeOptions = {
  themes: ["min-dark", "min-light"],
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [[rehypeExpressiveCode, rehypeExpressiveCodeOptions]],
  },
});

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
        search: "",
      },
    ],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};

export default withVanillaExtract(withMDX(nextConfig));
