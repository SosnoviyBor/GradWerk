import Drawflow from "./lib/drawflow/drawflow.js"

import base_flowchart from "./recources/sample_flowchart.json" with { type: 'json' }

// start drawflow
export const editor = new Drawflow(document.getElementById("drawflow"))
editor.reroute = true
editor.start()
editor.import(base_flowchart)

// TODO set page zoom to 80% on page load