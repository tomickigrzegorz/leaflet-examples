module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    "prettier/prettier": "error",
    "comma-dangle": ["error", "only-multiline"],
    "linebreak-style": ["error", "windows"],
    "no-param-reassign": [2, { props: false }],
  },
};
