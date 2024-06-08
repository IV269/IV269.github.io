/* FILE NAME: primitives.js
 * PROGRAMMER: IV2
 * DATE: 08.06.2024
 * PURPOSE: primitives library for 3D rendering.
 */

import "../lib.js";

class _vertex {
  constructor() {
    this.p = new vec3();
    this.n = new vec3();
  }
} // end of '_vertex' class

export function vertex(...args) {
  return new _vertex(...args);
} // end of 'vertex' function

class _primitive {
  constructor(V, Type, NoofV, Ind, NoofI) {
    (this.VA = 0),
      (this.VBuf = 0),
      (this.IBuf = 0),
      (this.NumOfElements = 0),
      (this.NumOfPatchPoints = 0),
      (this.type = 0);

    this.Trans = new mat4();
    (this.MinBB = new vec3()), (MaxBB = new vec3());

    window.gl.createVertexArray(1, this.VA);

    /* Vertex data */
    if (V != NULL && NoofV != 0) {
      glBindVertexArray(this.VA);

      window.gl.createBuffer(1, this.VBuf);
      window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.VBuf);
      window.gl.BufferData(
        window.gl.ARRAY_BUFFER,
        new Float32Array() * NoofV,
        V,
        window.gl.STATIC_DRAW,
      );

      window.gl.vertexAttribPointer(
        0,
        3,
        window.gl.FLOAT,
        false,
        new Float32Array(),
        0,
      ); /* position */

      window.gl.vertexAttribPointer(
        1,
        2,
        window.gl.FLOAT,
        false,
        new Float32Array(),
        sizeof(VEC3),
      ); /* texture coordinates */
      window.gl.vertexAttribPointer(
        2,
        3,
        window.gl.FLOAT,
        false,
        new Float32Array(),
        sizeof(VEC3) + (sizeof(VEC3) * 2) / 3,
      ); /* normal */
      window.gl.vertexAttribPointer(
        3,
        4,
        window.gl.FLOAT,
        false,
        new Float32Array(),
        sizeof(VEC3) * 2 + (sizeof(VEC3) * 2) / 3,
      ); /* color */

      window.gl.enableVertexAttribArray(0);
      window.gl.enableVertexAttribArray(1);
      window.gl.enableVertexAttribArray(2);
      window.gl.enableVertexAttribArray(3);

      window.gl.bindVertexArray(0);
    }

    if (Ind != NULL && NoofI != 0) {
      window.gl.createBuffer(1, this.IBuf);
      window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
      window.gl.bufferData(
        window.gl.ELEMENT_ARRAY_BUFFER,
        sizeof(INT) * NoofI,
        Ind,
        GL_STATIC_DRAW,
      );
      window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, 0);

      this.NumOfElements = NoofI;
    } else this.NumOfElements = NoofV;

    this.Type = Type;
    this.Trans = mat4();

    rndPrimEvalBB(V, NoofV);
  }

  rndPrimEvalBB(V, NoofV) {
    (this.MinBB = vec3()), (this.MaxBB = vec3());

    if (V == undefined || V == null || NoofV == 0) {
      return;
    }
    (this.MinBB = V[0].P), (this.MaxBB = V[0].P);
    for (let i = 1; i < NoofV; ++i) {
      if (MinBB.x > V[i].P.x) {
        MinBB.x = V[i].P.x;
      }
      if (MaxBB.x < V[i].P.x) {
        MaxBB.x = V[i].P.x;
      }

      if (MinBB.y > V[i].P.y) {
        MinBB.y = V[i].P.y;
      }
      if (MaxBB.y < V[i].P.y) {
        MaxBB.y = V[i].P.y;
      }
      if (MinBB.z > V[i].P.z) {
        MinBB.z = V[i].P.z;
      }
      if (MaxBB.z < V[i].P.z) {
        MaxBB.z = V[i].P.z;
      }
    }
  }

  rndPrimDraw(world) {}

  rndPrimFree() {
    if (this.VA != 0) {
      window.gl.bindVertexArray(this.VA);
      window.gl.bindBuffer(GL_ARRAY_BUFFER, 0);
      window.gl.deleteBuffer(1, this.VBuf);
      window.gl.bindVertexArray(0);
      window.gl.deleteVertexArray(1, this.VA);
    }
    if (this.IBuf != 0) window.gl.deleteBuffer(1, this.IBuf);
  }
} // end of '_primitives' class

export function primitive(...args) {
  return new _primitive(...args);
} // end of 'primitive' function

/* END OF 'primitive.js' FILE */
