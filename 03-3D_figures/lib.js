/* FILE NAME: lib.js
 * PROGRAMMER: IV2
 * DATE: 08.06.2024
 * PURPOSE: library for 3D rendering.
 */

import "./matlib/vec3.js";
import "./matlib/mat4.js";
import "./matlib/camera.js";
import "./reslib/buffers.js";
import "./reslib/primitives.js";
import "./reslib/shaders.js";
import "./render.js";
import "./timer/timer.js";
import "./figure.js";
import { vec3 } from "./matlib/vec3.js";
import { mat4, matrRotate, matrScale, matrTranslate } from "./matlib/mat4.js";
import { Cam } from "./matlib/camera.js";
import { primitive, vertex } from "./reslib/primitives.js";
import { Render } from "./render.js";
import { Timer } from "./timer/timer.js";
import {
  Cube,
  Tetrahedron,
  Octahedron,
  Icosahedron,
  Dodecahedron,
} from "./figure.js";

export {
  mat4,
  matrRotate,
  matrScale,
  matrTranslate,
  vec3,
  Cam,
  primitive,
  Render,
  vertex,
  Timer,
  Cube,
  Tetrahedron,
  Octahedron,
  Icosahedron,
  Dodecahedron,
};

console.log("Load done.");
