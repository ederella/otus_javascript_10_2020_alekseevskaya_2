module.exports = {
  plugins: [
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-transform-runtime",
  ],
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "3.8.3",
        // caller.target will be the same as the target option from webpack
        targets: "> 0.25%, not dead",
      },
    ],
  ],
};
