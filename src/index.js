const { loadPyodide } = require("pyodide");

// https://cdn.jsdelivr.net/pyodide/v0.20.0/full/

async function init() {
  const config = { fillStdLib: true, indexURL: `${window.location.origin}/pyodide` };
  const pyodide = await loadPyodide(config);
  console.log(await pyodide.runPythonAsync("1+1"));
  await pyodide.loadPackage(["micropip"]);
  await pyodide.runPythonAsync(`
    import micropip
    await micropip.install('snowballstemmer')
    import snowballstemmer
    stemmer = snowballstemmer.stemmer('english')
    print(stemmer.stemWords('go goes going gone'.split()))
  `);
}

init();
