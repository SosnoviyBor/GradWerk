import { editor } from "./index/main.js"
import { init_dbclickbox_listeners, calculateThroughputDifference } from "./index/editor_handlers.js"


export function post_to_new_tab(json, link) {
    const inp = document.createElement("input")
    inp.id = "result_middleman"
    inp.name = "result"
    inp.type = "hidden"
    inp.value = JSON.stringify(json)

    const form = document.createElement("form")
    form.action = link
    form.method = "post"
    form.target = "_blank"
    form.encoding = "UTF-8"
    form.hidden = true
    form.appendChild(inp)

    document.getElementsByClassName("wrapper")[0].appendChild(form)
    form.submit()
    form.remove()
}


export function mean(arr) {
    return arr.reduce( ( p, c ) => p + c, 0 ) / arr.length
}


export function init_nodes_dbclickboxes_and_throughputs() {
    Array.from(Object.keys(editor.export()["drawflow"]["Home"]["data"]),
        (id) => {
            init_dbclickbox_listeners(id)
        }
    )
    calculateThroughputDifference()
}