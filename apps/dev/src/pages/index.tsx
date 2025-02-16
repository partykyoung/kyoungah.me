import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";

import "@kyoungah.me/ui/build/styles/global.css";
import "@kyoungah.me/ui/build/styles/typography.css";
import "@kyoungah.me/ui/build/styles/color-palette.css";
import "../app/styles/global.css";

import { Layout } from "../widgets/layout";

import {
  PostPreview,
  PostPreviewExcerpt,
  PostPreviewTitle,
} from "@kyoungah.me/ui/build/components/post-preview";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <PostPreview>
        <PostPreviewTitle>포스트 제목</PostPreviewTitle>
        <PostPreviewExcerpt>포스트 내용</PostPreviewExcerpt>
      </PostPreview>
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
