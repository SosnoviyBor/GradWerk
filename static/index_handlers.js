import { editor } from "./index.js";
import { components } from "./index_element_components.js"

var mobile_item_selec = ''
var mobile_last_move = null
export function positionMobile(ev) {
    mobile_last_move = ev
}

export function allowDrop(ev) {
    ev.preventDefault()
}

export function drag(ev) {
    if (ev.type === "touchstart") {
        mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node')
    } else {
        ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'))
    }
}

export function drop(ev) {
    if (ev.type === "touchend") {
        var parentdrawflow = document
                .elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY)
                .closest("#drawflow")
        if (parentdrawflow != null) {
            addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY)
        }
        mobile_item_selec = ''
    } else {
        ev.preventDefault()
        var data = ev.dataTransfer.getData("node")
        addNodeToDrawFlow(data, ev.clientX, ev.clientY)
    }
}

const jsonInput = document.getElementById("import-input")
export function importJson() {
    jsonInput.click()
}

export function readImportedJson() {
    const reader = new FileReader()
    reader.onload = (ev) => {
        var content
        try {
            content = JSON.parse(ev.target.result)
        } catch (e) {
            alert("Uploaded file is not a valid JSON!")
            return
        }
        editor.import(content)
    }
    reader.readAsText(jsonInput.files[0], "UTF-8")
    jsonInput.value = ""
}

export function exportAsJson() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editor.export()));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "flowchart.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export function clear() {
    if (confirm("Are you sure you want to clear your flowchart?")) {
        editor.clearModuleSelected()
        console.log("You do you, boss")
    }
}


function addNodeToDrawFlow(name, pos_x, pos_y) {
    pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)))
    pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)))

    const component = components[name]
    switch (name) {
        case "welcome":
            editor.addNode(name, 0, 0, pos_x, pos_y, name, {}, component)
            break

        case "userinput":
            editor.addNode(name, 0, 1, pos_x, pos_y, name, {}, component)
            break
            
        case "useroutput":
            editor.addNode(name, 1, 0, pos_x, pos_y, name, {}, component)
            break
            
        case "frontend":
            editor.addNode(name, 5, 5, pos_x, pos_y, name, {}, component)
            break
            
        case "backend":
            editor.addNode(name, 5, 5, pos_x, pos_y, name, {}, component)
            break
            
        case "database":
            editor.addNode(name, 5, 5, pos_x, pos_y, name, {}, component)
            break
        
        case "comment":
            editor.addNode(name, 0, 0, pos_x, pos_y, name, {}, component)
            break

        default:
            console.log("Unexpected component is being added!")
    }
}

export function requestSimulation() {
    const model = editor.export()
    console.log(model)
    fetch("/simulate", {
        method: "POST",
        body: JSON.stringify({
            model: model,
            simtime: document.getElementById("simtime").value
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
            .then((response) => response.text())
            .then((text) => {
                const results_tab = window.open("/newpath", "_blank")
                results_tab.document.write(text)
                results_tab.focus()
            })
}

export function init_node_data(id) {
    const box = document.getElementById(`node-${id}`).getElementsByClassName("box")[0]
    if (!box.hasChildNodes()) { return }

    const event = new Event("input", { bubbles: true })
    const updateable_tags = ["input", "select", "textarea"]

    for (let i = 0; i < box.children.length; i++) {
        if (updateable_tags.includes(box.children[i].tagName.toLowerCase())) {
            box.children[i].dispatchEvent(event)
        }
    }
}