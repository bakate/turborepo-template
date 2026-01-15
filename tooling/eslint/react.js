import reactPlugin from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  // @ts-expect-error - eslint-plugin-react-hooks types issues
  reactHooks.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "react-compiler": reactCompiler,
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      "react-compiler/react-compiler": "error",
    },
    languageOptions: {
      globals: {
        React: "writable",
      },
    },
  },
];
