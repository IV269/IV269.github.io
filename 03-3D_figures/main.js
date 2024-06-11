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
} from "./lib.js";

console.log("MAIN LOADED");

function main() {
  let canvas1 = document.getElementById("myCan1");
  let canvas2 = document.getElementById("myCan2");
  let canvas3 = document.getElementById("myCan3");
  let canvas4 = document.getElementById("myCan4");
  let canvas5 = document.getElementById("myCan5");

  canvas1.addEventListener("mousemove", onClick);
  canvas2.addEventListener("mousemove", onClick);
  canvas3.addEventListener("mousemove", onClick);
  canvas4.addEventListener("mousemove", onClick);
  canvas5.addEventListener("mousemove", onClick);
  canvas1.addEventListener("wheel", onScroll);
  canvas2.addEventListener("wheel", onScroll);

  let rnd1 = new Render(canvas1);
  let rnd2 = new Render(canvas2);
  let rnd3 = new Render(canvas3);
  let rnd4 = new Render(canvas4);
  let rnd5 = new Render(canvas5);

  const cube = new Cube();
  const tetrahedron = new Tetrahedron();
  const octahedron = new Octahedron();
  const icosahedron = new Icosahedron();
  const dodecahedron = new Dodecahedron();

  const cubeprim = cube.makePrim(rnd1, matrScale(vec3(0.75)));
  const tetraprim = tetrahedron.makePrim(rnd2, mat4());
  const octaprim = octahedron.makePrim(rnd3, mat4());
  const icosaprim = icosahedron.makePrim(rnd4, mat4());
  const dodeprim = dodecahedron.makePrim(rnd5, mat4());

  const rnds = [rnd1, rnd2, rnd3, rnd4, rnd5];
  const prims = [cubeprim, tetraprim, octaprim, icosaprim, dodeprim];
  const figures = [cube, tetrahedron, octahedron, icosahedron, dodecahedron];

  const draw = () => {
    for (let i = 0; i < rnds.length; i++) {
      figures[i].time.response();

      let time = figures[i].time.localTime;

      rnds[i].renderStart();
      prims[i].render(
        rnds[i],
        rots[i].mul(figures[i].matrix).mul(matrRotate(time, vec3(-5, 2, 0))),
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
  rot5 = mat4();

const rots = [rot1, rot2, rot3, rot4, rot5];
let rotSpeed = 0.008;

function onClick(e) {
  e.preventDefault();
  if (e.buttons != 1) {
    return;
  }
  let i = e.currentTarget.id[5];
  rots[i - 1] = rots[i - 1].mul(
    matrRotate(-e.movementX * rotSpeed, vec3(0, 1, 0)),
  );
  rots[i - 1] = rots[i - 1].mul(
    matrRotate(-e.movementY * rotSpeed, vec3(1, 0, 0)),
  );
}
function onScroll(e) {
  e.preventDefault();
}

function keyboard(e) {
  console.log(e);
}

window.addEventListener("load", () => {
  main();
});

// END OF 'main' MODULE
