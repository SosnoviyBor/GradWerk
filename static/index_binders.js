import { editor } from "./index.js";
import * as element_handlers from "./index_element_handlers.js"
import * as window_handlers from "./index_window_handlers.js"
import * as editor_handlers from "./index_editor_handlers.js"

/* element binders */

var elements = document.getElementsByClassName('drag-drawflow');
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('touchend', element_handlers.drop, false);
    elements[i].addEventListener('touchmove', element_handlers.positionMobile, false);
    elements[i].addEventListener('touchstart', element_handlers.drag, false);
    elements[i].addEventListener('dragstart', (ev) => element_handlers.drag(ev))
}

document.getElementById("drawflow").addEventListener('dragover', (ev) => element_handlers.allowDrop(ev))
document.getElementById("drawflow").addEventListener('drop', (ev) => element_handlers.drop(ev))

document.getElementById("btn-export").addEventListener("click", () => element_handlers.exportAsJson())
document.getElementById("btn-import").addEventListener("click", () => element_handlers.importJson())
document.getElementById("import-input").addEventListener("change", () => element_handlers.readImportedJson())
document.getElementById("btn-clear").addEventListener("click", () => element_handlers.clear())

document.getElementById("start").addEventListener("click", () => element_handlers.requestSimulation())



/* window binders */

window.addEventListener('beforeunload', (ev) => { window_handlers.check_unsaved_changes(ev) });



/* editor binders */

editor.on('nodeCreated',        (id) => { console.log("Node created " + id) })
editor.on('nodeRemoved',        (id) => { console.log("Node removed " + id) })
editor.on('nodeSelected',       (id) => { console.log("Node selected " + id) })
editor.on('nodeDataChanged',    (id) => {console.log("Updated data in node  "+ id)})
editor.on('moduleCreated',      (name) => { console.log("Module Created " + name) })
editor.on('moduleChanged',      (name) => { console.log("Module Changed " + name) })
editor.on('nodeMoved',          (id) => { console.log("Node moved " + id) })
editor.on('zoom',               (zoom) => { console.log('Zoom level ' + zoom) })
editor.on('addReroute',         (id) => { console.log("Reroute added " + id) })
editor.on('removeReroute',      (id) => { console.log("Reroute removed " + id) })
editor.on('connectionCreated',  (connection) => {
    console.log('Connection created')
    console.log(connection)
})
editor.on('connectionRemoved', (connection) => {
    console.log('Connection removed')
    console.log(connection)
})

editor.on("nodeCreated", (id) => { editor_handlers.init_node_data(id) })