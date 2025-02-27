import dayjs from "dayjs";
import fs from "fs";
import matter from "gray-matter";

const cwd = process.cwd();

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const decodedSlug = /%[0-9A-F]{2}/i.test(slug) ? decodeURI(slug) : slug;

  const { default: Post } = await import(`../../posts/${decodedSlug}.md`);
  const source = fs.readFileSync(
    `${cwd}/posts/${decodedSlug}.md`,
    {
      encoding: "utf-8",
    }
    // path.join(root, "data", dataType, postSlug),
  );
  const { data, content } = matter(source);

  console.log(Post);

  return (
    <>
      <Post />
    </>
  );
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
