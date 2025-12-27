# `@kyoungah/config-eslint`

Shared ESLint configuration for kyoungah monorepo.

## Usage

In your `eslint.config.mjs`:

```js
import eslintConfig from "@kyoungah/config-eslint/eslint.config.mjs";

export default [
  ...eslintConfig,
  // Your custom rules
];
```
