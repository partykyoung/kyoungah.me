import { Command } from "commander";
import { createNewPost } from "./create-new-post.js";
import { createPaginationJson } from "./create-pagination-json.js";
import { createTagJson } from "./create-tag-json.js";
import { createTagsJson } from "./create-tags-json.js";

const program = new Command();

program.name("scripts").description("Blog management scripts").version("1.0.0");

program
  .command("gen:post")
  .description("Generate a new blog post")
  .action(async () => {
    await createNewPost();
  });

program
  .command("build:jsons")
  .description("Build all JSON files")
  .action(async () => {
    await Promise.all([
      createPaginationJson(),
      createTagJson(),
      createTagsJson(),
    ]);
  });

// Default command when no arguments provided
if (!process.argv.slice(2).length) {
  program.action(async () => {
    await Promise.all([
      createPaginationJson(),
      createTagJson(),
      createTagsJson(),
    ]);
  });
}

program.parse();
