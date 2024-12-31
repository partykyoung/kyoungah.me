import { lstatSync, readdirSync } from "fs";
import { defineConfig } from "vite";
import { extname, relative, resolve } from "path";
import { glob } from "glob";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import commonjs from "@rollup/plugin-commonjs";
import { fileURLToPath } from "node:url";

const components = readdirSync("./src")
  .map((dir) => {
    if (lstatSync(`./src/${dir}`).isDirectory()) {
      return `./src/${dir}`;
    }

    return "";
  })
  .filter((dir) => !!dir);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), commonjs()],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  build: {
    lib: {
      entry: components,
      name: "@kyoungah.me UI Kit",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
      input: Object.fromEntries(
        glob
          .sync("src/**/*.{ts,tsx}")
          .map((file) => [
            relative("src", file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        dir: "build",
        entryFileNames: "[name].js",
      },
    },
  },
});
