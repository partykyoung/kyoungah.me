import React from "react";

import { Header } from "../header";
import { Footer } from "../footer";

import * as style from "./layout.ui.css";

function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <div className={style.root}>{children}</div>
      <Footer />
    </>
  );
}

export { Layout };
