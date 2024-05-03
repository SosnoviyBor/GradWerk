(async function () {
    const data = parse_data("failure_probability")
    new Chart(
        document.getElementById('chart'),
        {
            type: 'bar',
            data: {
                labels: data.map(row => row.name),
                datasets: [
                    {
                        label: 'Failure probabilites per element',
                        data: data.map(row => row.param)
                    }
                ]
            }
        }
    );
})();

function parse_data(param) {
    const data = []

    Array.from(document.getElementsByClassName("element")).forEach(element => {
        if (element.getElementsByClassName(`result-${param}`).length > 0) {
            data.push({
                name: element.getElementsByClassName("element-name")[0].innerHTML,
                // its retarted
                // and it will eventually break
                // but it works
                // so fuck me
                param: element.getElementsByClassName(`result-${param}`)[0].innerHTML.split(": ")[1]
            })
        }
    });

    return data
}