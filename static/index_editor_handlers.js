import { editor } from "./index.js"

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
}


export function init_dbclickbox_listeners(id) {
    const box = document.getElementById(`node-${id}`).getElementsByClassName("box")[0]

    if (!box.classList.contains("dbclickbox")) { return }

    box.addEventListener("dblclick", (ev) => showPopup(ev))
    box.querySelector("span").addEventListener("click", (ev) => closeModal(ev))
    box.querySelector(".df-name").addEventListener("change", (ev) => updateName(ev))
}


var transform = '';
const default_zoom_value = editor.zoom_value
const default_zoom_min = editor.zoom_min
const default_zoom_max = editor.zoom_max
function showPopup(ev) {
    // to prevent doublickicks registering on any inner tags
    // not that they break popups anyway
    // but at least it looks neat
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
    ev.target.parentElement.parentElement.style.display  ="none";
    editor.precanvas.style.transform = transform;
    editor.precanvas.style.left = '0px';
    editor.precanvas.style.top = '0px';
    editor.zoom_value = default_zoom_value
    editor.zoom_min = default_zoom_min
    editor.zoom_max = default_zoom_max
}


function updateName(ev) {
    const titleBox = ev.target.closest(".box").previousElementSibling
    const boxHTML = titleBox.innerHTML.split("</i>")
    boxHTML[1] = " " + ev.target.value
    titleBox.innerHTML = boxHTML.join("</i>")
}