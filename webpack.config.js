const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

// Allow us to change the pyodide package name for publishing temporary packages
// ourselves without waiting for an official deployment. In most cases do
// not change this or worry about it.
const pyodidePackage = "pyodide";

module.exports = (env, argv) => {
  return {
    node: { global: true },
    mode: "development",
    entry: "./src/index.js",
    ...(argv.mode === "production"
      ? {
          optimization: {
            minimize: false,
          },
        }
      : { devtool: "inline-source-map" }),
    output: {
      path: path.join(__dirname, "dist"),
      filename: "app.js",
      library: {
        name: "app",
        type: "umd",
      },
      globalObject: `(typeof self !== 'undefined' ? self : this)`,
    },
    performance: {
      hints: false,
    },
    devServer: {
      static: [{ directory: path.join(__dirname, "public") }],
      compress: true,
      port: 9000,
      open: true,
    },
    plugins: [
      // Copy files pyodide.js will load asynchronously
      new CopyPlugin({
        patterns: [
          { from: require.resolve(`${pyodidePackage}/distutils.tar`), to: "pyodide/distutils.tar" },
          { from: require.resolve(`${pyodidePackage}/packages.json`), to: "pyodide/packages.json" },
          { from: require.resolve(`${pyodidePackage}/pyodide_py.tar`), to: "pyodide/pyodide_py.tar" },
          {
            from: require.resolve(`${pyodidePackage}/pyodide.asm.js`),
            to: "pyodide/pyodide.asm.js",
            transform: {
              transformer: (input) => {
                return input
                  .toString()
                  .replace("new URL(indexURL", "new URL('https://cdn.jsdelivr.net/pyodide/v0.20.0/full/'");
              },
            },
          },
          { from: require.resolve(`${pyodidePackage}/pyodide.asm.data`), to: "pyodide/pyodide.asm.data" },
          { from: require.resolve(`${pyodidePackage}/pyodide.asm.wasm`), to: "pyodide/pyodide.asm.wasm" },
        ],
      }),
    ],
    resolve: {
      alias: {
        pyodide: require.resolve(pyodidePackage),
      },
    },
    module: {
      noParse: /pyodide\/.+\.js$/,
      rules: [
        // Remove pyodide globals. They are not necessary when using pyodide in webpack
        {
          test: /pyodide\/.+\.js$/,
          loader: "string-replace-loader",
          options: {
            multiple: [
              {
                search: "globalThis.loadPyodide=loadPyodide",
                replace: "({})",
              },
            ],
          },
        },
      ],
    },
  };
};

module.exports.pyodidePackage = pyodidePackage;
