attribute vec3 color;
varying vec3 vColor;
attribute float texIndex;
varying float fTexIndex;
uniform float time;
uniform float pointSize;
uniform float speed;
uniform float aoeRatio;

struct lightMesh {
  vec3 pos;
  vec3 color;
  // sampler2D emissiveMap;
};

// uniform lightMesh lightMeshes[${nbLights}]; // Heh?
uniform vec3 camPos;

void main() {
  vColor = color;

  vec3 tmpPos = aoeRatio * position;
  tmpPos.y = mod(tmpPos.y - time * speed, 10.0);

  if(pointSize == 1.0)
    tmpPos.y = 0.2 * cos(time * speed + position.y);

  tmpPos += vec3(camPos.x, 0.0, camPos.z);
  vec4 mvPosition = modelViewMatrix * vec4(tmpPos, 1.0);

  gl_PointSize = pointSize / -mvPosition.z;

  gl_Position = projectionMatrix * mvPosition;

  // vColor = vec3(0.0,0.0,0.0);
  for(int i = 0; i < 2; i++) {
    float dist = length(tmpPos - lightMeshes[i].pos);
    vColor += lightMeshes[i].color * 2.0 / pow(dist, 2.0);
  }
}
