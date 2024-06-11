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
    /*
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
      [right, front, left],
    ];
    */
    const a = 1,
      r = Math.sqrt(a * a - (a * a) / 4) / 3,
      h = Math.sqrt(a * a - 4 * r * r),
      top = vec3(0, 0, (3 * h) / 4),
      left = vec3(-a / 2, -r, -h / 4),
      right = vec3(a / 2, -r, -h / 4),
      front = vec3(0, 2 * r, -h / 4);

    this.vertexes = [
      [left, front, top],
      [left, right, top],
      [right, front, top],
      [right, front, left],
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

export class Dodecahedron extends Figure {
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

    const v11 = up.add(ul.add(ulu)).divNum(3),
      v12 = up.add(ulu.add(uru)).divNum(3),
      v13 = up.add(uru.add(urd)).divNum(3),
      v14 = up.add(urd.add(uld)).divNum(3),
      v15 = up.add(uld.add(ul)).divNum(3),
      v21 = dr.add(uru.add(dru)).divNum(3),
      v31 = uru.add(dru.add(ulu)).divNum(3),
      v22 = dru.add(ulu.add(dlu)).divNum(3),
      v32 = ulu.add(dlu.add(ul)).divNum(3),
      v23 = dlu.add(ul.add(dld)).divNum(3),
      v33 = ul.add(dld.add(uld)).divNum(3),
      v24 = dld.add(uld.add(drd)).divNum(3),
      v34 = uld.add(drd.add(urd)).divNum(3),
      v25 = drd.add(urd.add(dr)).divNum(3),
      v35 = urd.add(dr.add(uru)).divNum(3),
      v41 = down.add(dr.add(dru)).divNum(3),
      v42 = down.add(dru.add(dlu)).divNum(3),
      v43 = down.add(dlu.add(dld)).divNum(3),
      v44 = down.add(dld.add(drd)).divNum(3),
      v45 = down.add(drd.add(dr)).divNum(3);

    this.vertexes = [
      [v11, v12, v13, v14, v15],
      [v11, v12, v31, v22, v32],
      [v12, v13, v35, v21, v31],
      [v13, v14, v34, v25, v35],
      [v14, v15, v33, v24, v34],
      [v15, v11, v32, v23, v33],
      [v41, v42, v22, v31, v21],
      [v42, v43, v23, v32, v22],
      [v43, v44, v24, v33, v23],
      [v44, v45, v25, v34, v24],
      [v45, v41, v21, v35, v25],
      [v41, v42, v43, v44, v45],
    ];
  }
}
