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


export function init_dbclickbox_listeners(id) {
    const box = document.getElementById(`node-${id}`).getElementsByClassName("box")[0]

    if (!box.classList.contains("dbclickbox")) { return }

    box.addEventListener("dblclick", (ev) => showPopup(ev))
    box.querySelector("span").addEventListener("click", (ev) => closeModal(ev))
    box.querySelector(".df-name").addEventListener("change", (ev) => updateName(ev))
}


var transform = '';
function showPopup(ev) {
    // to prevent doublickicks registering on any inner tags
    // not that they break popups anyway
    // but at least it looks neat
    if (!ev.target.classList.contains("box")) { return }

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
}


function updateName(ev) {
    const titleBox = ev.target.closest(".box").previousElementSibling
    const boxHTML = titleBox.innerHTML.split("</i>")
    boxHTML[1] = " " + ev.target.value
    titleBox.innerHTML = boxHTML.join("</i>")
}