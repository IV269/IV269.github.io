/* FILE NAME: mat4.js
 * PROGRAMMER: IV2
 * DATE: 07.06.2024
 * PURPOSE: matrix 4x4 library for 3D rendering.
 */
import "./vec3.js";

const PI = 3.14159265358979323846;

function D2R(L) {
  return L * (PI / 180.0);
}

class _mat4 {
  constructor(m = null) {
    if (m == null) {
      this.m = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
    } else if (typeof m == "object" && m.length == 4) {
      this.m = m;
    } else {
      this.m = m.m;
    }
  } // end of 'constructor' function

  translate(v) {
    let m = mat4();
    m.m[3][0] = v.x;
    m.m[3][1] = v.y;
    m.m[3][2] = v.z;

    return m;
  } // end of 'translate' function

  scale(v) {
    let m = mat4();
    m.m[0][0] = v.x;
    m.m[1][1] = v.y;
    m.m[2][2] = v.z;

    return m;
  } // end of 'scale' function

  rotateX(angle) {
    let m = mat4();
    let L = D2R(angle),
      co = Math.cos(L),
      si = Math.sin(L);

    m.m[1][1] = co;
    m.m[1][2] = si;
    m.m[2][1] = -si;
    m.m[2][2] = co;

    return m;
  } // end of 'rotateX' function

  rotateY(angle) {
    let m = mat4();
    let L = D2R(angle),
      co = Math.cos(L),
      si = Math.sin(L);

    m.m[0][0] = co;
    m.m[0][2] = si;
    m.m[2][0] = -si;
    m.m[2][2] = co;

    return m;
  } // end of 'rotateY' function

  rotateZ(angle) {
    let m = new mat4();
    let L = D2R(angle),
      co = Math.cos(L),
      si = Math.sin(L);

    m.m[0][0] = co;
    m.m[0][1] = si;
    m.m[1][0] = -si;
    m.m[1][1] = co;

    return m;
  } // end of 'rotateZ' function

  rotate(angle, v) {
    let L = D2R(angle),
      co = Math.cos(L),
      si = Math.sin(L);

    let C = v.normalize();
    let m = mat4([
      [
        co + C.x * C.x * (1 - co),
        C.x * C.y * (1 - co) + C.z * si,
        C.x * C.z * (1 - co) - C.y * si,
        0,
      ][
        (C.y * C.x * (1 - co) - C.z * si,
        co + C.y * C.y * (1 - co),
        C.y * C.z * (1 - co) + C.x * si,
        0)
      ][
        (C.z * C.x * (1 - co) + C.y * si,
        0,
        C.z * C.y * (1 - co) + C.x * si,
        co + C.z * C.z * (1 - co))
      ][(0, 0, 0, 1)],
    ]);

    return m;
  } // end of 'rotate' function

  mul(m) {
    let k = mat4();

    k.m[0][0] =
      this.m[0][0] * m.m[0][0] +
      this.m[0][1] * m.m[1][0] +
      this.m[0][2] * m.m[2][0] +
      this.m[0][3] * m.m[3][0];
    k.m[0][1] =
      this.m[0][0] * m.m[0][1] +
      this.m[0][1] * m.m[1][1] +
      this.m[0][2] * m.m[2][1] +
      this.m[0][3] * m.m[3][1];
    k.m[0][2] =
      this.m[0][0] * m.m[0][2] +
      this.m[0][1] * m.m[1][2] +
      this.m[0][2] * m.m[2][2] +
      this.m[0][3] * m.m[3][2];
    k.m[0][3] =
      this.m[0][0] * m.m[0][3] +
      this.m[0][1] * m.m[1][3] +
      this.m[0][2] * m.m[2][3] +
      this.m[0][3] * m.m[3][3];
    k.m[1][0] =
      this.m[1][0] * m.m[0][0] +
      this.m[1][1] * m.m[1][0] +
      this.m[1][2] * m.m[2][0] +
      this.m[1][3] * m.m[3][0];
    k.m[1][1] =
      this.m[1][0] * m.m[0][1] +
      this.m[1][1] * m.m[1][1] +
      this.m[1][2] * m.m[2][1] +
      this.m[1][3] * m.m[3][1];
    k.m[1][2] =
      this.m[1][0] * m.m[0][2] +
      this.m[1][1] * m.m[1][2] +
      this.m[1][2] * m.m[2][2] +
      this.m[1][3] * m.m[3][2];
    k.m[1][3] =
      this.m[1][0] * m.m[0][3] +
      this.m[1][1] * m.m[1][3] +
      this.m[1][2] * m.m[2][3] +
      this.m[1][3] * m.m[3][3];
    k.m[2][0] =
      this.m[2][0] * m.m[0][0] +
      this.m[2][1] * m.m[1][0] +
      this.m[2][2] * m.m[2][0] +
      this.m[2][3] * m.m[3][0];
    k.m[2][1] =
      this.m[2][0] * m.m[0][1] +
      this.m[2][1] * m.m[1][1] +
      this.m[2][2] * m.m[2][1] +
      this.m[2][3] * m.m[3][1];
    k.m[2][2] =
      this.m[2][0] * m.m[0][2] +
      this.m[2][1] * m.m[1][2] +
      this.m[2][2] * m.m[2][2] +
      this.m[2][3] * m.m[3][2];
    k.m[2][3] =
      this.m[2][0] * m.m[0][3] +
      this.m[2][1] * m.m[1][3] +
      this.m[2][2] * m.m[2][3] +
      this.m[2][3] * m.m[3][3];
    k.m[3][0] =
      this.m[3][0] * m.m[0][0] +
      this.m[3][1] * m.m[1][0] +
      this.m[3][2] * m.m[2][0] +
      this.m[3][3] * m.m[3][0];
    k.m[3][1] =
      this.m[3][0] * m.m[0][1] +
      this.m[3][1] * m.m[1][1] +
      this.m[3][2] * m.m[2][1] +
      this.m[3][3] * m.m[3][1];
    k.m[3][2] =
      this.m[3][0] * m.m[0][2] +
      this.m[3][1] * m.m[1][2] +
      this.m[3][2] * m.m[2][2] +
      this.m[3][3] * m.m[3][2];
    k.m[3][3] =
      this.m[3][0] * m.m[0][3] +
      this.m[3][1] * m.m[1][3] +
      this.m[3][2] * m.m[2][3] +
      this.m[3][3] * m.m[3][3];

    return k;
  } // end of 'mul' function

  transpose(v) {
    let r = mat4();

    r.m[0][0] = this.m[0][0];
    r.m[0][1] = this.m[1][0];
    r.m[0][2] = this.m[2][0];
    r.m[0][3] = this.m[3][0];
    r.m[1][0] = this.m[0][1];
    r.m[1][1] = this.m[1][1];
    r.m[1][2] = this.m[2][1];
    r.m[1][3] = this.m[3][1];
    r.m[2][0] = this.m[0][2];
    r.m[2][1] = this.m[1][2];
    r.m[2][2] = this.m[2][2];
    r.m[2][3] = this.m[3][2];
    r.m[3][0] = this.m[0][3];
    r.m[3][1] = this.m[1][3];
    r.m[3][2] = this.m[2][3];
    r.m[3][3] = this.m[3][3];

    return r;
  } // end of 'transpose' function

  determ3() {
    return (
      this.m[0][0] * this.m[1][1] * this.m[2][2] +
      this.m[0][1] * this.m[1][2] * this.m[2][0] +
      this.m[0][2] * this.m[1][0] * this.m[2][1] -
      this.m[0][0] * this.m[1][2] * this.m[2][1] -
      this.m[0][1] * this.m[1][0] * this.m[2][2] -
      this.m[0][2] * this.m[1][1] * this.m[2][0]
    );
  } // end of 'determ3' function

  determ4() {
    return (
      this.m[0][0] *
        mat4([
          [this.m[1][1], this.m[1][2], this.m[1][3], 0],
          [this.m[2][1], this.m[2][2], this.m[2][3], 0],
          [this.m[3][1], this.m[3][2], this.m[3][3], 0],
          [0, 0, 0, 0],
        ]).determ3() -
      this.m[0][1] *
        mat4([
          [this.m[1][0], this.m[1][2], this.m[1][3], 0],
          [this.m[2][0], this.m[2][2], this.m[2][3], 0],
          [this.m[3][0], this.m[3][2], this.m[3][3], 0],
          [0, 0, 0, 0],
        ]).determ3() +
      this.m[0][2] *
        mat4([
          [this.m[1][0], this.m[1][1], this.m[1][3], 0],
          [this.m[2][0], this.m[2][1], this.m[2][3], 0],
          [this.m[3][0], this.m[3][1], this.m[3][3], 0],
          [0, 0, 0, 0],
        ]).determ3() -
      this.m[0][3] *
        mat4([
          [this.m[1][0], this.m[1][1], this.m[1][2], 0],
          [this.m[2][0], this.m[2][1], this.m[2][2], 0],
          [this.m[3][0], this.m[3][1], this.m[3][2], 0],
          [0, 0, 0, 0],
        ]).determ3()
    );
  } // end of 'determ4' function

  inverse() {
    let det = this.determ4();
    let r = mat4();

    if (det == 0) {
      return MatrIdentity();
    }

    r.m[0][0] =
      +mat4([
        [this.m[1][1], this.m[1][2], this.m[1][3], 0],
        [this.m[2][1], this.m[2][2], this.m[2][3], 0],
        [this.m[3][1], this.m[3][2], this.m[3][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[1][0] =
      -mat4([
        [this.m[1][0], this.m[1][2], this.m[1][3], 0],
        [this.m[2][0], this.m[2][2], this.m[2][3], 0],
        [this.m[3][0], this.m[3][2], this.m[3][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[2][0] =
      +mat4([
        [this.m[1][0], this.m[1][1], this.m[1][3], 0],
        [this.m[2][0], this.m[2][1], this.m[2][3], 0],
        [this.m[3][0], this.m[3][1], this.m[3][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[3][0] =
      -mat4([
        [this.m[1][0], this.m[1][1], this.m[1][2], 0],
        [this.m[2][0], this.m[2][1], this.m[2][2], 0],
        [this.m[3][0], this.m[3][1], this.m[3][2], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[0][1] =
      -mat4([
        [this.m[0][1], this.m[0][2], this.m[0][3], 0],
        [this.m[2][1], this.m[2][2], this.m[2][3], 0],
        [this.m[3][1], this.m[3][2], this.m[3][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[1][1] =
      +mat4([
        [this.m[0][0], this.m[0][2], this.m[0][3], 0],
        [this.m[2][0], this.m[2][2], this.m[2][3], 0],
        [this.m[3][0], this.m[3][2], this.m[3][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[2][1] =
      -mat4([
        [this.m[0][0], this.m[0][1], this.m[0][3], 0],
        [this.m[2][0], this.m[2][1], this.m[2][3], 0],
        [this.m[3][0], this.m[3][1], this.m[3][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[3][1] =
      +mat4([
        [this.m[0][0], this.m[0][1], this.m[0][2], 0],
        [this.m[2][0], this.m[2][1], this.m[2][2], 0],
        [this.m[3][0], this.m[3][1], this.m[3][2], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[0][2] =
      +mat4([
        [this.m[0][1], this.m[0][2], this.m[0][3], 0],
        [this.m[1][1], this.m[1][2], this.m[1][3], 0],
        [this.m[3][1], this.m[3][2], this.m[3][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[1][2] =
      -mat4([
        [this.m[0][0], this.m[0][2], this.m[0][3], 0],
        [this.m[1][0], this.m[1][2], this.m[1][3], 0],
        [this.m[3][0], this.m[3][2], this.m[3][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[2][2] =
      +mat4([
        [this.m[0][0], this.m[0][1], this.m[0][3], 0],
        [this.m[1][0], this.m[1][1], this.m[1][3], 0],
        [this.m[3][0], this.m[3][1], this.m[3][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[3][2] =
      -mat4([
        [this.m[0][0], this.m[0][1], this.m[0][2], 0],
        [this.m[1][0], this.m[1][1], this.m[1][2], 0],
        [this.m[3][0], this.m[3][1], this.m[3][2], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[0][3] =
      -mat4([
        [this.m[0][1], this.m[0][2], this.m[0][3], 0],
        [this.m[1][1], this.m[1][2], this.m[1][3], 0],
        [this.m[2][1], this.m[2][2], this.m[2][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[1][3] =
      +mat4([
        [this.m[0][0], this.m[0][2], this.m[0][3], 0],
        [this.m[1][0], this.m[1][2], this.m[1][3], 0],
        [this.m[2][0], this.m[2][2], this.m[2][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[2][3] =
      -mat4([
        [this.m[0][0], this.m[0][1], this.m[0][3], 0],
        [this.m[1][0], this.m[1][1], this.m[1][3], 0],
        [this.m[2][0], this.m[2][1], this.m[2][3], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    r.m[3][3] =
      +mat4([
        [this.m[0][0], this.m[0][1], this.m[0][2], 0],
        [this.m[1][0], this.m[1][1], this.m[1][2], 0],
        [this.m[2][0], this.m[2][1], this.m[2][2], 0],
        [0, 0, 0, 0],
      ]).determ3() / det;

    return r;
  } // end of 'inverse' function

  view(Loc, At, Up1) {
    let Dir = At.sub(Loc).normalize();
    let Right = Dir.cross(Up1).normalize();
    let Up = Right.cross(Dir).normalize();

    let m = mat4([
      [Right.x, Up.x, -Dir.x, 0],
      [Right.y, Up.y, -Dir.y, 0],
      [Right.z, Up.z, -Dir.z, 0],
      [-Loc.dot(Right), -Loc.dot(Up), Loc.dot(Dir), 1],
    ]);
    return m;
  } // end of 'view' function

  ortho(Left, Right, Bottom, Top, Near, Far) {
    let m = mat4([
      [2 / (Right - Left), 0, 0, 0],
      [0, 2 / (Top - Bottom), 0, 0],
      [0, 0, -2 / (Far - Near), 0],
      [
        -(Right + Left) / (Right - Left),
        -(Top + Bottom) / (Top - Bottom),
        -(Far + Near) / (Far - Near),
        1,
      ],
    ]);
    return m;
  } // end of 'ortho' function

  frustum(Left, Right, Bottom, Top, Near, Far) {
    let m = mat4([
      [(2 * Near) / (Right - Left), 0, 0, 0],
      [0, (2 * Near) / (Top - Bottom), 0, 0],
      [
        (Right + Left) / (Right - Left),
        (Top + Bottom) / (Top - Bottom),
        -((Far + Near) / (Far - Near)),
        -1,
      ],
      [0, 0, -((2 * Near * Far) / (Far - Near)), 0],
    ]);
    return m;
  } // end of 'frustum' function

  toArray() {
    return [].concat(...this.m);
  } // end of 'toArray' function
}

export function mat4(...args) {
  return new _mat4(...args);
} // end of 'mat4' function

/* END OF 'mat4.js' FILE */
