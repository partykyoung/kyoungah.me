import fs from "fs";
import matter from "gray-matter";

const cwd: string = process.cwd();

type Frontmatter = {
  tags: string[];
  publish: boolean;
};

function createJSON(tags: string[]): void {
  const JSONS_DIRECTORY = `${cwd}/public/jsons`;

  if (!fs.existsSync(JSONS_DIRECTORY)) {
    fs.mkdirSync(JSONS_DIRECTORY);
  }

  const filePath = `${JSONS_DIRECTORY}/tags.json`;
  const dataToSave = JSON.stringify({ tags });

  fs.writeFile(filePath, dataToSave, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error(`Error writing file: ${filePath}`, err);
    }
  });
}

function createTagsJson(): void {
  const POSTS_DIRECTORY = `${cwd}/posts`;

  const tags = fs
    .readdirSync(POSTS_DIRECTORY)
    .map((post: string) => {
      const file = fs.readFileSync(`${POSTS_DIRECTORY}/${post}`, {
        encoding: "utf-8",
      });

      const { data: frontmatter } = matter(file);
      const { tags, publish } = frontmatter as Frontmatter;

      return { tags, publish };
    })
    .filter((post: any) => post.publish === true)
    .reduce((acc: string[], { tags }: Frontmatter) => {
      acc = Array.from(new Set(acc.concat(tags)));

      return acc;
    }, [] as string[]);

  createJSON(tags);
}

export { createTagsJson };
