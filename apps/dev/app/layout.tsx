import { Roboto, Noto_Sans_KR, Fira_Code } from "next/font/google";

import "@kyoungah.me/ui/build/styles/global.css";
import "@kyoungah.me/ui/build/styles/typography.css";
import "@kyoungah.me/ui/build/styles/color-palette.css";
import "../src/app/styles/global.css.ts";

import { Header } from "../src/widgets/header/header.ui";
import { Footer } from "../src/widgets/footer/footer.ui";

const roboto = Roboto({
  weight: ["400", "800"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "800"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const firaCode = Fira_Code({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${notoSansKR.variable} ${firaCode.variable}`}
    >
      <body>
        <Header />
        <div className="container">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
