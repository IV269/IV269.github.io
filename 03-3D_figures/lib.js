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
import { vec3 } from "./matlib/vec3.js";
import { mat4 } from "./matlib/mat4.js";
import { Cam } from "./matlib/camera.js";
import { primitive, vertex } from "./reslib/primitives.js";

export { mat4, vec3, Cam, primitive, vertex };

console.log("Load done.");
