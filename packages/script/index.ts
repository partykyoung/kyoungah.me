import { Command } from "commander";
import { createNewPost } from "./src/create-new-post.js";
// import { createPaginationJson } from "./create-pagination-json.js";
// import { createTagJson } from "./create-tag-json.js";
// import { createTagsJson } from "./create-tags-json.js";

const program = new Command();

program.name("scripts").description("Blog management scripts").version("1.0.0");

program
  .command("gen:post")
  .description("Generate a new blog post")
  .action(async () => {
    await createNewPost();
  });

program.parse();
