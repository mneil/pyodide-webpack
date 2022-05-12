const { loadPyodide } = require("pyodide");

async function init() {
  const pyodide = await loadPyodide({ indexURL: `${window.location.origin}/pyodide` });
  console.log(await pyodide.runPythonAsync("1+1"));
}

init();
