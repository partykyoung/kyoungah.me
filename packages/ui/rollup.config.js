import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import autoprefixer from "autoprefixer";

export default {
  input: {
    button: "src/button/index.tsx",
  },

  output: [
    {
      dir: "build",
      format: "esm",
      entryFileNames: "[name]/index.js", // 컴포넌트별 폴더 생성
      sourcemap: false,
      globals: { react: "React" },
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      plugins: [autoprefixer()],
      extract: false,
      modules: true,
      extensions: [".scss", ".css"],
    }),
  ],
  external: ["react", "react-dom", "clsx"],
};
