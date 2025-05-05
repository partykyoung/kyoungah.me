import { Command } from "commander";
import { createNewPost } from "./src/create-new-post.js";
import { createPaginationJson } from "./src/create-pagination-json.js";

import { getRootConfig } from "./root.config.js";
import { scriptConfig } from "./script.config.js";
import { createTagsJson } from "./src/create-tags-json.js";
import { createTagJson } from "./src/create-tag-json.js";

const program = new Command();
const rootConfig = getRootConfig();

program.name("script").description("Blog management scripts").version("1.0.0");

program
  .command("gen:post")
  .description("Generate a new blog post")
  .action(async () => {
    const customConfig = rootConfig?.["gen:post"] ?? {};
    const config = { ...scriptConfig["gen:post"], ...customConfig };

    await createNewPost(config);
  });

program
  .command("gen:pages")
  .description("Generate pagination JSON files")
  .action(async () => {
    const customConfig = rootConfig?.["gen:pages"] ?? {};
    const config = { ...scriptConfig["gen:pages"], ...customConfig };

    createPaginationJson(config);
  });

program
  .command("gen:tags")
  .description("Generate tags JSON file")
  .action(async () => {
    const customConfig = rootConfig?.["gen:tags"] ?? {};
    const config = { ...scriptConfig["gen:tags"], ...customConfig };

    createTagsJson(config);
  });

program
  .command("gen:tag")
  .description("Generate tag JSON files")
  .action(async () => {
    const customConfig = rootConfig?.["gen:tag"] ?? {};
    const config = { ...scriptConfig["gen:tag"], ...customConfig };

    createTagJson(config);
  });

program.parse();
