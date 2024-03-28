class CommonElements {
    static set_dist = `
        <p>Select random value distribution</p>
        <select df-dist>
            <option value="constant">Constant</option>
            <option value="exponential">Exponential</option>
            <option value="normal">Normal</option>
            <option value="erlang">Erlang</option>
            <option value="uniform">Uniform</option>
        </select><br><br>
    `

    static set_first_val = `
        <p>Input first value</p>
        <p>Depending on selected distribution it will set:</p>
        <ul>
            <li>Constant: const value</li>
            <li>Exponential, normal, erlang: mean</li>
            <li>Uniform: min</li>
        </ul>
        <input type="number" df-first-value placeholder="First value"><br><br>
    `

    static set_second_val = `
        <p>Input second value</p>
        <p>Depending on selected distribution it will set:</p>
        <ul>
            <li>Constant, exponential: nothing (can be left empty)</li>
            <li>Normal: deviation</li>
            <li>Erlang: k</li>
            <li>Uniform: max</li>
        </ul>
        <input type="number" df-second-value placeholder="Second value"><br><br>
    `
    static set_replica_count = `
        <p>Element replica count</p>
        <input type="number" df-name placeholder="Replica count" value="1" min="1"><br><br>
    `
}


export const components = {
    
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
                <p>Name your element</p>
                <input type="text" df-name placeholder="Element name" value="Frontend"><br><br>

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
                <p>Name your element</p>
                <input type="text" df-name placeholder="Element name" value="Backend"><br><br>

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
                <p>Name your element</p>
                <input type="text" df-name placeholder="Element name" value="Database"><br><br>

                ${CommonElements.set_dist}
                ${CommonElements.set_first_val}
                ${CommonElements.set_second_val}
                ${CommonElements.set_replica_count}
            </div>
        </div>
    `,
}