let canvas, gl, timeLoc;

// OpenGL initialization function
export function initGL() {
  canvas = document.getElementById("Julia");
  gl = canvas.getContext("webgl2");
  gl.clearColor(0.3, 0.47, 0.8, 1);

  // Shader creation
  let vs_txt = `#version 300 es
  precision highp float;
  in vec3 InPosition;
    
  out vec2 DrawPos;
  uniform float Time;
 
  void main( void )
  {
    gl_Position = vec4(InPosition, 1);
    DrawPos = InPosition.xy;
  }
  `;
  let fs_txt = `#version 300 es
  precision highp float;
  out vec4 OutColor;
  
  in vec2 DrawPos;
  uniform float Time;

  vec2 Cpow( vec2 Z, float num )
  {
    vec2 Y = Z;
    num = num - 1.0;
    while (num > 0.0)
    {
      Y = vec2(Y.x * Z.x - Y.y * Z.y, Y.x * Z.y + Y.y * Z.x);
      num = num - 1.0;
    }
    return Y;
  }
 
  void main( void )
  {
    vec2 Z = DrawPos * 2.0;
    vec2 Z0 = Z;
    if (Z0.x > -0.01 && Z0.x < 0.01)
      OutColor = vec4(1, 1, 1, 1);
    else if (Z.x < 0.01)
    {
      Z = vec2((Z.x + 0.5) * 2.0, Z.y) + vec2(1, 0);
      vec2 C = vec2(0.35 + 0.05 * sin(2.0 * Time * 1.30), 0.35 + 0.05 * sin(2.0 * Time * 0.8));
      float n = 0.0;
      while (n < 255.0 && length(Z) < 2.0)
      {
        Z = vec2(Z.x * Z.x - Z.y * Z.y, 2.0 * Z.x * Z.y) + C;
        n = n + 1.0;
      }
      OutColor = vec4(DrawPos, 0, 1) * 0.5 + 0.5;
      n = n / 255.0;
      OutColor = vec4(n * 30.0, n * 8.0, n * 5.0, 1);
    }
    else
    {
      Z = vec2((Z.x - 0.5) * 2.0, Z.y) - vec2(1, 0);
      float n = 0.0;
      float Pow = 10.0;
      while (n < 255.0 && length(Z) < 2.0)
      {
        vec2 h = Cpow(Z, Pow) - vec2(1, 0);
        vec2 pr = Cpow(Z, Pow - 1.0) * Pow;
        vec2 it = vec2((h.x * pr.x + h.y * pr.y) / (pr.x * pr.x + pr.y * pr.y), (pr.x * h.y - h.x * pr.y) / (pr.x * pr.x + pr.y * pr.y));
        Z = Z - it;
        n = n + 1.0;
      }
      OutColor = vec4(DrawPos, 0, 1) * 0.5 + 0.5;
      n = n / 255.0;
      OutColor = vec4(n * 8.0, n * 30.0, n * 5.0, 1);
    }    
  }
  `;
  let vs = loadShader(gl.VERTEX_SHADER, vs_txt),
    fs = loadShader(gl.FRAGMENT_SHADER, fs_txt),
    prg = gl.createProgram();
  gl.attachShader(prg, vs);
  gl.attachShader(prg, fs);
  gl.linkProgram(prg);
  if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    let buf = gl.getProgramInfoLog(prg);
    console.log("Shader program link fail: " + buf);
  }

  // Vertex buffer creation
  const size = 1.0;
  const vertexes = [
    -size,
    size,
    0,
    -size,
    -size,
    0,
    size,
    size,
    0,
    size,
    -size,
    0,
  ];
  const posLoc = gl.getAttribLocation(prg, "InPosition");
  let vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
  if (posLoc != -1) {
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
  }

  // Uniform data
  timeLoc = gl.getUniformLocation(prg, "Time");

  gl.useProgram(prg);
} // End of 'initGL' function

// Load and compile shader function
function loadShader(shaderType, shaderSource) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let buf = gl.getShaderInfoLog(shader);
    console.log("Shader compile fail: " + buf);
  }
  return shader;
} // End of 'loadShader' function

let x = 1;
// Main render frame function
export function render() {
  // console.log(`Frame ${x++}`);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (timeLoc != -1) {
    const date = new Date();
    let t =
      date.getMinutes() * 60 +
      date.getSeconds() +
      date.getMilliseconds() / 1000;

    gl.uniform1f(timeLoc, t);
  }
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
} // End of 'render' function

console.log("CGSG forever!!! scripts.js imported");
