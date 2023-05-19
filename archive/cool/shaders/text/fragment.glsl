uniform float time;
uniform float speed;
uniform vec4 uColor;
uniform sampler2D tex0;
varying vec2 vUv;

void main(void) {
  vec4 vColor0 = texture2D(tex0, vUv);
  float aa = 1.0 + 0.9 * cos(90.0 * vUv.x + time * speed);

  gl_FragColor = vec4(uColor.a * uColor.xyz * vColor0.xyz, vColor0.a);
  gl_FragColor.xyz *= aa;

  if(uColor.a * vColor0.a < 0.05)
    discard;
}
