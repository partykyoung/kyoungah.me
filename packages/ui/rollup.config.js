import { readdirSync, lstatSync } from "fs";
import path from "path";

import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import postcss from "rollup-plugin-postcss";

import autoprefixer from "autoprefixer";

const components = readdirSync("./src")
  .filter((dir) => {
    const fullPath = path.resolve("./src", dir);

    return (
      lstatSync(fullPath).isDirectory() &&
      readdirSync(fullPath).includes("index.tsx")
    );
  })
  .reduce((acc, dir) => {
    acc[dir] = `./src/${dir}/index.tsx`;
    return acc;
  }, {});

export default {
  input: components,
  output: [
    {
      dir: "build",
      format: "esm",
      entryFileNames: "[name]/index.js", // 컴포넌트별 폴더 생성
      sourcemap: false,
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react/jsx-runtime": "jsxRuntime",
        clsx: "clsx",
      },
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    babel({
      babelHelpers: "bundled",
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead",
            modules: false,
          },
        ],
        "@babel/preset-react",
        "@babel/preset-typescript", // TypeScript 트랜스파일 지원
      ],
    }),
    commonjs(),
    postcss({
      plugins: [autoprefixer()],
      extract: false,
      modules: true,
    }),
  ],
  external: ["react", "react-dom", "react/jsx-runtime", "clsx"],
};
