import { editor } from "./index.js"
import { ElementOrder } from "../consts.js"
import { mean } from "../utils.js"

export function init_node_data(id) {
    if (!document.getElementById(`node-${id}`).querySelector(".dbclickbox")) { return }

    const content = document.getElementById(`node-${id}`).querySelector(".modal-content")
    const event = new Event("input", { bubbles: true })
    const updateable_tags = ["input", "select", "textarea"]

    Array.from(content.children).forEach((child) => {
        if (updateable_tags.includes(child.tagName.toLowerCase())) {
            child.dispatchEvent(event)
        }
    })

    updateThroughput({ target: content })
}


export function init_dbclickbox_listeners(id) {
    const box = document.getElementById(`node-${id}`).getElementsByClassName("box")[0]

    if (!box.classList.contains("dbclickbox")) { return }

    box.addEventListener("dblclick", ev => showPopup(ev))
    box.querySelector(".modal-close").addEventListener("click", ev => {
        closeModal(ev)
        updateThroughput(ev)
    })
    box.querySelector(".df-name").addEventListener("change", ev => updateName(ev))
}


var transform = '';
const default_zoom_value = editor.zoom_value
const default_zoom_min = editor.zoom_min
const default_zoom_max = editor.zoom_max
function showPopup(ev) {
    // to prevent doublickicks registering on any inner tags
    // not that they should be present in nodes anyway
    // but, well, it looks neat
    if (!ev.target.classList.contains("box")) { return }

    editor.zoom_value = 0
    editor.zoom_min = editor.zoom
    editor.zoom_max = editor.zoom
    ev.target.closest(".drawflow-node").style.zIndex = "9999";
    ev.target.children[0].style.display = "block";
    transform = editor.precanvas.style.transform;
    editor.precanvas.style.transform = '';
    editor.precanvas.style.left = editor.canvas_x +'px';
    editor.precanvas.style.top = editor.canvas_y +'px';
}


function closeModal(ev) {
    ev.target.closest(".drawflow-node").style.zIndex = "2";
    ev.target.parentElement.parentElement.style.display  = "none";
    editor.precanvas.style.transform = transform;
    editor.precanvas.style.left = '0px';
    editor.precanvas.style.top = '0px';
    editor.zoom_value = default_zoom_value
    editor.zoom_min = default_zoom_min
    editor.zoom_max = default_zoom_max
}


function updateThroughput(ev) {
    const node = ev.target.closest(".drawflow-node")
    const data = editor.export()["drawflow"]["Home"]["data"][node.id.split("-")[1]]["data"]

    if (!(
            data["deviation"] &&
            data["dist"] &&
            data["mean"] &&
            data["replica"]
        )) {
        return
    }

    fetch("/throughput", {
        method: "POST",
        body: JSON.stringify({
            data: data,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(response => response.json())
        .then(throughput => {
            console.log(`Estimated ${node.id} throughput = ${throughput}`)
            node.dataset.throughput = throughput
            calculateThroughputDifference()
        })
}


export function calculateThroughputDifference() {
    const model = editor.export()["drawflow"]["Home"]["data"]
    // traverse all nodes which have inputs
    for (const [current_id, current_node] of Object.entries(model)) {
        if (!current_node["inputs"]) { continue }
        
        const current_node_element = document.getElementById(`node-${current_id}`)
        var current_throughput = current_node_element.dataset["throughput"]
        const parent_throughputs = []
        
        // for each parent node take into the concideration element order
        for (const [, current_node_input] of Object.entries(current_node["inputs"])) {
            if(current_node_input["connections"].length < 1) { continue }
            
            Array.from(current_node_input["connections"]).forEach((connection) => {
                const input_node = model[connection["node"]]
                var multichoise_coef = 1
                // check if connection is 1 to 1

                var output_count = 0
                for (const [, output] of Object.entries(input_node["outputs"])) {
                    if (output["connections"]) { output_count++ }
                }
                
                if(output_count > 1) {
                    // if connection is not 1/1, then divide parent throughput depending on its element order
                    switch (input_node["data"]["order"]) {
                        case ElementOrder.balanced:
                            // balanced = sum of all child nodes quesizes (queue * replica) / quesize of current node
                            var all_child_quesizes = 0
                            for (const [, output] of Object.entries(input_node["outputs"])) {
                                all_child_quesizes += output["queue"] * output["replica"]
                            }
                            multichoise_coef = all_child_quesizes / (current_node["queue"] * current_node["replica"])
                            break
                            
                        case ElementOrder.round_robin:
                        case ElementOrder.random:
                            // round robin = random = output count
                            multichoise_coef = output_count
                            break
                    }
                }
                const input_throughput = document.getElementById(`node-${connection["node"]}`).dataset["throughput"]
                parent_throughputs.push(input_throughput * multichoise_coef)
            })
        }
        if (parent_throughputs.length > 0) {
            // element throughput ratio = mean(sum of all parent troughputs) / current throughput
            const throughput_ratio = mean(parent_throughputs) / current_throughput
            updateOutline(current_node_element, throughput_ratio)
        }
    }
}


function updateOutline(node, throughput_ratio) {
    if (throughput_ratio >= 1 || throughput_ratio === NaN) {
        // remove styles
        node.style.border = ""
        node.style.webkitBoxShadow = ""
        node.style.border = ""
    } else if (throughput_ratio < 1 && throughput_ratio >= .8) {
        // color orange
        node.style.border = "1px solid orange"
        node.style.webkitBoxShadow = "0 2px 20px 2px orange"
        node.style.border = "0 2px 20px 2px orange"
    } else if (throughput_ratio < .8) {
        // color red
        node.style.border = "1px solid red"
        node.style.webkitBoxShadow = "0 2px 20px 2px red"
        node.style.border = "0 2px 20px 2px red"
    }
}


function updateName(ev) {
    const titleBox = ev.target.closest(".box").previousElementSibling
    const boxHTML = titleBox.innerHTML.split("</i>")
    boxHTML[1] = " " + ev.target.value
    titleBox.innerHTML = boxHTML.join("</i>")
}