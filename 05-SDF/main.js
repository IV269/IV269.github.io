const INF = 255000;

async function loadImage(url) {
    return new Promise((r) => {
        let i = new Image();
        i.onload = () => r(i);
        i.src = url;
    });
}

const imgs = [];
const sdf_cans = [];
const sdf_ctxs = [];
const cans = [];
const ctxs = [];
const coefs = [8, 13, 10];

let img = await loadImage("./images/test2.png");
let img2 = await loadImage("./images/pngegg.png");
let img3 = await loadImage("./images/test3.png");
imgs.push(img);
imgs.push(img2);
imgs.push(img3);

function transpose(sedt, w = 0, h = 0) {
    if (sedt[0].length > 0) {
        let v = [];
        for (let i = 0; i < sedt[0].length; i++) {
            v[i] = [];
        }
        for (let i = 0; i < sedt[0].length; i++) {
            for (let j = 0; j < sedt.length; j++) {
                v[i].push(sedt[j][i]);
            }
        }
        return v;
    } else {
        let v = [];
        if (w > h) {
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    v.push(sedt[j * h + i]);
                }
            }
        } else {
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    v.push(sedt[j * h + i]);
                }
            }
        }
        return v;
    }
}

function intersect_parabolas(p, q) {
    let x = (q[1] + q[0] * q[0] - (p[1] + p[0] * p[0])) / (2 * q[0] - 2 * p[0]);
    return [x, 0];
}

function find_hull_parabolas(single_row, hull_vertices, hull_intersections) {
    let d = single_row;
    let v = hull_vertices;
    let z = hull_intersections;
    let k = 0;
    v[0] = [];
    z[0] = [];
    z[1] = [];
    v[0][0] = 0;
    z[0][0] = -INF;
    z[1][0] = +INF;
    for (let i = 1; i < d.length; i++) {
        let q = [i, d[i]];
        let p = v[k];
        if (p[0] == undefined) {
            p[0] = 0;
        }
        if (p[1] == undefined) {
            p[1] = 0;
        }
        let s = intersect_parabolas(p, q);
        while (s[0] <= z[k][0]) {
            k--;
            p = v[k];
            if (p[0] == undefined) {
                p[0] = 0;
            }
            if (p[1] == undefined) {
                p[1] = 0;
            }
            s = intersect_parabolas(p, q);
        }
        k++;
        v[k] = q;
        z[k][0] = s[0];
        if (z[k + 1] == undefined) {
            z[k + 1] = [];
            z[k + 1][0] = 0;
            z[k + 1][1] = 0;
        }
        z[k + 1][0] = +INF;
    }
}

function march_parabolas(single_row, hull_vertices, hull_intersections) {
    let d = single_row;
    let v = hull_vertices;
    let z = hull_intersections;
    let k = 1;

    for (let q = 0; q < d.length; q++) {
        if (z[k + 1] == undefined || z[k + 1][0] == undefined) {
            z[k + 1] = [];
            z[k + 1] = 0;
        }

        while (z[k + 1][0] < q) {
            k++;
        }
        if (v[k] == undefined || v[k][0] == undefined) {
            v[k] = [];
            v[k][0] = 0;
            v[k][1] = 0;
        }
        let dx = q - v[k][0];
        d[q] = dx * dx + v[k][1];
    }
}
function horizontal_pass(single_row) {
    let hull_vertices = [];
    let hull_intersections = [];
    find_hull_parabolas(single_row, hull_vertices, hull_intersections);
    march_parabolas(single_row, hull_vertices, hull_intersections);
}

function compute_edt(bool_field, he, wi) {
    let sedt = [];
    let r = bool_field.slice(0);
    for (let i = 0; i < he; i++) {
        sedt[i] = [];
    }
    for (let i = 0; i < he; i++) {
        for (let j = 0; j < wi; j++) {
            if (r[i * wi + j]) {
                r[i * wi + j] = +INF;
            } else {
                r[i * wi + j] = 0;
            }
            sedt[i][j] = r[i * wi + j];
        }
    }
    console.log(sedt);
    for (let i = 0; i < sedt.length; i++) {
        horizontal_pass(sedt[i]);
    }
    sedt = transpose(sedt);
    console.log(sedt);
    for (let i = 0; i < sedt.length; i++) {
        horizontal_pass(sedt[i]);
    }
    sedt = transpose(sedt);
    for (let i = 0; i < sedt.length; i++) {
        for (let j = 0; j < sedt[0].length; j++) {
            sedt[i][j] = Math.sqrt(sedt[i][j]);
        }
    }
    return sedt;
}

setTimeout(function main() {
    let tex = document.getElementById("t_orig");
    let sdf_tex = document.getElementById("t_sdf");

    for (let p in imgs) {
        // creating canvas
        let can = document.createElement("canvas");
        can.setAttribute("id", `orig${p}`);
        can.width = imgs[p].width;
        can.height = imgs[p].height;

        if (cans.length == 0) {
            tex.insertAdjacentElement("afterend", can);
        } else {
            cans[p - 1].insertAdjacentElement("afterend", can);
        }
        cans.push(can);
        let ctx = can.getContext("2d");
        ctxs.push(ctx);

        // creating sdf canvas
        let sdf_can = document.createElement("canvas");
        sdf_can.setAttribute("id", `sdf${p}`);
        sdf_can.width = imgs[p].width;
        sdf_can.height = imgs[p].height;

        if (sdf_cans.length == 0) {
            sdf_tex.insertAdjacentElement("afterend", sdf_can);
        } else {
            sdf_cans[p - 1].insertAdjacentElement("afterend", sdf_can);
        }
        let sdf_ctx = sdf_can.getContext("2d");

        sdf_cans.push(sdf_can);
        sdf_ctxs.push(sdf_ctx);
    }

    // drawing original
    for (let i in ctxs) {
        ctxs[i].drawImage(imgs[i], 0, 0, imgs[i].width, imgs[i].height);
    }

    for (let k in ctxs) {
        // taking info from image
        let src = ctxs[k].getImageData(
            0,
            0,
            imgs[k].width,
            imgs[k].height
        ).data;
        let data = [];
        for (let i = 0; i < src.length; i += 4) {
            data[i / 4] = src[i] / 255;
        }
        // calculating
        data = compute_edt(data, imgs[k].height, imgs[k].width);
        let buffer = new Uint8ClampedArray(imgs[k].width * imgs[k].height * 4);
        let sad = 0,
            sad2 = 0;
        for (let i = 0; i < sdf_cans[k].height; i++) {
            for (let j = 0; j < sdf_cans[k].width; j++) {
                let pos = (i * sdf_cans[k].width + j) * 4;
                if (sad >= data[0].length) {
                    sad = 0;
                    sad2 += 1;
                }
                buffer[pos] = data[sad2][sad] * coefs[k];
                buffer[pos + 1] = data[sad2][sad] * coefs[k];
                buffer[pos + 2] = data[sad2][sad] * coefs[k];
                buffer[pos + 3] = 255;
                sad += 1;
            }
        }
        // drawing picture
        let idata = sdf_ctxs[k].createImageData(
            sdf_cans[k].width,
            sdf_cans[k].height
        );
        idata.data.set(buffer);
        sdf_ctxs[k].putImageData(idata, 0, 0);
    }
    //console.log(src);
    //console.log(data);
}, 5);
