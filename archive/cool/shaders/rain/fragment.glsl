uniform sampler2D pointTexture;
uniform float alpha;
uniform float pointRatio;
varying vec3 vColor;
varying float fTexIndex;

void main() {
  float rr = length(gl_PointCoord - vec2(0.5, 0.5));
  float ww = gl_PointCoord.x;
  float aa = 0.1;
  // aa = 1.0 - 2.0 * rr; // Alpha-Disc
  // aa = 0.1 - 2.0 * ww; // Alpha V-Rect
  gl_FragColor = vec4(vColor + vec3(aa, aa, aa), alpha);

  // if(rr > 0.5) discard; // Draw Disc
  if(ww > pointRatio)
    discard; // Draw V-Rect

  // if(fTexIndex == 1.0)
  //   gl_FragColor = vec4(gl_FragColor.xyz, 0.1) * texture2D(pointTexture, gl_PointCoord);
}
