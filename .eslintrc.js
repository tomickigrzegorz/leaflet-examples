module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "comma-dangle": ["error", "only-multiline"],
    "linebreak-style": ["error", "windows"],
    "no-param-reassign": [2, { props: false }],
  },
  parser: "@babel/eslint-parser",
};
