import { editor } from "../index.js"

editor.on("nodeCreated", initialize(id))

function initialize(id) {
    const node = editor.getNodeFromId(id)
    // node = json

    // TODO

    editor.updateNodeDataFromId(id, node)
}