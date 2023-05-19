attribute vec3 color;
varying vec3 vColor;
uniform float time;
uniform float speed;
uniform float pointSize;

void main() {
  vColor = color;
  float aa = vColor.r;

  vec3 tmpPos = position;
  vec4 mvPosition = modelViewMatrix * vec4(tmpPos, 1.0);

  gl_PointSize = pointSize * (1.0 + 2.0 * aa);
  if(pointSize <= 1.0)
    gl_PointSize *= cos(time * speed * aa);
    // gl_PointSize /= -mvPosition.z;

  gl_Position = projectionMatrix * mvPosition;
}
