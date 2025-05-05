type ScriptConfig = {
  "gen:post": { inputPath: string };
  "gen:pages": {
    inputPath: string;
    outputPath: string;
    perPage: number;
  };
  "gen:tags": { inputPath: string; outputPath: string };
  "gen:tag": {
    inputPath: string;
    outputPath: string;
    perPage: number;
  };
};

type PartialScriptConfig = {
  [K in keyof ScriptConfig]: Partial<ScriptConfig[K]>;
};

const DEFAULT_INPUT = "posts";
const DEFAULT_OUTPUT = "public/jsons";

const scriptConfig = {
  "gen:post": {
    inputPath: DEFAULT_INPUT,
  },
  "gen:pages": {
    inputPath: DEFAULT_INPUT,
    outputPath: DEFAULT_OUTPUT,
    perPage: 20,
  },
  "gen:tags": {
    inputPath: DEFAULT_INPUT,
    outputPath: DEFAULT_OUTPUT,
  },
  "gen:tag": {
    inputPath: DEFAULT_INPUT,
    outputPath: DEFAULT_OUTPUT,
    perPage: 20,
  },
};

export type { ScriptConfig, PartialScriptConfig };
export { scriptConfig };
