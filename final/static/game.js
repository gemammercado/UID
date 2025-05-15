let selectedColors = [];
let targetHex = "#577f06";
let targetColor;

let targetBox = document.querySelector('.target-color');
targetBox.style.backgroundColor = targetHex;

document.querySelectorAll('.pigment').forEach(pigment => {
  pigment.setAttribute('draggable', true);
  pigment.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', pigment.getAttribute('data-color'));
  });
});

const mixTarget = document.getElementById('mix-target');
const clearButton = document.getElementById('clear-mix');

mixTarget.addEventListener('dragover', (e) => {
  e.preventDefault(); 
});

mixTarget.addEventListener('dragenter', () => {
  mixTarget.classList.add('drag-over');
});

mixTarget.addEventListener('dragleave', () => {
  mixTarget.classList.remove('drag-over');
});

mixTarget.addEventListener('drop', (e) => {
  e.preventDefault();
  mixTarget.classList.remove('drag-over');

  const color = e.dataTransfer.getData('text/plain');
  const rgb = hexToRgb(color);
  if (rgb) {
    selectedColors.push(rgb);
    updateMixedColor();
  }
});

clearButton.addEventListener('click', () => {
  selectedColors = [];
  document.querySelector('.current-color').style.backgroundColor = 'white';
}
);

function hexToRgb(color) {
  const namedColors = {
    red: "#ff0000", redorange: "#ff4400", orange: "#ffa500",
    yelloworange: "#fbb400", yellow: "#ffff00", yellowgreen: "#bfff00",
    green: "#008000", bluegreen: "#009678", blue: "#0000ff",
    blueviolet: "#8a2be2", purple: "#800080", redviolet: "#c71585",
    white: "#ffffff", black: "#000000"
  };
  if (namedColors[color]) color = namedColors[color];
  if (!color.startsWith("#")) return null;

  const bigint = parseInt(color.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function updateMixedColor() {
    if (selectedColors.length === 0) return;
  
    const avg = getAverageColor(selectedColors);
    const rgbString = `rgb(${avg.r}, ${avg.g}, ${avg.b})`;
    document.querySelector('.current-color').style.backgroundColor = rgbString;
  }
  
function getAverageColor(colors) {
  if (selectedColors.length === 0) return;

  const total = selectedColors.reduce((acc, c) => ({
    r: acc.r + c.r,
    g: acc.g + c.g,
    b: acc.b + c.b
  }), { r: 0, g: 0, b: 0 });

  const count = selectedColors.length;
  return {
    r: Math.round(total.r/count),
    g: Math.round(total.g/count),
    b: Math.round(total.b/count)
  };
}

function colorMatch(c1, c2, tolerance = 30) {
    return (
      Math.abs(c1.r-c2.r) <= tolerance &&
      Math.abs(c1.g-c2.g) <= tolerance &&
      Math.abs(c1.b- c2.b) <= tolerance
    );
  }
  
//check if the mixed matches target

document.getElementById('submit-mix').addEventListener('click', () => {
    if (selectedColors.length === 0) return;
  
    const userColor = getAverageColor(selectedColors);
  
    const isMatch = colorMatch(userColor, targetColor);
    const feedback = document.getElementById('feedback');
    if(isMatch) {
        feedback.style.color = 'green';
        feedback.textContent = "Correct!";
    } else {
        feedback.style.color = 'red';
        feedback.textContent = "Not quite. Try again.";
    }
    feedback.style.display = 'block';
  });
  

//Get a new target mix 
function loadNewTargetColor() {
    fetch('/new-target-color')
      .then(response => response.json())
      .then(data => {
        const newHex = data.color;
        targetBox.style.backgroundColor = newHex;
        targetColor = hexToRgb(newHex);
        selectedColors = [];
        document.querySelector('.current-color').style.backgroundColor = 'white';
        document.getElementById('feedback').textContent = '';
      })
      .catch(err => console.error("Error fetching new target color:", err));
  }
  document.getElementById('new-mix').addEventListener('click', loadNewTargetColor);
  document.addEventListener('DOMContentLoaded', loadNewTargetColor);
    
  
