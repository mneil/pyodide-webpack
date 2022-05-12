(() => {
  eval(require("pyodide"));
  const loadPyodide = globalThis.loadPyodide;
  // clean global scope
  delete globalThis.loadPyodide;
  return loadPyodide;
})();
