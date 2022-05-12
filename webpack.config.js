const fs = require("fs");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

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
          { from: require.resolve("pyodide/distutils.tar"), to: "pyodide/distutils.tar" },
          { from: require.resolve("pyodide/packages.json"), to: "pyodide/packages.json" },
          { from: require.resolve("pyodide/pyodide_py.tar"), to: "pyodide/pyodide_py.tar" },
          { from: require.resolve("pyodide/pyodide.asm.data"), to: "pyodide/pyodide.asm.data" },
          { from: require.resolve("pyodide/pyodide.asm.js"), to: "pyodide/pyodide.asm.js" },
          { from: require.resolve("pyodide/pyodide.asm.wasm"), to: "pyodide/pyodide.asm.wasm" },
        ],
      }),
    ],
    module: {
      rules: [
        // Treat pyodide.js as a string. We do this to avoid webpack processing the
        // javascript inside the file. pyodide is built with emscripten, contains its own
        // filesystem, process, require, etc... If webpack tries to process it you get a lot
        // or errors. While you *can* fix the errors you may cause unwanted side-effects doing so.
        {
          test: /pyodide\.js$/,
          type: "asset/source",
        },
        // Replace the call to require("pyodide") with our own file that wraps the require call. We
        // do this to evaluate the string we produced in the above rule as well as to handle the returned
        // object correctly and remove loadPyodide from the global scope.
        {
          test: /src\/.+\.js$/,
          loader: "string-replace-loader",
          options: {
            multiple: [
              {
                search: /require\(['"]pyodide['"]\)/g,
                replace: fs.readFileSync(path.resolve(__dirname, "webpack", "modules", "pyodide.js"), "utf-8"),
              },
            ],
          },
        },
      ],
    },
  };
};
