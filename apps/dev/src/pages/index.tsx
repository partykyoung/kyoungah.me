import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";

import "@kyoungah.me/ui/build/styles/global.css";
import "@kyoungah.me/ui/build/styles/typography.css";
import "@kyoungah.me/ui/build/styles/color-palette.css";
import "../app/styles/global.css";

import { Layout } from "../widgets/layout";
import { PostPreviews } from "../features/post-previews";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <PostPreviews />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
