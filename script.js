let chart = null;
let animationInterval = null;
let animationPaused = false;
let currentIndex = 0;
let xFull = [];
let yFull = [];

function getRandomColor() {
  const colors = ['#ff4dc4', '#00ffc8', '#ffa500', '#00ff88', '#ff0066', '#66ff66'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function plot() {
  const expr = document.getElementById('equation').value;
  const xStart = parseFloat(document.getElementById('xStart').value);
  const xEnd = parseFloat(document.getElementById('xEnd').value);
  const step = 0.1;

  if (isNaN(xStart) || isNaN(xEnd) || xStart >= xEnd) {
    alert("Invalid range values!");
    return;
  }

  // Clear previous animation if exists
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }

  currentIndex = 0;
  animationPaused = false;
  xFull = [];
  yFull = [];

  for (let x = xStart; x <= xEnd; x += step) {
    try {
      const y = math.evaluate(expr, { x });
      xFull.push(x);
      yFull.push(y);
    } catch (err) {
      alert("Equation error: " + err.message);
      return;
    }
  }

  const ctx = document.getElementById('graphCanvas').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: `y = ${expr}`,
        data: [],
        borderColor: getRandomColor(),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: {
          title: { display: true, text: 'x' },
          ticks: { color: '#fff' }
        },
        y: {
          title: { display: true, text: 'y' },
          ticks: { color: '#fff' }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        }
      }
    }
  });

  startAnimation();
}

function startAnimation() {
  const speed = parseInt(document.getElementById('speedSlider').value);
  const delay = 110 - speed;

  animationInterval = setInterval(() => {
    if (!animationPaused && currentIndex < xFull.length) {
      chart.data.labels.push(xFull[currentIndex]);
      chart.data.datasets[0].data.push(yFull[currentIndex]);
      chart.update();
      currentIndex++;
    }

    if (currentIndex >= xFull.length) {
      clearInterval(animationInterval);
    }
  }, delay);
}

function toggleAnimation() {
  animationPaused = !animationPaused;

  // If resumed after pause and interval was cleared, restart
  if (!animationInterval && currentIndex < xFull.length) {
    startAnimation();
  }
}
