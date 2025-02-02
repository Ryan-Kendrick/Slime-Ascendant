// eslint.config.js
// @ts-nocheck

import eslint from "@eslint/js"
import prettierConfig from "eslint-plugin-prettier/recommended"
import reactConfig from "eslint-plugin-react/configs/recommended.js"
import globals from "globals"
import tseslint from "typescript-eslint"
import reactCompiler from "eslint-plugin-react-compiler"
import reactHooks from "eslint-plugin-react-hooks"

export default [
  {
    ignores: ["dist/*", "**/*.ts.build-*.mjs", "*.js", "*.cjs", "*.mjs"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  reactConfig,
  {
    plugins: {
      "react-compiler": reactCompiler,
      "react-hooks": reactHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-compiler/react-compiler": "error",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [1, { argsIgnorePattern: "^_" }],
      "prettier/prettier": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
        sourceType: "module",
        ecmaVersion: "latest",
      },
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
]
