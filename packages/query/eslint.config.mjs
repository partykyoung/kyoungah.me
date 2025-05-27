import eslintConfig from "@kyoungah.me/eslint-config/eslint.config.mjs";

export default [
  ...eslintConfig,
  {
    ignores: ["node_modules/**", "dist/**", "build/**", ".turbo/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ["./tsconfig.json"],
      },
    },
  },
];
