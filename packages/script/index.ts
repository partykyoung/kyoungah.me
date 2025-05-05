import { Command } from "commander";
import { createNewPost } from "./src/create-new-post.js";
import { createPaginationJson } from "./src/create-pagination-json.js";

import { getRootConfig } from "./root.config.js";
import { scriptConfig } from "./script.config.js";

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

program.parse();
