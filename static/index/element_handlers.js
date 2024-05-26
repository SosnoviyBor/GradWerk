import { editor } from "./main.js";
import { components } from "./components.js"
import * as utils from "../utils.js"


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
    reader.onload = parseJson
    reader.readAsText(jsonInput.files[0], "UTF-8")
    jsonInput.value = ""
}


function parseJson(ev) {
    var content
    try {
        content = JSON.parse(ev.target.result)
    } catch (e) {
        alert("Uploaded file is not a valid JSON!")
        return
    }
    editor.import(content)
          .then(utils.init_nodes())
}


export function exportAsJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editor.export()));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "flowchart.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


export function clear() {
    if (confirm("Are you sure you want to clear your flowchart?")) {
        editor.clearModuleSelected()
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
            editor.addNode(name, 1, 1, pos_x, pos_y, name, {}, component)
            break

        case "backend":
            editor.addNode(name, 1, 1, pos_x, pos_y, name, {}, component)
            break

        case "database":
            editor.addNode(name, 1, 1, pos_x, pos_y, name, {}, component)
            break

        case "comment":
            editor.addNode(name, 0, 0, pos_x, pos_y, name, {}, component)
            break

        default:
            console.log("Unexpected component is being added!")
    }
}


export function requestSimulation() {
    const simtime = document.getElementById("simtime").value
    const log_max_size = Number(document.getElementById("log-max-size").value)
    // check params
    if (!(
            Number.isInteger(simtime) &&
            simtime > 0 &&
            Number.isInteger(log_max_size) &&
            log_max_size > 0
        )) {
        console.log("Wrong input!")
        return
    }
    // show overlay
    document.getElementById("sim-started-overlay").hidden = false
    changeOverlayOpacity()
    // start simulation
    const model = editor.export()["drawflow"]["Home"]["data"]
    const body = {
        model: model,
        simtime: simtime,
        log_max_size: log_max_size
    }
    console.log(body)
    fetch("/simulate", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(response => response.json())
        .then(json => {
            utils.post_to_new_tab(json, "/results")
            hideOverlay()
        })
}


function changeOverlayOpacity() {
    const bg = document.getElementById("overlay-bg")
    const text = document.getElementById("overlay-text")
    var i = 0
    const scale = 50

    const fadein = window.setInterval(() => {
        if (i > scale) {
            clearInterval(fadein);
            return
        }
        bg.style.opacity = i / (scale * 2);
        text.style.opacity = i / scale;
        i++;
    }, 10);
}


export function hideOverlay() {
    document.getElementById("sim-started-overlay").hidden = true
}