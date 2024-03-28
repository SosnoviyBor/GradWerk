import { editor } from "../index.js"

editor.on('nodeCreated',        (id) => { console.log("Node created " + id) })
editor.on('nodeRemoved',        (id) => { console.log("Node removed " + id) })
editor.on('nodeSelected',       (id) => { console.log("Node selected " + id) })
editor.on('moduleCreated',      (name) => { console.log("Module Created " + name) })
editor.on('moduleChanged',      (name) => { console.log("Module Changed " + name) })
editor.on('nodeMoved',          (id) => { console.log("Node moved " + id) })
editor.on('zoom',               (zoom) => { console.log('Zoom level ' + zoom) })
editor.on('addReroute',         (id) => { console.log("Reroute added " + id) })
editor.on('removeReroute',      (id) => { console.log("Reroute removed " + id) })
editor.on('connectionCreated',  (connection) => {
    console.log('Connection created')
    console.log(connection)
})
editor.on('connectionRemoved', (connection) => {
    console.log('Connection removed')
    console.log(connection)
})
// editor.on('mouseMove', function(position) {
//   console.log('Position mouse x:' + position.x + ' y:'+ position.y)
// })
// editor.on('translate', function (position) {
//     console.log('Translate x:' + position.x + ' y:' + position.y)
// })