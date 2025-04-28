import fs from "fs";
import matter from "gray-matter";

const cwd: string = process.cwd();

type Frontmatter = {
  tags: string[];
  publish: boolean;
};

function createJSON(tags: Map<string, number>): void {
  const JSONS_DIRECTORY = `${cwd}/public/jsons`;

  if (!fs.existsSync(JSONS_DIRECTORY)) {
    fs.mkdirSync(JSONS_DIRECTORY);
  }

  const filePath = `${JSONS_DIRECTORY}/tags.json`;
  const dataToSave = JSON.stringify({
    tags: Array.from(tags.entries()).map(([tag, count]) => `${tag} (${count})`),
  });

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
    .reduce((acc: Map<string, number>, post: string) => {
      const file = fs.readFileSync(`${POSTS_DIRECTORY}/${post}`, {
        encoding: "utf-8",
      });

      const { data: frontmatter } = matter(file);
      const { tags, publish } = frontmatter as Frontmatter;

      if (publish) {
        tags.forEach((tag: string) => {
          acc.set(tag, (acc.get(tag) || 0) + 1);
        });
      }

      return acc;
    }, new Map<string, number>());

  createJSON(tags);
}

export { createTagsJson };
