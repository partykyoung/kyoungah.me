import fs from "fs";
import path from "path";
import { type PartialScriptConfig } from "./script.config.js";

const CONFIG_NAME = "script.config.mjs";

function getPathOnCWD(...paths: string[]) {
  return path.resolve(process.cwd(), ...paths);
}

function getRootConfig(): Partial<PartialScriptConfig> | undefined {
  const filename = getPathOnCWD(CONFIG_NAME);

  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    return require(filename);
  }

  return undefined;
}

export { getRootConfig };
