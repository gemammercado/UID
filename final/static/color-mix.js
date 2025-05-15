document.addEventListener("DOMContentLoaded", () => {
  const pigments = document.querySelectorAll(".pigment");
  const wheelSlices = document.querySelectorAll(".color-slice.white");

  // Dragging pigment
  pigments.forEach(pigment => {
    pigment.addEventListener("dragstart", e => {
      const color = pigment.dataset.color;
      e.dataTransfer.setData("text/plain", color);
    });

    pigment.addEventListener("dblclick", () => {

      const color = pigment.dataset.color?.toLowerCase();
      
      const primaryColors = ["red", "blue", "yellow", "rgb(255, 0, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)"];
      if (color && primaryColors.includes(color)) return;


      pigment.style.backgroundColor = "transparent";
      delete pigment.dataset.color;
    });

    pigment.addEventListener("dragover", e => e.preventDefault());

    pigment.addEventListener("drop", e => {
    
      e.preventDefault();
      const draggedColor = e.dataTransfer.getData("text/plain");
      const targetColor = pigment.dataset.color;
      console.log("Dragged color:", draggedColor);
      console.log("Target color:", targetColor);

      if (!draggedColor) {
        console.warn("Missing dragged color");
        return;
      }
    
      let newColor;
    
      if (!targetColor) {
        newColor = draggedColor;
      } else {
        newColor = mixColors(draggedColor, targetColor);
      }
    
      pigment.style.backgroundColor = newColor;
      pigment.dataset.color = newColor;
    });
  });

  // Dropping pigment onto color wheel slice
  wheelSlices.forEach(slice => {

    slice.addEventListener("dblclick", () => {
      slice.style.fill = "white";
    });

    slice.addEventListener("dragover", e => e.preventDefault());
    slice.addEventListener("drop", e => {
      e.preventDefault();
      const draggedColor = e.dataTransfer.getData("text/plain");
      if (draggedColor) {
        slice.style.fill = draggedColor;
      }
    });
  });

  function parseColor(color) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  }
  

  function mixColors(color1, color2) {
    const normalized1 = normalizeColorName(color1);
    const normalized2 = normalizeColorName(color2);
    console.log("Normalized color 1:", normalized1);
    console.log("Normalized color 2:", normalized2);

    //blue and yellow make green
    if ((normalized1 === '#ffff00' && normalized2 === '#0000ff') ||
       (normalized1 === '#0000ff' && normalized2 === '#ffff00')) {
        console.log("Blue and yellow mixed");
        return 'rgb(0, 128, 0)'; // or any green you prefer
    }

    //blue and red make violet
    if((normalized1 === '#ff0000' && normalized2 === '#0000ff') ||
    (normalized1 === '#0000ff' && normalized2 === '#ff0000')){
      return 'rgb(128, 0, 128)'; 
    }

    if((normalized1 === '#0000ff' && normalized2 === '#008000') ||
    (normalized1 === '#008000' && normalized2 === '#0000ff')){
      return 'rgb(0,150,120)'; 
    }

    const rgb1 = parseColor(color1);
    const rgb2 = parseColor(color2);
  
    const hsl1 = rgbToHsl(...rgb1);
    const hsl2 = rgbToHsl(...rgb2);
  
    const mixedH = mixHue(hsl1[0], hsl2[0]); // better hue mixing
    const mixedS = (hsl1[1] + hsl2[1]) / 2;
    const mixedL = (hsl1[2] + hsl2[2]) / 2;
  
    const mixedRgb = hslToRgb(mixedH, mixedS, mixedL);
    return `rgb(${mixedRgb[0]}, ${mixedRgb[1]}, ${mixedRgb[2]})`;
  }
  
  
});

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  h /= 360;

  let r, g, b;
  if (s === 0) {
    r = g = b = l; 
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function mixHue(h1, h2) {
  const diff = Math.abs(h1 - h2);
  if (diff > 180) {
    const avg = (h1 + h2 + 360) / 2;
    return avg % 360;
  } else {
    return (h1 + h2) / 2;
  }
}

function normalizeColorName(color) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = color;
  return ctx.fillStyle.toLowerCase(); 
}



