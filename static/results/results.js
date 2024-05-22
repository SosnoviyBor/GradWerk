// TODO create 4 separate charts
// create function to create charts?
const chart = new Chart(
    document.getElementById('chart'),
    {
        type: 'bar',
        data: {
            labels: parse_data("name").map(row => row.name),
            datasets: [
                {
                    label: 'Failure probability',
                    data: parse_data("failureProbability").map(row => row.value)
                },
                {
                    label: 'Mean queue length',
                    data: parse_data("meanQueueLength").map(row => row.value)
                },
                {
                    label: 'Successful transactions',
                    data: parse_data("quantity").map(row => row.value),
                    hidden: true
                },
                {
                    label: 'Total failures',
                    data: parse_data("failures").map(row => row.value),
                    hidden: true
                },
            ]
        }
    }
);

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