import fs from "fs";
import path from "path";

type ScriptConfig = {
  "gen:post": Partial<{ inputPath: string }>;
  "gen:pages": Partial<{
    inputPath: string;
    outputPath: string;
    perPage: number;
  }>;
  "gen:tags": Partial<{ inputPath: string; outputPath: string }>;
  "gen:tag": Partial<{
    inputPath: string;
    outputPath: string;
    perPage: number;
  }>;
};

const CONFIG_NAME = "script.config.mjs";

function getPathOnCWD(...paths: string[]) {
  return path.resolve(process.cwd(), ...paths);
}

export const getRootConfig = (): Partial<ScriptConfig> | undefined => {
  const filename = getPathOnCWD(CONFIG_NAME);

  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    return require(filename).module;
  }
};
