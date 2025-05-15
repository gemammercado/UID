const slider = document.getElementById('shade-tint-slider');
const preview = document.getElementById('color-preview');
const label = document.getElementById('slider-label');

const baseColor = { r: 0, g: 0, b: 255 }; // Example base color (red)

function applyTintShade(value) {
const mix = (c, target, amount) => Math.round(c + (target - c) * amount);

let result = { ...baseColor };

if (value > 0) {
    //tint
    const amount = value / 100;
    result.r = mix(baseColor.r, 255, amount);
    result.g = mix(baseColor.g, 255, amount);
    result.b = mix(baseColor.b, 255, amount);
    label.textContent = `+${value}% Tint (White added)`;
} else if (value < 0) {
    //shade
    const amount = Math.abs(value) / 100;
    result.r = mix(baseColor.r, 0, amount);
    result.g = mix(baseColor.g, 0, amount);
    result.b = mix(baseColor.b, 0, amount);
    label.textContent = `${value}% Shade (Black added)`;
} else {
    label.textContent = "No tint or shade applied.";
}

preview.style.backgroundColor = `rgb(${result.r}, ${result.g}, ${result.b})`;
}

slider.addEventListener('input', (e) => {
applyTintShade(parseInt(e.target.value));
});

applyTintShade(0);

