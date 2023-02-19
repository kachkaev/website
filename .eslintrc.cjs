module.exports = {
  extends: [
    "@kachkaev/eslint-config-react",
    "@kachkaev/eslint-config-react/extra-type-checking",
    "plugin:@next/next/recommended",
  ],
  rules: {
    // @todo re-enable
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "func-style": "off",
    "id-length": "off",
    "import/no-default-export": "off",
    "react/react-in-jsx-scope": "off",
    "unicorn/import-style": "off",
    "no-restricted-syntax": "off",
  },
};
