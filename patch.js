#!/usr/bin/env node
/**
 * This is a temporary "hack" to export correct packages from pyodide.
 * When this is fixed upstream we can delete
 */
const webpack = require("./webpack.config");
const fs = require("fs");
const packagePath = require.resolve(`${webpack.pyodidePackage}/package.json`);
const packageJson = require(packagePath);
packageJson.exports = {
  "./distutils.tar": "./distutils.tar",
  "./pyodide.asm.wasm": "./pyodide.asm.wasm",
  "./pyodide.asm.js": "./pyodide.asm.js",
  "./pyodide.asm.data": "./pyodide.asm.data",
  "./pyodide_py.tar": "./pyodide_py.tar",
  "./packages.json": "./packages.json",
  ...packageJson.exports,
};
fs.writeFileSync(packagePath, JSON.stringify(packageJson));
