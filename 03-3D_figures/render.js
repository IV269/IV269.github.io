/* FILE NAME: render.js
 * PROGRAMMER: IV2
 * DATE: 08.06.2024
 * PURPOSE: rendering module.
 */

import { Timer } from "./lib.js";

class _Render {
  constructor(canvas) {
    this.canvas = canvas;

    this.projSize = 0.1;
    this.projDist = 0.1;
    this.farClip = 300;

    this.gl = canvas.getContext("webgl2");
    this.gl.clearColor(0.36, 0.64, 0.62, 1);

    this.gl.enable(this.gl.DEPTH_TEST);

    let rect = canvas.getBoundingClientRect();
    this.height = rect.bottom - rect.top + 1;
    this.width = rect.right - rect.left + 1;

    let vs_txt = `#version 300 es
    precision highp float;
    in vec3 InPosition;
    in vec3 InNormal;
        
    out vec3 DrawPos;
    out vec3 DrawNormal;

    uniform float Time;
    uniform mat4 MatrProj;
    uniform mat4 MatrW;
    
    void main( void )
    {
        gl_Position = MatrProj * vec4(InPosition, 1.0);
        DrawPos = vec3(MatrW * vec4(InPosition.xyz, 1.0));
        DrawNormal = mat3(transpose(inverse(MatrW))) * InNormal;
    }
    `;

    let fs_txt = `#version 300 es
    precision highp float;
    
    out vec4 OutColor;
    
    in vec3 DrawPos;
    in vec3 DrawNormal;

    uniform float Time;

    void main( void )
    {
        vec3 L = normalize(vec3(0.1, 0.4, 1.0));
        vec3 N = normalize(DrawNormal);
        
        N = faceforward(N, normalize(DrawPos), N);

        N = vec3(N.x, -N.y, N.z);
        
        float k = dot(L, normalize(N));

        OutColor = vec4(k * vec3(0.76, 0.78, 0.16)/*1.2 * k * vec3(0.35, 0.51, 0.89)*/, 1.0);
    }
    `;

    let vs = this.loadShader(this.gl.VERTEX_SHADER, vs_txt),
      fs = this.loadShader(this.gl.FRAGMENT_SHADER, fs_txt),
      prg = this.gl.createProgram();

    this.gl.attachShader(prg, vs);
    this.gl.attachShader(prg, fs);
    this.gl.linkProgram(prg);

    if (!this.gl.getProgramParameter(prg, this.gl.LINK_STATUS)) {
      let buf = this.gl.getProgramInfoLog(prg);
      console.log("Shader program link fail: " + buf);
    }
    this.prg = prg;

    this.timeLoc = this.gl.getUniformLocation(this.prg, "Time");
    this.posLoc = this.gl.getAttribLocation(this.prg, "InPosition");
    this.normLoc = this.gl.getAttribLocation(this.prg, "InNormal");
    this.matrProjLoc = this.gl.getUniformLocation(this.prg, "MatrProj");
    this.matrWLoc = this.gl.getUniformLocation(this.prg, "MatrW");

    this.Timer = new Timer();
    this.gl.useProgram(this.prg);
  } // End of 'constructor' function

  loadShader(type, source) {
    let shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      let buf = this.gl.getShaderInfoLog(shader);
      console.log("Shader compile fail: " + buf);
    }
    return shader;
  } // End of 'loadShader' function

  renderStart() {
    //this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    //this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

    if (this.timeLoc != -1) {
      const date = new Date();
      this.Timer.response();

      let t = this.Timer.localTime;
      this.gl.uniform1f(this.timeLoc, t);
    }
  } // End of 'render' function
}

export function Render(...args) {
  return new _Render(...args);
} // end of 'Render' function
/* END OF 'render.js' FILE */
