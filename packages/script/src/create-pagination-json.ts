import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ScriptConfig } from "../script.config.js";

const cwd = process.cwd();

type Frontmatter = {
  title: string;
  date: string;
  publish: boolean;
};

type Post = Frontmatter & {
  slug: string;
  excerpt: string;
};

type PageData = {
  pageSuffix: string;
  context: {
    limit: number;
    skip: number;
    numPages: number;
    currentPage: number;
    posts: Post[];
  };
};

function createJSON(pageData: PageData, outputPath: string): void {
  const OUTPUT_DIRECTORY = `${cwd}/${outputPath}`;

  if (!fs.existsSync(OUTPUT_DIRECTORY)) {
    fs.mkdirSync(OUTPUT_DIRECTORY);
  }

  const filePath = path.join(
    OUTPUT_DIRECTORY,
    `page-${pageData.pageSuffix}.json`
  );
  const dataToSave = JSON.stringify(pageData.context);

  fs.writeFile(filePath, dataToSave, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error(`Error writing file: ${filePath}`, err);
    }
  });
}

function extractDateFromMarkdown(fileContent: string, post: string): Post {
  const { data: frontmatter, content } = matter(fileContent);

  const onlyContentText = content
    .replace(/#+\s+/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/>\s+/g, "")
    .replace(/[-*+] /g, "")
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const excerpt = onlyContentText.slice(0, 150).trim();
  const dot = post.lastIndexOf(".");
  const slug = post.slice(0, dot);

  return {
    ...(frontmatter as Frontmatter),
    slug: `/${slug}`,
    excerpt,
  };
}

function createPaginationJson(config: ScriptConfig["gen:pages"]): void {
  const POSTS_DIRECTORY = path.join(cwd, config.inputPath);

  const posts: Post[] = fs
    .readdirSync(POSTS_DIRECTORY)
    .map((post: string) => {
      const file = fs.readFileSync(`${POSTS_DIRECTORY}/${post}`, {
        encoding: "utf-8",
      });

      return extractDateFromMarkdown(file, post);
    })
    .filter((post: Post) => post.publish === true);

  posts.sort((prev, next) => {
    return new Date(next.date).getTime() - new Date(prev.date).getTime();
  });

  const POSTS_PER_PAGE = config.perPage;
  const numPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  for (let i = 0; i < numPages; i++) {
    const skip = i * POSTS_PER_PAGE;
    const pagePosts = posts.filter((_, postIndex) => {
      return postIndex >= skip && postIndex < skip + POSTS_PER_PAGE;
    });

    createJSON(
      {
        pageSuffix: `${i + 1}`,
        context: {
          limit: POSTS_PER_PAGE,
          skip,
          numPages,
          currentPage: i + 1,
          posts: pagePosts,
        },
      },
      config.outputPath
    );
  }
}

export { createPaginationJson };
