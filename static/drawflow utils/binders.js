import { editor } from "../index.js";
import * as handlers from "./event_handlers.js"

var elements = document.getElementsByClassName('drag-drawflow');
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('touchend', handlers.drop, false);
    elements[i].addEventListener('touchmove', handlers.positionMobile, false);
    elements[i].addEventListener('touchstart', handlers.drag, false);
    elements[i].addEventListener('dragstart', (ev) => { handlers.drag(ev) })
}

document.getElementById("drawflow").addEventListener('dragover', (ev) => { handlers.allowDrop(ev) })
document.getElementById("drawflow").addEventListener('drop', (ev) => { handlers.drop(ev) })

document.getElementById("btn-export").addEventListener("click", () => Swal.fire({
    title: 'Export',
    html: '<pre><code>'+JSON.stringify(editor.export(), null,4)+'</code></pre>'
}))
document.getElementById("btn-clear").addEventListener("click", () => editor.clearModuleSelected())