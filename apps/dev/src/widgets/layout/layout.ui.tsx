import React from "react";

import { Header } from "../header";
import { Footer } from "../footer";

function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <div className="container">{children}</div>
      <Footer />
    </>
  );
}

export { Layout };
