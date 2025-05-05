const DEFAULT_INPUT = "posts";
const DEFAULT_OUTPUT = "public/jsons";

export default {
  "gen:post": {
    inputPath: DEFAULT_INPUT,
  },
  "gen:pages": {
    inputPath: DEFAULT_INPUT,
    outputPath: DEFAULT_OUTPUT,
  },
  "gen:tags": {
    inputPath: DEFAULT_INPUT,
    outputPath: DEFAULT_OUTPUT,
  },
  "gen:tag": {
    inputPath: DEFAULT_INPUT,
    outputPath: DEFAULT_OUTPUT,
    postPerPage: 20,
  },
};
