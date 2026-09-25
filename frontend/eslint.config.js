import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import nodePlugin from "eslint-plugin-n";
import svelte from "eslint-plugin-svelte";

/** @type {import('eslint').Linter.Config[]} */
export default [
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...svelte.configs["flat/recommended"],
  eslintConfigPrettier,
  ...svelte.configs["flat/prettier"],
  nodePlugin.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      eqeqeq: ["error", "smart"],
      "no-var": "error",
      "prefer-arrow-callback": "error",
      "no-restricted-globals": ["error", "it"],
      "no-restricted-properties": [
        "error",
        {
          object: "describe",
          property: "only",
        },
        {
          object: "test",
          property: "only",
        },
      ],
      "no-warning-comments": "error",
      "no-dupe-class-members": "off",
      "require-atomic-updates": "off",
      "no-console": "error",
      "block-scoped-var": "error",
      "eol-last": "error",
      "no-trailing-spaces": "error",
      quotes: ["warn", "single", { avoidEscape: true }],
      "n/no-missing-import": "off",
      "n/hashbang": [
        "error",
        {
          convertPath: {
            "src/**/*.ts": ["^src/(.+?)\\.ts$", "dist/$1.js"],
          },
        },
      ],
      "n/no-unpublished-import": "off",
      "n/no-unsupported-features/node-builtins": [
        "error",
        {
          allowExperimental: true,
          ignores: ["localStorage"],
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
        },
      ],
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "array-simple",
        },
      ],
      "@typescript-eslint/consistent-indexed-object-style": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/ban-ts-comment": "error",
      "svelte/prefer-const": "error",
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: {
      parserOptions: {
        parser: tsEslint.parser,
      },
    },
    rules: {
      "svelte/infinite-reactive-loop": "error",
      "svelte/no-dupe-on-directives": "error",
      "svelte/no-dupe-use-directives": "error",
      "svelte/no-store-async": "error",
      "svelte/require-store-callbacks-use-set-param": "error",
      "svelte/require-store-reactive-access": "error",
      "svelte/no-target-blank": "error",
      "svelte/no-reactive-functions": "error",
      "svelte/block-lang": ["error", { script: "ts" }],
      "svelte/button-has-type": "error",
      "svelte/no-immutable-reactive-statements": "error",
      "svelte/no-reactive-literals": "error",
      "svelte/no-useless-mustaches": "error",
      "svelte/prefer-destructured-store-props": "error",
      "svelte/no-reactive-reassign": "error",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigDirName: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/prefer-includes": "error",
      "@typescript-eslint/no-deprecated": "error",
    },
  },
  {
    files: ["tests/**/*.ts", "**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable the "no-any" rule for test files
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
  {
    ignores: ["build/", ".svelte-kit/", "dist/"],
  },
];
