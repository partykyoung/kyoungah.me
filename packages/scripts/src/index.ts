import { Command } from "commander";

import { createPaginationJson } from "./create-pagination-json";
import { createTagsJson } from "./create-tags-json";

const program = new Command();

program
  .name("scripts")
  .command("gen:pagination")
  .description("Generate pagination JSON")
  .action(() => {
    createPaginationJson();
  });

program
  .name("scripts")
  .command("gen:tags")
  .description("Generate tags JSON")
  .action(() => {
    createTagsJson();
  });

program.parse(process.argv);
