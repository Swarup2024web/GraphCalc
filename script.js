let chart = null;
let animationInterval = null;

function plot() {
  const expr = document.getElementById('equation').value;
  const xStart = parseFloat(document.getElementById('xStart').value);
  const xEnd = parseFloat(document.getElementById('xEnd').value);
  const step = 0.1;

  if (isNaN(xStart) || isNaN(xEnd) || xStart >= xEnd) {
    alert("Invalid range values!");
    return;
  }

  // Stop previous animation if running
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }

  const xFull = [];
  const yFull = [];

  for (let x = xStart; x <= xEnd; x += step) {
    try {
      const y = math.evaluate(expr, { x: x });
      xFull.push(x);
      yFull.push(y);
    } catch (err) {
      alert("Equation error: " + err.message);
      return;
    }
  }

  const ctx = document.getElementById('graphCanvas').getContext('2d');
  if (chart) chart.destroy();

  // Start with empty dataset
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: `y = ${expr}`,
        data: [],
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
      animation: false, // Turn off default animation
      scales: {
        x: { title: { display: true, text: 'x' }, ticks: { color: '#fff' } },
        y: { title: { display: true, text: 'y' }, ticks: { color: '#fff' } }
      },
      plugins: {
        legend: { labels: { color: '#fff' } }
      }
    }
  });

  // Animate the line like a snake 🐍
  let i = 0;
  animationInterval = setInterval(() => {
    if (i >= xFull.length) {
      clearInterval(animationInterval);
      return;
    }
    chart.data.labels.push(xFull[i]);
    chart.data.datasets[0].data.push(yFull[i]);
    chart.update();
    i++;
  }, 20); // Speed of animation (lower is faster)
}
