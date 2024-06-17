let IsDown = false,
  NowCan = undefined,
  lastCan = undefined;

const gls = [];
const timelocs = [];
const timers = [];
const xs = [];
const glxs = [];
const ys = [];
const glys = [];
const glws = [];
const glhs = [];
const ws = [];
const hs = [];
const dw = [];
const dh = [];
const mousecoordx = [];
const mousecoordy = [];
const coef = [];
const glcoef = [];
let gl,
  gl2,
  canvas1,
  canvas2,
  body,
  pow = 10,
  glpow;

function addListenerMulti(element, eventNames, listener) {
  let events = eventNames.split(" ");
  for (let i = 0, iLen = events.length; i < iLen; i++) {
    element.addEventListener(events[i], listener, false);
  }
}

export function initGL() {
  canvas1 = document.getElementById("myCan1");
  canvas2 = document.getElementById("myCan2");
  body = document.getElementById("body");

  ws[0] = canvas1.width;
  hs[0] = canvas1.height;

  ws[1] = canvas2.width;
  hs[1] = canvas2.height;

  dw[0] = canvas1.offsetLeft;
  dh[0] = canvas1.offsetTop;

  dw[1] = canvas2.offsetLeft;
  dh[1] = canvas2.offsetTop;

  addListenerMulti(canvas1, "wheel mousedown mouseleave mouseenter", onClick);
  addListenerMulti(canvas2, "wheel mousedown mouseleave mouseenter", onClick);

  body.addEventListener("keypress", keyboard);
  addListenerMulti(body, "mouseup mousemove", onClick);

  gl = canvas1.getContext("webgl2");
  gl.clearColor(0.3, 0.47, 0.8, 1);

  gl2 = canvas2.getContext("webgl2");
  gl2.clearColor(0.3, 0.47, 0.8, 1);

  gls.push(gl);
  gls.push(gl2);

  // Shader creation
  let vs_txt = `#version 300 es
  precision highp float;
  in vec3 InPosition;
    
  out vec2 DrawPos;
  uniform float Time;
  uniform float dX;
  uniform float dY;
  uniform float coef;
  uniform float dW;
  uniform float dH;

 
  void main( void )
  {
    float mouseW = (dW - 0.5) * 2.0;
    float mouseH = (dH - 0.5) * 2.0;
    float x = mouseW * coef;
    float y = mouseH * coef;

    gl_Position = vec4(InPosition, 1);
    DrawPos = (InPosition.xy - vec2(2.0 * dX, -2.0 * dY)) / coef;
  }
  `;
  let fs_txt = `#version 300 es
  precision highp float;
  out vec4 OutColor;
  
  in vec2 DrawPos;
  uniform float Time;
 
  void main( void )
  {
    vec2 Z = DrawPos * 2.0;
    vec2 Z0 = Z;
    vec2 C = vec2(0.35 + 0.05 * sin(2.0 * Time * 1.30), 0.35 + 0.05 * sin(2.0 * Time * 0.8));
    float n = 0.0;
    while (n < 255.0 && length(Z) < 2.0)
    {
      Z = vec2(Z.x * Z.x - Z.y * Z.y, 2.0 * Z.x * Z.y) + C;
      n = n + 1.0;
    }
   
    n = n / 255.0;
    OutColor = vec4(n * 30.0, n * 8.0, n * 5.0, 1);  
  }
  `;
  let fs_txt2 = `#version 300 es
  precision highp float;
  out vec4 OutColor;
  
  in vec2 DrawPos;
  uniform float Time;
  uniform float Pow;

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
    float n = 0.0;
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
  `;
  for (let i in gls) {
    let fs;
    if (i == 0) {
      fs = loadShader(gls[i], gls[i].FRAGMENT_SHADER, fs_txt);
    } else if (i == 1) {
      fs = loadShader(gls[i], gls[i].FRAGMENT_SHADER, fs_txt2);
    }
    let vs = loadShader(gls[i], gls[i].VERTEX_SHADER, vs_txt),
      prg = gls[i].createProgram();

    gls[i].attachShader(prg, vs);
    gls[i].attachShader(prg, fs);
    gls[i].linkProgram(prg);
    if (!gls[i].getProgramParameter(prg, gls[i].LINK_STATUS)) {
      let buf = gls[i].getProgramInfoLog(prg);
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
    const posLoc = gls[i].getAttribLocation(prg, "InPosition");
    let vertexArray = gls[i].createVertexArray();
    gls[i].bindVertexArray(vertexArray);
    let vertexBuffer = gls[i].createBuffer();
    gls[i].bindBuffer(gls[i].ARRAY_BUFFER, vertexBuffer);
    gls[i].bufferData(
      gls[i].ARRAY_BUFFER,
      new Float32Array(vertexes),
      gls[i].STATIC_DRAW
    );
    if (posLoc != -1) {
      gls[i].vertexAttribPointer(posLoc, 3, gls[i].FLOAT, false, 0, 0);
      gls[i].enableVertexAttribArray(posLoc);
    }

    // Uniform data
    timelocs[i] = gls[i].getUniformLocation(prg, "Time");

    timers[i] = new Timer();

    glpow = gls[i].getUniformLocation(prg, "Pow");

    glxs[i] = gls[i].getUniformLocation(prg, "dX");
    glys[i] = gls[i].getUniformLocation(prg, "dY");
    xs[i] = 0;
    ys[i] = 0;

    glws[i] = gls[i].getUniformLocation(prg, "dW");
    glhs[i] = gls[i].getUniformLocation(prg, "dH");

    glcoef[i] = gls[i].getUniformLocation(prg, "coef");
    coef[i] = 1.0;

    mousecoordx[i] = 0;
    mousecoordy[i] = 0;

    gls[i].useProgram(prg);
  }
} // End of 'initGL' function

// Load and compile shader function
function loadShader(gl0, shaderType, shaderSource) {
  const shader = gl0.createShader(shaderType);
  gl0.shaderSource(shader, shaderSource);
  gl0.compileShader(shader);
  if (!gl0.getShaderParameter(shader, gl0.COMPILE_STATUS)) {
    let buf = gl0.getShaderInfoLog(shader);
    console.log("Shader compile fail: " + buf);
  }
  return shader;
} // End of 'loadShader' function

let x = 1;
// Main render frame function
export function render() {
  // console.log(`Frame ${x++}`);
  for (let i in gls) {
    gls[i].clear(gls[i].COLOR_BUFFER_BIT);

    if (timelocs[i] != -1) {
      timers[i].response();

      gls[i].uniform1f(timelocs[i], timers[i].localTime);
    }
    if (i == 1) {
      if (glpow != -1) {
        gls[i].uniform1f(glpow, pow);
      }
    }
    if (glxs[i] != -1) {
      gls[i].uniform1f(glxs[i], xs[i]);
    }
    if (glys[i] != -1) {
      gls[i].uniform1f(glys[i], ys[i]);
    }
    if (glcoef[i] != -1) {
      gls[i].uniform1f(glcoef[i], coef[i]);
    }
    if (glws[i] != -1) {
      gls[i].uniform1f(glws[i], mousecoordx[i]);
    }
    if (glhs[i] != -1) {
      gls[i].uniform1f(glhs[i], mousecoordy[i]);
    }
    gls[i].drawArrays(gls[i].TRIANGLE_STRIP, 0, 4);
  }
} // End of 'render' function

function keyboard(e) {
  if (e.key == "p") {
    if (NowCan != undefined) {
      let i = NowCan[5];
      timers[i - 1].isPause = !timers[i - 1].isPause;
    }
  } else if (e.key == "+") {
    if (NowCan != undefined) {
      let i = NowCan[5];
      if (i == 2) {
        pow++;
      }
    }
  } else if (e.key == "-") {
    if (NowCan != undefined) {
      let i = NowCan[5];
      if (i == 2) {
        pow--;
      }
    }
  } else if (e.key == "0") {
    if (NowCan != undefined) {
      let i = NowCan[5];
      if (i == 2) {
        pow = 10;
      }
      xs[i - 1] = 0.0;
      ys[i - 1] = 0.0;
      timers[i - 1].isPause = false;
      coef[i - 1] = 1.0;
    }
  }
}

function onClick(e) {
  if (e.type == "mouseleave") {
    if (!IsDown) {
      lastCan = NowCan;
    }
    NowCan = undefined;
  } else if (e.type == "mouseenter") {
    NowCan = e.currentTarget.id;
    if (!IsDown) {
      lastCan = NowCan;
    }
  } else if (e.type == "mousedown") {
    if (NowCan != undefined) {
      IsDown = true;
    }
    console.log(e);
  } else if (e.type == "mouseup") {
    IsDown = false;
  } else if (e.type == "mousemove") {
    if (IsDown) {
      let i = lastCan[5];
      xs[i - 1] += e.movementX / ws[i - 1];
      ys[i - 1] += e.movementY / hs[i - 1];
      // console.log(xs[i - 1], ys[i - 1], i);
    }
  } else if (e.type == "wheel") {
    e.preventDefault();
    if (NowCan != undefined) {
      let i = NowCan[5];
      let x = e.pageX - dw[i - 1],
        y = e.pageY - dh[i - 1];
      coef[i - 1] -= e.deltaY / 1000;
      mousecoordx[i - 1] = x / ws[i - 1];
      mousecoordy[i - 1] = y / hs[i - 1];
    }
  }
}

export function Timer() {
  // Timer obtain current time in seconds method
  const getTime = () => {
    const date = new Date();
    let t =
      date.getMilliseconds() / 1000.0 +
      date.getSeconds() +
      date.getMinutes() * 60;
    return t;
  };

  // Timer response method
  this.response = (tag_id = null) => {
    let t = getTime();
    // Global time
    this.globalTime = t;
    this.globalDeltaTime = t - this.oldTime;
    // Time with pause
    if (this.isPause) {
      this.localDeltaTime = 0;
      this.pauseTime += t - this.oldTime;
    } else {
      this.localDeltaTime = this.globalDeltaTime;
      this.localTime = t - this.pauseTime - this.startTime;
    }
    // FPS
    this.frameCounter++;
    if (t - this.oldTimeFPS > 3) {
      this.FPS = this.frameCounter / (t - this.oldTimeFPS);
      this.oldTimeFPS = t;
      this.frameCounter = 0;
      if (tag_id != null)
        document.getElementById(tag_id).innerHTML = this.getFPS();
    }
    this.oldTime = t;
  };

  // Obtain FPS as string method
  this.getFPS = () => this.FPS.toFixed(3);

  // Fill timer global data
  this.globalTime = this.localTime = getTime();
  this.globalDeltaTime = this.localDeltaTime = 0;

  // Fill timer semi global data
  this.startTime = this.oldTime = this.oldTimeFPS = this.globalTime;
  this.frameCounter = 0;
  this.isPause = false;
  this.FPS = 30.0;
  this.pauseTime = 0;

  return this;
} // End of 'Timer' function
