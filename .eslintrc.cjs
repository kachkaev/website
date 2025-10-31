require("@rushstack/eslint-patch/modern-module-resolution.js");

module.exports = {
  extends: [
    "@kachkaev/eslint-config-react",
    "@kachkaev/eslint-config-react/extra-type-checking",
    "plugin:@next/next/recommended-legacy",
    "plugin:tailwindcss/recommended",
  ],
  rules: {
    // @todo re-enable
    "@typescript-eslint/naming-convention": "off", // GET / POST in handlers
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/restrict-template-expressions": "off",

    "tailwindcss/classnames-order": "error",
    "tailwindcss/enforces-negative-arbitrary-values": "error",
    "tailwindcss/enforces-shorthand": "error",
    "tailwindcss/no-custom-classname": "error",

    "func-style": "off",
    "id-length": "off",
    "import/no-default-export": "off",
    "react/react-in-jsx-scope": "off",
    "unicorn/import-style": "off",
    "unicorn/expiring-todo-comments": "off",
    "no-restricted-syntax": "off",
  },

  overrides: [
    {
      files: ["**/*.cjs"],
      rules: {
        "@typescript-eslint/no-require-imports": "off",
        "unicorn/no-empty-file": "off",
      },
    },
  ],
};
