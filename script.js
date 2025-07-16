let chart = null;
let animationInterval = null;
let animationPaused = false;
let currentIndex = 0;
let xFull = [];
let yFull = [];
let colorHue = 0; // Starting color hue for rainbow effect

function plot() {
  const expr = document.getElementById('equation').value;
  const xStart = parseFloat(document.getElementById('xStart').value);
  const xEnd = parseFloat(document.getElementById('xEnd').value);
  const step = 0.1;

  // Validate range
  if (isNaN(xStart) || isNaN(xEnd) || xStart >= xEnd) {
    alert("Invalid range values!");
    return;
  }

  // Stop any previous animation
  if (animationInterval) clearInterval(animationInterval);
  animationPaused = false;
  currentIndex = 0;
  colorHue = 0;
  xFull = [];
  yFull = [];

  // Prepare x and y data
  for (let x = xStart; x <= xEnd; x += step) {
    try {
      const y = math.evaluate(expr, { x: x });
      xFull.push(x);
      yFull.push(y);
    } catch (err) {
      alert("Error in equation: " + err.message);
      return;
    }
  }

  // Destroy old chart
  const ctx = document.getElementById('graphCanvas').getContext('2d');
  if (chart) chart.destroy();

  // Create new chart
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: `y = ${expr}`,
        data: [],
        borderColor: `hsl(${colorHue}, 100%, 60%)`,
        backgroundColor: 'rgba(255,255,255,0.05)',
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
          ticks: { color: '#ffffff' }
        },
        y: {
          title: { display: true, text: 'y' },
          ticks: { color: '#ffffff' }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#ffffff' }
        }
      }
    }
  });

  // Start animation
  startAnimation();
}

function startAnimation() {
  const speed = parseInt(document.getElementById('speedSlider').value);
  const delay = 110 - speed; // 100 = slow, 10 = fast

  animationInterval = setInterval(() => {
    if (!animationPaused && currentIndex < xFull.length) {
      chart.data.labels.push(xFull[currentIndex]);
      chart.data.datasets[0].data.push(yFull[currentIndex]);

      // 🌈 Update line color gradually (animated)
      colorHue = (colorHue + 2) % 360;
      chart.data.datasets[0].borderColor = `hsl(${colorHue}, 100%, 60%)`;

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

  // Resume animation if needed
  if (!animationInterval && currentIndex < xFull.length) {
    startAnimation();
  }
                    }
