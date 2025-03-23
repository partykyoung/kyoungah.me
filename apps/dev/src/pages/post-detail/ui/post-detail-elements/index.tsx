import clsx from "clsx";
import {
  PostDetailH1,
  PostDetailH2,
  PostDetailH3,
  PostDetailH4,
  PostDetailH5,
  PostDetailH6,
} from "@kyoungah.me/ui/build/components/post-detail";

function H1() {
  return <PostDetailH1 className={clsx("h1")} />;
}

function H2() {
  return <PostDetailH2 className={clsx("h2")} />;
}

function H3() {
  return <PostDetailH3 className={clsx("h3")} />;
}

function H4() {
  return <PostDetailH4 className={clsx("h4")} />;
}

function H5() {
  return <PostDetailH5 className={clsx("h5")} />;
}

function H6() {
  return <PostDetailH6 className={clsx("h6")} />;
}

function P() {
  return <PostDetailP className={clsx("p")} />;
}

export { H1, H2, H3, H4, H5, H6, P };
