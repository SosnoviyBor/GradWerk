import * as handlers from "./handlers.js"

var elements = document.getElementsByClassName('drag-drawflow');
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('touchend', handlers.drop, false);
    elements[i].addEventListener('touchmove', handlers.positionMobile, false);
    elements[i].addEventListener('touchstart', handlers.drag, false);
    elements[i].addEventListener('dragstart', (ev) => handlers.drag(ev))
}

document.getElementById("drawflow").addEventListener('dragover', (ev) => handlers.allowDrop(ev))
document.getElementById("drawflow").addEventListener('drop', (ev) => handlers.drop(ev))

document.getElementById("btn-export").addEventListener("click", () => handlers.exportAsJson())
document.getElementById("btn-import").addEventListener("click", () => handlers.importJson())
document.getElementById("import-input").addEventListener("change", () => handlers.readImportedJson())
document.getElementById("btn-clear").addEventListener("click", () => handlers.clear())

document.getElementById("start").addEventListener("click", () => handlers.requestSimulation())