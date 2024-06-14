/* FILE NAME: main.js
 * PROGRAMMER: IV2
 * DATE: 08.06.2024
 * PURPOSE: rendering module.
 */

console.log("check");

import {
  mat4,
  vec3,
  matrRotate,
  matrScale,
  Cube,
  Tetrahedron,
  Render,
  Octahedron,
  Icosahedron,
  Dodecahedron,
  FrustumCube,
  matrTranslate,
} from "./lib.js";

console.log("MAIN LOADED");

function addListenerMulti(element, eventNames, listener) {
  let events = eventNames.split(" ");
  for (let i = 0, iLen = events.length; i < iLen; i++) {
    element.addEventListener(events[i], listener, false);
  }
}

function main() {
  let body = document.getElementById("body");

  let canvas1 = document.getElementById("myCan1");
  let canvas2 = document.getElementById("myCan2");
  let canvas3 = document.getElementById("myCan3");
  let canvas4 = document.getElementById("myCan4");
  let canvas5 = document.getElementById("myCan5");

  addListenerMulti(body, "mousemove mousedown mouseup", canMove);
  //body.addEventListener("mousemove", canMove);
  body.addEventListener("keypress", keyboard);

  addListenerMulti(canvas1, "mousedown mouseleave mouseenter", onClick);
  addListenerMulti(canvas2, "mousedown mouseleave mouseenter", onClick);
  addListenerMulti(canvas3, "mousedown mouseleave mouseenter", onClick);
  addListenerMulti(canvas4, "mousedown mouseleave mouseenter", onClick);
  addListenerMulti(canvas5, "mousedown mouseleave mouseenter", onClick);
  canvas1.addEventListener("wheel", onScroll);
  canvas2.addEventListener("wheel", onScroll);

  let rnd1 = new Render(canvas1);
  let rnd2 = new Render(canvas2);
  let rnd3 = new Render(canvas3);
  let rnd4 = new Render(canvas4);
  let rnd5 = new Render(canvas5);

  //const frustumCube = new FrustumCube();

  const cubeprim = cube.makePrim(rnd1, matrScale(vec3(0.75)));
  const tetraprim = tetrahedron.makePrim(rnd2, mat4());
  const octaprim = octahedron.makePrim(rnd3, mat4());
  const icosaprim = icosahedron.makePrim(rnd4, mat4());
  const dodeprim = dodecahedron.makePrim(rnd5, mat4());
  //const frcubeprim = frustumCube.makePrim(rnd6, mat4());

  const rnds = [rnd1, rnd2, rnd3, rnd4, rnd5];
  const prims = [cubeprim, tetraprim, octaprim, icosaprim, dodeprim];

  const draw = () => {
    for (let i = 0; i < rnds.length; i++) {
      figures[i].time.response();

      let time = figures[i].time.localTime;

      rnds[i].renderStart(figures[i].time.isPause);
      prims[i].render(
        rnds[i],
        figures[i].matrix.mul(matrRotate(time, vec3(5, 2, 0)).mul(rots[i]))
        //prims[i].matrix.mul(matrRotate(time, vec3(0, 1, 0))),
      );
    }
    window.requestAnimationFrame(draw);
  };
  draw();
}
let rot1 = mat4(),
  rot2 = mat4(),
  rot3 = mat4(),
  rot4 = mat4(),
  rot5 = mat4(),
  tr1 = mat4(),
  tr2 = mat4(),
  tr3 = mat4(),
  tr4 = mat4(),
  tr5 = mat4(),
  lastCan = undefined,
  NowCan = undefined,
  InCan = false,
  IsDown = false;

const cube = new Cube();
const tetrahedron = new Tetrahedron();
const octahedron = new Octahedron();
const icosahedron = new Icosahedron();
const dodecahedron = new Dodecahedron();

const figures = [cube, tetrahedron, octahedron, icosahedron, dodecahedron];

const rots = [rot1, rot2, rot3, rot4, rot5];
const trs = [tr1, tr2, tr3, tr4, tr5];
let rotSpeed = 0.008;
let ScrollSpeed = 0.0008;

function canMove(e) {
  if (e.type == "mousedown") {
    IsDown = true;
    return;
  }
  if (e.type == "mouseup") {
    IsDown = false;
    lastCan = undefined;
    return;
  }
  if (IsDown) {
    if (lastCan != undefined && e.buttons > 0) {
      let i = lastCan[5];
      rots[i - 1] = rots[i - 1].mul(
        matrRotate(-e.movementX * rotSpeed, vec3(0, 1, 0))
      );
      rots[i - 1] = rots[i - 1].mul(
        matrRotate(-e.movementY * rotSpeed, vec3(1, 0, 0))
      );
    }
  }
}

function onClick(e) {
  if (e.type == "mousedown") {
    IsDown = true;
    InCan = true;
    lastCan = e.currentTarget.id;
  } else if (e.type == "mouseleave") {
    InCan = false;
    NowCan = undefined;
  } else if (e.type == "mouseenter") {
    InCan = true;
    NowCan = e.currentTarget.id;
  }
  /*
  let i = e.currentTarget.id[5];
  lastCan = e.currentTarget;
  rots[i - 1] = rots[i - 1].mul(
    matrRotate(-e.movementX * rotSpeed, vec3(0, 1, 0))
  );
  rots[i - 1] = rots[i - 1].mul(
    matrRotate(-e.movementY * rotSpeed, vec3(1, 0, 0))
  );
  */
}
function onScroll(e) {
  if (NowCan != undefined) {
    let i = NowCan[5];
    rots[i - 1] = rots[i - 1].mul(
      matrTranslate(vec3(0, 0, e.deltaY * ScrollSpeed * 0))
    );
  }
}

function keyboard(e) {
  if (e.key == "p") {
    if (NowCan != undefined) {
      let i = NowCan[5];
      figures[i - 1].time.isPause = !figures[i - 1].time.isPause;
    }
  }
  console.log(e);
}

window.addEventListener("load", () => {
  main();
});

// END OF 'main' MODULE
