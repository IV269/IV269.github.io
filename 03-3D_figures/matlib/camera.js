/* FILE NAME: camera.js
 * PROGRAMMER: IV2
 * DATE: 07.06.2024
 * PURPOSE: matrix 4x4 library for 3D rendering.
 */
import "./mat4.js";
import { mat4 } from "./mat4.js";
import "./vec3.js";
import { vec3 } from "./vec3.js";

class _Cam {
  constructor() {
    this.At = 0;
    this.Dir = 0;
    this.Loc = 0;
    this.Right = 0;
    this.Up = 0;
    this.MatrProj = mat4();
    this.MatrView = mat4();
    this.MatrVP = mat4();
    this.ProjSize = 0;
    this.ProjDist = 0;
    this.ProjFarClip = 0;
    this.FrameW = 0;
    this.FrameH = 0;
    this.Wp = 0;
    this.Hp = 0;
  } // end of 'constructor' function

  camSet(Loc, At, Up) {
    this.MatrView = mat4().view(Loc, At, Up);

    this.Right = vec3(
      this.MatrView.m[0][0],
      this.MatrView.m[1][0],
      this.MatrView.m[2][0],
    );

    this.Up = vec3(
      this.MatrView.m[0][1],
      this.MatrView.m[1][1],
      this.MatrView.m[2][1],
    );

    this.Dir = vec3(
      this.MatrView.m[0][2],
      this.MatrView.m[1][2],
      this.MatrView.m[2][2],
    );
    this.Loc = Loc;
    this.At = At;
    this.MatrVP = this.MatrView.mul(this.MatrProj);
  } // end of 'camSet' function

  camSetProj(ProjSize, ProjDist, ProjFarClip) {
    this.ProjDist = ProjDist;
    this.ProjFarClip = ProjFarClip;
    let rx, ry;
    rx = ry = this.ProjSize = ProjSize;
    /* Correct aspect ratio */
    if (this.FrameW >= this.FrameH) {
      rx *= this.FrameW / this.FrameH;
    } else {
      ry *= this.FrameH / this.FrameW;
    }
    this.Wp = rx;
    this.Hp = ry;
    this.MatrProj = mat4().frustum(
      -rx / 2,
      rx / 2,
      -ry / 2,
      ry / 2,
      this.ProjDist,
      this.ProjFarClip,
    );
    this.MatrVP = this.MatrView.mul(this.MatrProj);
  } // end of 'camSetProj' function

  camSetSize(FrameW, FrameH) {
    this.FrameW = FrameW;
    this.FrameH = FrameH;
    this.camSetProj(this.ProjSize, this.ProjDist, this.ProjFarClip);
  } // end of 'camSetSize' function
}

export function Cam(...args) {
  return new _Cam(...args);
} // end of 'Cam' function

/* END OF 'camera.js' FILE */
