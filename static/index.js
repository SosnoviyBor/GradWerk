import Drawflow from "./lib/drawflow/drawflow.js"

import dataToImport from "./recources/sample_flowchart.json" with { type: 'json' }

// start drawflow
export const editor = new Drawflow(document.getElementById("drawflow"))
editor.reroute = true
editor.start()
editor.import(dataToImport)