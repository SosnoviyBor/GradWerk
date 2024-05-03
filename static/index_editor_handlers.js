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