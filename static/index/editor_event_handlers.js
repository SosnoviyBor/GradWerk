import { editor } from "../index.js"


/* LOGGERS */

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



/* OTHER */

editor.on("nodeCreated", function initialize(id) {
    const box = document.getElementById(`node-${id}`).getElementsByClassName("box")[0]
    if (!box.hasChildNodes()) { return }

    const event = new Event("input", { bubbles: true })
    const updateable_tags = ["input", "select", "textarea"]

    for (let i = 0; i < box.children.length; i++) {
        if (updateable_tags.includes(box.children[i].tagName.toLowerCase())) {
            box.children[i].dispatchEvent(event)
        }
    }
})