import React from "react";

import { Header } from "../header";
// import { Footer } from "../footer";
// import { BasicLayout } from "../basic-layout";

function DefaultLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <div className="container">{children}</div>
      {/* <BasicLayout>{children}</BasicLayout> */}
      {/* <Footer /> */}
    </>
  );
}

export { DefaultLayout };
