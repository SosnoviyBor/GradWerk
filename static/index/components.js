class CommonElements {
    static set_dist = `
        <p>Distribution</p>
        <select df-dist>
            <option value="constant">Constant</option>
            <option value="exponential">Exponential</option>
            <option value="normal">Normal</option>
            <option value="erlang">Erlang</option>
            <option value="uniform">Uniform</option>
        </select>
        <br><br>
    `

    static set_first_val = `
        <p>Mean</p>
        <input type="number" df-first-value placeholder="First value">
        <br><br>
    `

    static set_second_val = `
        <p>Deviation</p>
        <input type="number" df-second-value placeholder="Second value">
        <br><br>
    `
    static set_replica_count = `
        <p>Replica count</p>
        <input type="number" df-name placeholder="Replica count" value="1" min="1">
        <br><br>
    `

    static set_name(default_name) {
        return `
            <p>Name your element</p>
            <input type="text" df-name placeholder="Element name" value="${default_name}"><br><br>
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
                    <li>Constant: const value</li>
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
        </div>
    `,

    "useroutput": `
        <div>
            <div class="title-box"><i class="fa-solid fa-arrow-right-from-bracket"></i> User output</div>
        </div>
    `,

    "frontend": `
        <div>
            <div class="title-box"><i class="fa-solid fa-computer"></i> Frontend</div>
            <div class="box">
                ${CommonElements.set_name("Frontend")}
                ${CommonElements.set_dist}
                ${CommonElements.set_first_val}
                ${CommonElements.set_second_val}
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
                ${CommonElements.set_first_val}
                ${CommonElements.set_second_val}
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
                ${CommonElements.set_first_val}
                ${CommonElements.set_second_val}
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