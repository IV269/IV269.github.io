/* FILE NAME: render.js
 * PROGRAMMER: IV2
 * DATE: 08.06.2024
 * PURPOSE: rendering module.
 */

let canvas, gl, timeLoc;

// OpenGL initialization function
export function initGL() {
  canvas = document.getElementById("tetrahedron");
  gl = canvas.getContext("webgl2");
  let prg = gl.createProgram();

  gl.linkProgram(prg);

  gl.clearColor(0.8, 0.37, 0.42, 1);
  //gl.clearColor(0.3, 0.47, 0.8, 1);
  //timeLoc = gl.getUniformLocation(prg, "Time");
  //gl.useProgram(prg);
} // End of 'initGL' function

export function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  /*
  if (timeLoc != -1) {
    const date = new Date();
    let t =
      date.getMinutes() * 60 +
      date.getSeconds() +
      date.getMilliseconds() / 1000;

    gl.uniform1f(timeLoc, t);
  }
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  */
} // End of 'render' function

/* END OF 'render.js' FILE */
