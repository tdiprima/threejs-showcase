/**
 * https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
 * @param {number} h - hue
 * @param {number} s - saturation
 * @param {number} l - lightness
 * @return {string}
 */
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// let result = hslToHex(360, 100, 50);  // "#ff0000" -> red
// console.log(result);
