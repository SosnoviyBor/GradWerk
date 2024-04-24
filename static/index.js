import Drawflow from "./lib/drawflow/drawflow.js"

import base_flowchart from "./recources/basictest.json" with { type: 'json' }

// start drawflow
export const editor = new Drawflow(document.getElementById("drawflow"))
editor.reroute = true
editor.start()
editor.import(base_flowchart)
// zoom out to 80%
editor.zoom_out()
editor.zoom_out()