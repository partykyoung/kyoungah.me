import fs from "fs";
import { MDXContent } from "@/pages/post-detail";
import { getPostDetail } from "@/pages/post-detail/api/get-post-detail";
import { MdxFrontMatter } from "@/pages/post-detail/ui/mdx-frontmatter";

const cwd = process.cwd();

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const slug = (await params).slug;
    const { frontmatter, code } = await getPostDetail(slug);

    return (
      <>
        <MdxFrontMatter
          title={frontmatter.title}
          date={frontmatter.date}
          tags={frontmatter.tags}
        />
        <MDXContent code={code.value as string} />
      </>
    );
  } catch (error) {
    return <div>Error</div>;
  }
}

export function generateStaticParams() {
  const POSTS_DERECTORY = `${cwd}/posts`;

  const posts = fs
    .readdirSync(POSTS_DERECTORY, {
      encoding: "utf-8",
    })
    .map((post) => ({ slug: post.replace(".md", "") }));

  return posts;
}

export const dynamicParams = false;
