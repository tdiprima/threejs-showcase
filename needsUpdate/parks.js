// the count has to be the number of violation of each boro

export default class ParkingSpot {
  constructor(radius, length, power, texture, data) {
    this.radius = radius;
    this.length = data.length;
    this.texture = texture;
    this.material = undefined;
    this.geometry = undefined;
    this.data = data;
    this.positions = undefined;
    this.power = power;
    this.colors = undefined;
    this.colorScheme = { innerColor: undefined, outterColor: undefined };
    this.innerColor = undefined;
    this.outterColor = undefined;
    this.sphereMesh = undefined;
  }

  createTexture() {
    this.material = new THREE.PointsMaterial({
      sizeAttenuation: true,
      size: 0.05,
      vertextColor: true,
      map: this.texture,
      transparent: true
    });
    this.material.depthTest = false;
  }

  createPalette() {
    switch (this.data[0].County) {
      case "BK":
        this.innerColor = "#153259";
        this.outterColor = "#778C8C";
        break;
      case "MN":
        this.innerColor = "#F2385A";
        this.outterColor = "#F28585";
        break;
      case "BX":
        this.innerColor = "#F25F29";
        this.outterColor = "#F2C0A2";
        break;
      case "QN":
        this.innerColor = "#F20587";
        this.outterColor = "#F2B705";
        break;
      case "ST":
        this.innerColor = "#3A731F";
        this.outterColor = "#88A66A";
    }

    this.colorScheme.innerColor = new THREE.Color(this.innerColor);
    this.colorScheme.outterColor = new THREE.Color(this.outterColor);

    this.colors = new Float32Array(this.length * 3);
  }

  createGeometry() {
    this.geometry = new THREE.BufferGeometry();

    this.positions = new Float32Array(this.length * 3);

    for (let i = 0; i < this.length; i++) {
      const i3 = i * 3;
      const distance = this.radius * Math.pow(Math.random(), 1 / this.power);
      const angle1 = Math.PI * 2 * Math.random();
      const angle2 = Math.PI * 2 * Math.random();

      this.positions[i3] = distance * Math.sin(angle1) * Math.cos(angle2);
      this.positions[i3 + 1] = distance * Math.sin(angle1) * Math.sin(angle2);
      this.positions[i3 + 2] = distance * Math.cos(angle1);

      // creating vertex Color

      const mixedColor = this.vertexColor(distance);

      this.colors[i3] = mixedColor.r;
      this.colors[i3 + 1] = mixedColor.g;
      this.colors[i3 + 2] = mixedColor.b;
    }
  }

  feedGeometry() {
    this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));
  }

  vertexColor(distance) {
    const mixedColor = this.colorScheme.innerColor.clone();
    mixedColor.lerp(this.colorScheme.outterColor, distance / this.radius);

    return mixedColor;
  }

  createMesh() {
    this.createTexture();
    this.createPalette();
    this.createGeometry();
    this.feedGeometry();

    this.sphereMesh = new THREE.Points(this.geometry, this.material);

    this.sphereMesh.geometry.attributes.position.originalPosition = this.sphereMesh.geometry.attributes.position.array;

    return this.sphereMesh;
  }

  movePoints() {
    for (let i = 0; this.length; i++) {
      const i3 = i * 3;
      this.sphereMesh.geometry.attributes.position.array[i3] =
        this.sphereMesh.geometry.attributes.position.originalPosition[i3] + 0.1;
      this.sphereMesh.geometry.attributes.position.array[i3 + 1] =
        this.sphereMesh.geometry.attributes.position.originalPosition[i3 + 1] + 0.1;
      this.sphereMesh.geometry.attributes.position.array[i3 + 2] =
        this.sphereMesh.geometry.attributes.position.originalPosition[i3 + 2] + 0.1;
    }
  }
}
