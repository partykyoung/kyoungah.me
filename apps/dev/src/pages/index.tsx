import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Link } from "gatsby";

import "@kyoungah.me/ui/build/styles/global.css";
import "@kyoungah.me/ui/build/styles/typography.css";
import "@kyoungah.me/ui/build/styles/color-palette.css";
import "../app/styles/global.css";

import { Button } from "../shared/button";
import { Header } from "../widgets/header/header.ui";
import { DefaultLayout } from "../widgets/layout/layout.ui";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <DefaultLayout>
      <Button>happy</Button>
      <Button size="medium">테스트</Button>
      <Button asChild>
        <Link to="/test">12345</Link>
      </Button>
    </DefaultLayout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
