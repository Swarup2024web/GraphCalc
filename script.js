let chart = null;

function plot() {
  const expr = document.getElementById('equation').value;
  const xStart = parseFloat(document.getElementById('xStart').value);
  const xEnd = parseFloat(document.getElementById('xEnd').value);
  const step = 0.1;

  if (isNaN(xStart) || isNaN(xEnd) || xStart >= xEnd) {
    alert("Invalid range values!");
    return;
  }

  const xValues = [];
  const yValues = [];

  for (let x = xStart; x <= xEnd; x += step) {
    try {
      const scope = { x: x };
      const y = math.evaluate(expr, scope);
      xValues.push(x);
      yValues.push(y);
    } catch (err) {
      alert("Error in equation: " + err.message);
      return;
    }
  }

  const ctx = document.getElementById('graphCanvas').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xValues,
      datasets: [{
        label: `y = ${expr}`,
        data: yValues,
        borderColor: '#00ffc8',
        backgroundColor: 'rgba(0, 255, 200, 0.1)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'x' } },
        y: { title: { display: true, text: 'y' } }
      },
      plugins: {
        legend: { labels: { color: '#fff' } }
      }
    }
  });
}
