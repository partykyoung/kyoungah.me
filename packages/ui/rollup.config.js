import { readdirSync, lstatSync } from "fs";
import path from "path";

import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import postcss from "rollup-plugin-postcss";

import autoprefixer from "autoprefixer";

const components = readdirSync("./src/components")
  .filter((dir) => {
    const fullPath = path.resolve("./src/components", dir);

    return (
      lstatSync(fullPath).isDirectory() &&
      readdirSync(fullPath).includes("index.tsx")
    );
  })
  .reduce((acc, dir) => {
    acc[dir] = `./src/components/${dir}/index.tsx`;
    return acc;
  }, {});

const styles = readdirSync("./src/styles")
  .filter((file) => file.endsWith(".css"))
  .map((file) => path.resolve("./src/styles", file));

export default [
  {
    input: components,
    output: [
      {
        dir: "build/components",
        format: "esm",
        entryFileNames: "[name]/index.js", // 컴포넌트별 폴더 생성
        sourcemap: false,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "@radix-ui/react-slot": "RadixSlot",
        },
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      }),
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
        inject: { insertAt: "top" },
      }),
    ],
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "clsx",
      "@radix-ui/react-slot",
    ],
    watch: {
      include: "src/**",
      exclude: "node_modules/**",
    },
  },
  {
    input: styles,
    output: {
      dir: "build/styles", // 모든 CSS를 `build/styles` 폴더에 생성
      entryFileNames: "[name].css", // 각 CSS 파일 이름 유지
    },
    plugins: styles.map((style) =>
      postcss({
        include: style,
        extract: (file) => `${file.name}.css`, // 파일 이름 기반으로 CSS 추출
        minimize: true,
        sourceMap: false,
      })
    ),
  },
];
