import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Link } from "gatsby";

import "@kyoungah.me/ui/build/styles/global.css";
import "@kyoungah.me/ui/build/styles/typography.css";
import "@kyoungah.me/ui/build/styles/color-palette.css";
import "../app/styles/global.css";

import { Button } from "../shared/button";
import { Header } from "../widgets/header";
import { Layout } from "../widgets/layout";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <Button>happy</Button>
      <Button size="medium">테스트</Button>
      <Button asChild>
        <Link to="/test">12345</Link>
      </Button>
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
