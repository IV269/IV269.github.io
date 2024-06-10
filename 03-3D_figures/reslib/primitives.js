/* FILE NAME: primitives.js
 * PROGRAMMER: IV2
 * DATE: 08.06.2024
 * PURPOSE: primitives library for 3D rendering.
 */

import { vec3, mat4 } from "../lib.js";

import "../lib.js";

class _vertex {
  constructor(pos, norm) {
    this.pos = pos;
    this.norm = norm;
  }
} // end of '_vertex' class

export function vertex(...args) {
  return new _vertex(...args);
} // end of 'vertex' function

export function autoNormals(vertexes, indicies) {
  let i;

  /* Set all vertex normals to zero */
  for (i = 0; i < vertexes.length; i++) {
    vertexes[i].norm = vec3(0);
  }

  /* Eval normal for every facet */
  for (i = 0; i < indicies.length; i += 3) {
    let n0 = indicies[i],
      n1 = indicies[i + 1],
      n2 = indicies[i + 2];
    let p0 = vertexes[n0].pos,
      p1 = vertexes[n1].pos,
      p2 = vertexes[n2].pos,
      N = p1.sub(p0).cross(p2.sub(p0)).normalize();

    vertexes[n0].norm = vertexes[n0].norm.add(N);
    vertexes[n1].norm = vertexes[n1].norm.add(N);
    vertexes[n2].norm = vertexes[n2].norm.add(N);
  }

  /* Normalize all vertex normals */
  for (i = 0; i < vertexes.length; i++) {
    vertexes[i].norm = vertexes[i].norm.normalize();
  }
}

class _primitive {
  constructor(rnd, vertexes, indicies) {
    let smt = [],
      i = 0;

    autoNormals(vertexes, indicies);

    for (let v of vertexes) {
      smt[i++] = v.pos.x;
      smt[i++] = v.pos.y;
      smt[i++] = v.pos.z;
      smt[i++] = v.norm.x;
      smt[i++] = v.norm.y;
      smt[i++] = v.norm.z;
    }
    this.vertexArrayId = rnd.gl.createVertexArray();

    rnd.gl.bindVertexArray(this.vertexArrayId);
    this.vertexBufferId = rnd.gl.createBuffer();

    rnd.gl.bindBuffer(rnd.gl.ARRAY_BUFFER, this.vertexBufferId);
    rnd.gl.bufferData(
      rnd.gl.ARRAY_BUFFER,
      new Float32Array(smt),
      rnd.gl.STATIC_DRAW,
    );

    if (rnd.posLoc != -1) {
      rnd.gl.vertexAttribPointer(rnd.posLoc, 3, rnd.gl.FLOAT, false, 24, 0);
      rnd.gl.enableVertexAttribArray(rnd.posLoc);
      rnd.gl.vertexAttribPointer(rnd.normLoc, 3, rnd.gl.FLOAT, false, 24, 12);
      rnd.gl.enableVertexAttribArray(rnd.normLoc);
    }

    this.IndexBufferId = rnd.gl.createBuffer();
    rnd.gl.bindBuffer(rnd.gl.ELEMENT_ARRAY_BUFFER, this.IndexBufferId);
    rnd.gl.bufferData(
      rnd.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indicies),
      rnd.gl.STATIC_DRAW,
    );

    this.numOfElements = indicies.length;
    this.numOfVertexes = vertexes.length;
  }

  rndPrimEvalBB(V) {
    (this.MinBB = vec3()), (this.MaxBB = vec3());

    if (V == undefined || V == null || V.length == 0) {
      return;
    }
    let NoofV = V.length;
    (this.MinBB = V[0].P), (this.MaxBB = V[0].P);
    for (let i = 1; i < NoofV; ++i) {
      if (this.MinBB.x > V[i].P.x) {
        this.MinBB.x = V[i].P.x;
      }
      if (this.MaxBB.x < V[i].P.x) {
        this.MaxBB.x = V[i].P.x;
      }

      if (this.MinBB.y > V[i].P.y) {
        this.MinBB.y = V[i].P.y;
      }
      if (this.MaxBB.y < V[i].P.y) {
        this.MaxBB.y = V[i].P.y;
      }
      if (this.MinBB.z > V[i].P.z) {
        this.MinBB.z = V[i].P.z;
      }
      if (this.MaxBB.z < V[i].P.z) {
        this.MaxBB.z = V[i].P.z;
      }
    }
  }

  render(rnd, world) {
    let m = mat4();

    let rx = rnd.projSize,
      ry = rnd.projSize;

    /* Correct aspect ratio */
    if (rnd.width >= rnd.height) {
      rx *= rnd.width / rnd.height;
    } else {
      ry *= rnd.height / rnd.width;
    }

    m.frustum(-rx / 2, rx / 2, -ry / 2, ry / 2, rnd.projDist, rnd.farClip);

    m = world.mul(mat4());
    console.log([].concat(...m.m));
    rnd.gl.uniformMatrix4fv(
      rnd.matrProjLoc,
      false,
      new Float32Array([].concat(...m.m)),
    );
    rnd.gl.uniformMatrix4fv(
      rnd.matrWLoc,
      false,
      new Float32Array([].concat(...world.m)),
    );

    rnd.gl.clear(rnd.gl.COLOR_BUFFER_BIT);
    rnd.gl.clear(rnd.gl.DEPTH_BUFFER_BIT);
    rnd.gl.enable(rnd.gl.DEPTH_TEST);
    rnd.gl.clearDepth(1.0);

    //rnd.gl.enable(rnd.gl.DEPTH_TEST);
    //rnd.gl.bindVertexArray(this.vertexArrayId);
    rnd.gl.bindBuffer(rnd.gl.ELEMENT_ARRAY_BUFFER, this.IndexBufferId);
    rnd.gl.drawElements(
      rnd.gl.TRIANGLES,
      this.numOfElements,
      rnd.gl.UNSIGNED_SHORT,
      0,
    );
  }

  rndPrimFree() {
    if (this.VA != 0) {
      rnd.gl.bindVertexArray(this.VA);
      rnd.gl.bindBuffer(GL_ARRAY_BUFFER, 0);
      rnd.gl.deleteBuffer(1, this.VBuf);
      rnd.gl.bindVertexArray(0);
      rnd.gl.deleteVertexArray(1, this.VA);
    }
    if (this.IBuf != 0) {
      rnd.gl.deleteBuffer(1, this.IBuf);
    }
  }
} // end of '_primitives' class

export function primitive(...args) {
  return new _primitive(...args);
} // end of 'primitive' function

/* END OF 'primitive.js' FILE */
