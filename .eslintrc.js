module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "import/prefer-default-export": "off",
    "no-console": "off",
    "no-alert": "off",
    "no-shadow": "off",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "max-len": ["error", { ignoreComments: true, ignoreRegExpLiterals: true }],
  },
  plugins: ["jest"],
};
