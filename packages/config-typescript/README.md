# @kyoungah/config-typescript

Shared TypeScript configuration for kyoungah monorepo.

## Usage

In your `tsconfig.json`:

### For React projects

```json
{
  "extends": "@kyoungah/config-typescript/react.json",
  "compilerOptions": {
    // Your custom options
  }
}
```

### For base projects

```json
{
  "extends": "@kyoungah/config-typescript/base.json",
  "compilerOptions": {
    // Your custom options
  }
}
```
