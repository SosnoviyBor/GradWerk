

export function generate_chart(element, label, param, border_color, bg_color) {
    return new Chart(element, {
            type: 'bar',
            data: {
                labels: parse_data("name").map(row => row.name),
                datasets: [
                    {
                        label: label,
                        labelSize: 20,
                        data: parse_data(param).map(row => row.value),
                        borderColor: border_color,
                        borderWidth: 2,
                        backgroundColor: bg_color,
                    },
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: label,
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    );
}

function parse_data(value) {
    const data = []

    Array.from(document.getElementsByClassName("element")).forEach(element => {
        data.push({
            name: element.dataset.name,
            value: element.dataset[value]
        })
    });

    return data
}