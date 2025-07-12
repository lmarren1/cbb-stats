async function loadGameData() {
    const team = document.getElementById('team').value;
    const game = document.getElementById('game').value;

    const response = await fetch(`/api?team=${team}&game=${game}`);
    const data = await response.json();

    drawPlotlyChart(data.players, data.points);
}

function drawPlotlyChart(labels, values) {
    const trace = {
        x: labels,
        y: values,
        type: 'bar',
        marker: { color: 'steelblue' }
    };

    const layout = {
        title: 'Points by Player',
        xaxis: { title: 'Player' },
        yaxis: { title: 'Points' }
    };

    Plotly.newPlot('chart', [trace], layout);
}
