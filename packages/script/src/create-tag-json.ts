import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ScriptConfig } from "../script.config.js";

const cwd = process.cwd();

function createTagJson(config: ScriptConfig["gen:tag"]): void {
  const INPUT_DIRECTORY = path.join(cwd, config.inputPath);
  const OUTPUT_DIRECTORY = path.join(cwd, config.outputPath);

  if (!fs.existsSync(OUTPUT_DIRECTORY)) {
    fs.mkdirSync(OUTPUT_DIRECTORY);
  }

  const posts = fs.readdirSync(INPUT_DIRECTORY).map((post: string) => {
    const file = fs.readFileSync(`${INPUT_DIRECTORY}/${post}`, {
      encoding: "utf-8",
    });

    const { data: frontmatter, content } = matter(file);
    const slug = post.replace(/\.md$/, "");
    const excerpt = content.substring(0, 100); // Example logic for excerpt

    return {
      slug,
      excerpt,
      title: frontmatter.title || "Untitled",
      date: frontmatter.date || "Unknown",
      tags: frontmatter.tags || [],
    };
  });

  const POSTS_PER_PAGE = config.perPage;
  const tagMap = new Map<
    string,
    { slug: string; excerpt: string; title: string; date: string }[]
  >();

  posts.forEach(({ tags, ...post }) => {
    tags.forEach((tag: string) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag)!.push(post);
    });
  });

  tagMap.forEach((posts, tag) => {
    const numPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    for (let i = 0; i < numPages; i++) {
      const skip = i * POSTS_PER_PAGE;
      const pagePosts = posts.filter((_, postIndex) => {
        return postIndex >= skip && postIndex < skip + POSTS_PER_PAGE;
      });

      const pageData = {
        limit: POSTS_PER_PAGE,
        skip,
        numPages,
        currentPage: i + 1,
        posts: pagePosts.map(({ title, date, slug, excerpt }) => ({
          title,
          date,
          slug,
          excerpt,
        })),
      };

      const filePath = `${OUTPUT_DIRECTORY}/${tag.toLowerCase()}${i + 1}.json`;
      fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2));
    }
  });
}

export { createTagJson };
