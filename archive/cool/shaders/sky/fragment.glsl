uniform sampler2D pointTexture;
uniform float time;
uniform float speed;
uniform float alpha;
uniform float pointSize;
varying vec3 vColor;

void main() {
  float aa = vColor.r;
  float aaa = cos(time * speed * aa);
  float bb = 0.25 * aa;

  vec2 tmpPtCoord = gl_PointCoord - vec2(0.5, 0.5);
  tmpPtCoord = vec2(tmpPtCoord.x * cos(bb) + tmpPtCoord.y * sin(bb), tmpPtCoord.y * cos(bb) + tmpPtCoord.x * sin(bb));
  gl_FragColor = vec4(vColor, alpha);

  if(pointSize > 1.0) {
    gl_FragColor.a = alpha + aaa * 0.5 * alpha;
    gl_FragColor *= texture2D(pointTexture, vec2(0.5, 0.5) + tmpPtCoord);
  } else {
    float rr = length(gl_PointCoord - vec2(0.5, 0.5));
    if(rr > 0.5)
      discard;      // Draw Disc
  }
}
