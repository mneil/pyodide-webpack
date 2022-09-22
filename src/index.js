const { loadPyodide } = require("pyodide");
const behave = require("./behave");

async function init() {
  const config = { fillStdLib: true, indexURL: `${window.location.origin}/pyodide` };
  const pyodide = await loadPyodide(config);
  behave.setup(pyodide.FS);
  console.log(await pyodide.runPythonAsync("1+1"));
  await pyodide.loadPackage(["micropip"]);
  await pyodide.runPythonAsync(`
    import micropip
    await micropip.install('http://localhost:9000/parse-1.19.0-py3-none-any.whl')
    from parse import *

    print(parse("It's {}, I love it!", "It's spam, I love it!"))
  `);

  await pyodide.runPythonAsync(`
    await micropip.install('behave')
    from behave.__main__ import main as behave_main
    behave_main(".")
  `);
}

init();
