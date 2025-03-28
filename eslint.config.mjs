import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["cdk.out/**", "dist/**", "test/**", "jest.config.js"]),
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "max-len": ["error", { code: 80, ignoreUrls: true }],
      "comma-dangle": ["error", "never"],
    },
  },
  tseslint.configs.recommended,
]);
