"use client";

import { MDXRemote } from "next-mdx-remote/rsc";

export function Test({ mdxSource }: { mdxSource: any }) {
  return <MDXRemote source={mdxSource} />;
}
