import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ScriptConfig } from "../script.config.js";

const cwd: string = process.cwd();

type Frontmatter = {
  tags: string[];
  publish: boolean;
};

function createJSON(tags: Map<string, number>, outputPath: string): void {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const filePath = `${outputPath}/tags.json`;
  const dataToSave = JSON.stringify({
    tags: Array.from(tags.entries()).map(([tag, count]) => `${tag} (${count})`),
  });

  fs.writeFile(filePath, dataToSave, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error(`Error writing file: ${filePath}`, err);
    }
  });
}

function createTagsJson(config: ScriptConfig["gen:tags"]): void {
  const INPUT_DIRECTORY = path.join(cwd, config.inputPath);

  const tags = fs
    .readdirSync(INPUT_DIRECTORY)
    .reduce((acc: Map<string, number>, post: string) => {
      const file = fs.readFileSync(`${INPUT_DIRECTORY}/${post}`, {
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

  createJSON(tags, config.outputPath);
}

export { createTagsJson };
