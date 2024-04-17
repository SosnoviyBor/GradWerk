class CommonElements {
    static set_dist = `
        <p>Distribution</p>
        <select df-dist>
            <option value="exponential">Exponential</option>
            <option value="normal">Normal</option>
            <option value="erlang">Erlang</option>
            <option value="uniform">Uniform</option>
        </select>
        <br><br>
    `

    static set_mean = `
        <p>Mean</p>
        <input type="number" value="1" df-mean>
        <br><br>
    `

    static set_deviation = `
        <p>Deviation</p>
        <input type="number" value="1" df-deviation>
        <br><br>
    `
    
    static set_replica_count = `
        <p>Replica count</p>
        <input type="number" df-replica value="1" min="1" step="1   ">
        <br><br>
    `
    
    static set_order = `
        <p>Element order</p>
        <select df-order>
            <option value="top to bottom">Top to bottom</option>
            <option value="random">Random</option>
        </select>
        <br><br>
    `

    static single_io = `
    <select df-order hidden disabled>
        <option value="random">Random</option>
    </select>
`
    
    static set_queue_size = `
        <p>Queue size</p>
        <input type="number" step="1" value="1" df-queuesize>
        <br><br>
    `

    static set_name(default_name) {
        return `
            <p>Name</p>
            <input type="text" df-name value="${default_name}"><br><br>
        `
    }
}


export const components = {
    "welcome": `
        <div>
            <div class="title-box"><i class="fa-solid fa-thumbtack"></i> Welcome!</div>
            <div class="box">
                <p><u><b>Values:</b></u></p>
                <p><b>Mean</b></p>
                <p>Depending on selected distribution it will set:</p>
                <ul>
                    <li>Exponential, normal, erlang: mean</li>
                    <li>Uniform: min</li>
                </ul>
                <p><b>Deviation</b></p>
                <p>Depending on selected distribution it will set:</p>
                <ul>
                    <li>Constant, exponential: nothing (can be left empty)</li>
                    <li>Normal: deviation</li>
                    <li>Erlang: k value</li>
                    <li>Uniform: max</li>
                </ul>
                <br><br>

                <p><u><b>Shortkeys:</b></u></p>
                <p><b>Delete</b> == Remove selected node</p>
                <p><b>Mouse Left Click</b> == Move</p>
                <p><b>Mouse Right</b> == Delete Option</p>
                <p><b>Ctrl + Wheel</b> == Zoom</p>
            </div>
        </div>
    `,
    
    "userinput": `
        <div>
            <div class="title-box"><i class="fa-solid fa-arrow-right-to-bracket"></i> User input</div>
            <div class="box">
                ${CommonElements.set_name("User input")}
                ${CommonElements.set_dist}
                ${CommonElements.set_mean}
                ${CommonElements.set_deviation}
                ${CommonElements.set_replica_count}

                ${CommonElements.single_io}
            </div>
        </div>
    `,

    "useroutput": `
        <div>
            <div class="title-box"><i class="fa-solid fa-arrow-right-from-bracket"></i> User output</div>
            <div class="box">
                ${CommonElements.set_name("Dispose")}
            </div>
        </div>
    `,

    "frontend": `
        <div>
            <div class="title-box"><i class="fa-solid fa-computer"></i> Frontend</div>
            <div class="box">
                ${CommonElements.set_name("Frontend")}
                ${CommonElements.set_dist}
                ${CommonElements.set_mean}
                ${CommonElements.set_deviation}
                ${CommonElements.set_queue_size}
                ${CommonElements.set_order}
                ${CommonElements.set_replica_count}
            </div>
        </div>
    `,

    "backend": `
        <div>
            <div class="title-box"><i class="fa-solid fa-server"></i> Backend</div>
            <div class="box">
                ${CommonElements.set_name("Backend")}
                ${CommonElements.set_dist}
                ${CommonElements.set_mean}
                ${CommonElements.set_deviation}
                ${CommonElements.set_queue_size}
                ${CommonElements.set_order}
                ${CommonElements.set_replica_count}
            </div>
        </div>
    `,

    "database": `
        <div>
            <div class="title-box"><i class="fa-solid fa-database"></i> Database</div>
            <div class="box">
                ${CommonElements.set_name("Database")}
                ${CommonElements.set_dist}
                ${CommonElements.set_mean}
                ${CommonElements.set_deviation}
                ${CommonElements.set_queue_size}
                ${CommonElements.set_order}
                ${CommonElements.set_replica_count}
            </div>
        </div>
    `,

    "comment": `
        <div>
            <div class="title-box"><i class="fa-solid fa-comment"></i> Comment</div>
            <div class="box">
                <textarea df-template></textarea>
            </div>
        </div>
    `,
}