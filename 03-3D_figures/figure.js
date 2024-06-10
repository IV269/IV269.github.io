import { vertex, Timer, mat4, vec3, primitive } from "./lib.js";

function D2R(L) {
  return L * (Math.PI / 180.0);
}

class Figure {
  constructor() {
    this.vertexes = [];
    this.time = new Timer();
    this.matrix = mat4();
  }

  makePrim(rnd, matrix) {
    let indicies = [];
    let vertexes = [];
    let j = 0;
    this.matrix = matrix;

    for (let edge of this.vertexes) {
      for (let v of edge) {
        vertexes.push(vertex(v, vec3(0)));
      }

      for (let i = 2; i < edge.length; i++) {
        indicies.push(j + 0);
        indicies.push(j + i - 1);
        indicies.push(j + i);
      }
      j += edge.length;
    }

    return new primitive(rnd, vertexes, indicies);
  }
}

export class Cube extends Figure {
  constructor() {
    super();
    this.vertexes = [
      [
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5, 0.5, -0.5),
        vec3(0.5, 0.5, -0.5),
        vec3(0.5, -0.5, -0.5),
      ], // Front
      [
        vec3(-0.5, -0.5, 0.5),
        vec3(-0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, -0.5, 0.5),
      ], // Back
      [
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5, -0.5, 0.5),
        vec3(-0.5, 0.5, 0.5),
        vec3(-0.5, 0.5, -0.5),
      ], // Left
      [
        vec3(0.5, -0.5, -0.5),
        vec3(0.5, -0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.5, -0.5),
      ], // Right
      [
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5, -0.5, 0.5),
        vec3(0.5, -0.5, 0.5),
        vec3(0.5, -0.5, -0.5),
      ], // Bottom
      [
        vec3(-0.5, 0.5, -0.5),
        vec3(-0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.5, -0.5),
      ], // Top
    ];
  }
}

export class Tetrahedron extends Figure {
  constructor() {
    super();
    const sqrt3 = Math.sqrt(3.0),
      sqrt2 = Math.sqrt(2.0);

    const top = vec3(0, sqrt2 / sqrt3, 0),
      front = vec3(0, 0, sqrt3 / 3.0),
      left = vec3(-0.5, 0, -sqrt3 / 6.0),
      right = vec3(0.5, 0, -sqrt3 / 6.0);

    this.vertexes = [
      [left, front, top],
      [left, right, top],
      [right, front, top],
      [front, right, left],
    ];
  }
}

export class Octahedron extends Figure {
  constructor() {
    super();
    const left = vec3(-0.5, 0, 0),
      far = vec3(0, 0.5, 0),
      right = vec3(0.5, 0, 0),
      near = vec3(0, -0.5, 0),
      down = vec3(0, 0, -0.5),
      up = vec3(0, 0, 0.5);
    this.vertexes = [
      [near, left, up],
      [near, right, up],
      [near, right, down],
      [near, left, down],
      [left, far, up],
      [left, far, down],
      [right, far, up],
      [right, far, down],
    ];
  }
}

export class Icosahedron extends Figure {
  constructor() {
    super();
    const cos36 = Math.cos(D2R(36)) / 2,
      sin36 = Math.sin(D2R(36)) / 2,
      cos72 = Math.cos(D2R(72)) / 2,
      sin72 = Math.sin(D2R(72)) / 2,
      d = Math.sqrt(2 * (cos36 - sin36)) / 2,
      r = Math.sqrt((d * d) / 4 + 1) / 2,
      down = vec3(0, 0, -r),
      up = vec3(0, 0, r),
      dr = vec3(1 / 2, 0, -d),
      dru = vec3(cos72, sin72, -d),
      dlu = vec3(-cos36, sin36, -d),
      dld = vec3(-cos36, -sin36, -d),
      drd = vec3(cos72, -sin72, -d),
      ul = vec3(-1 / 2, 0, d),
      ulu = vec3(-cos72, sin72, d),
      uru = vec3(cos36, sin36, d),
      urd = vec3(cos36, -sin36, d),
      uld = vec3(-cos72, -sin72, d);

    this.vertexes = [
      [down, dr, dru], // down corner
      [down, dru, dlu],
      [down, dlu, dld],
      [down, dld, drd],
      [down, drd, dr],
      [dr, uru, dru], // center start
      [uru, dru, ulu],
      [dru, ulu, dlu],
      [ulu, dlu, ul],
      [dlu, ul, dld],
      [ul, dld, uld],
      [dld, uld, drd],
      [uld, drd, urd],
      [drd, urd, dr],
      [urd, dr, uru], // center end
      [up, ul, ulu], // up corner
      [up, ulu, uru],
      [up, uru, urd],
      [up, urd, uld],
      [up, uld, ul],
    ];
  }
}
