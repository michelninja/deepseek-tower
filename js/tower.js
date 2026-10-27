import * as THREE from "three";
import { acts } from "./content.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- narrative into the DOM (readable without WebGL) ---------- */
const main = document.getElementById("acts");
acts.forEach((a, i) => {
  const sec = document.createElement("section");
  sec.className = "act";
  sec.id = a.id;
  sec.dataset.index = String(i);
  sec.innerHTML = `
    <div class="card">
      <p class="eyebrow">${a.eyebrow}</p>
      <h2>${a.title}<span class="plaque">${a.plaque}</span></h2>
      ${a.story.map((p) => `<p>${p}</p>`).join("")}
      <p class="ninja"><b>Your case file</b>${a.ninja}</p>
      <p class="who-else"><b>Who else</b>${a.whoElse}</p>
    </div>`;
  main.appendChild(sec);
});

/* ---------- 3D ---------- */
const canvas = document.getElementById("scene");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (e) {
  renderer = null;
}
if (!renderer) {
  document.getElementById("fallback").hidden = false;
  canvas.style.display = "none";
} else {
  boot();
}

/* a canvas-texture sign, so the rooms are named */
function sign(text, w, h, ink = "#3d4353") {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 128;
  const g = c.getContext("2d");
  g.clearRect(0, 0, 512, 128);
  g.fillStyle = ink;
  g.font = "600 54px Inter, Helvetica, Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.letterSpacing = "6px";
  g.fillText(text, 256, 66);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  return m;
}

function boot() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf4f1ea, 36, 115);

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 400);
  camera.position.set(12, 3, 24);

  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x3d4353, 1.15));
  const sun = new THREE.DirectionalLight(0xffe9cc, 1.3);
  sun.position.set(-16, 34, 20);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x9fc6d8, 0.55);
  rim.position.set(20, 14, -22);
  scene.add(rim);
  const front = new THREE.DirectionalLight(0xffffff, 0.5);
  front.position.set(6, 8, 30);
  scene.add(front);

  /* --- the tower: 40 floors, front wall cut away so you can see in --- */
  const FLOORS = 40, FH = 0.62, W = 5.6, D = 4.2;
  const towerH = FLOORS * FH;
  const tower = new THREE.Group();
  scene.add(tower);

  const floorMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: .84, metalness: .04 });
  const encMat   = new THREE.MeshStandardMaterial({ color: 0xd3c19c, roughness: .88, metalness: .03 });
  const decMat   = new THREE.MeshStandardMaterial({ color: 0xdae3e4, roughness: .84, metalness: .05 });
  const seamMat  = new THREE.MeshStandardMaterial({ color: 0xc8553d, roughness: .5, metalness: .2, emissive: 0x3a1008, emissiveIntensity: .5 });
  const backMat  = new THREE.MeshStandardMaterial({ color: 0xcfc6b2, roughness: .95, metalness: .02 });
  const woodMat  = new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: .7, metalness: .05 });

  const slabGeo = new THREE.BoxGeometry(W, FH * 0.14, D);
  const backGeo = new THREE.BoxGeometry(W * 0.98, FH * 0.86, 0.08);
  const sideGeo = new THREE.BoxGeometry(0.09, FH * 0.86, D * 0.98);
  const deskGeo = new THREE.BoxGeometry(W * 0.52, FH * 0.22, 0.34);

  for (let i = 0; i < FLOORS; i++) {
    const y = i * FH;
    const isSeam = i === 20;
    const slab = new THREE.Mesh(slabGeo, isSeam ? seamMat : floorMat);
    slab.position.y = y;
    const mat = i < 20 ? encMat : decMat;
    const back = new THREE.Mesh(backGeo, isSeam ? seamMat : backMat);
    back.position.set(0, y + FH * 0.5, -D * 0.5 + 0.06);
    const left = new THREE.Mesh(sideGeo, mat);
    left.position.set(-W * 0.5 + 0.05, y + FH * 0.5, 0);
    const right = new THREE.Mesh(sideGeo, mat);
    right.position.set(W * 0.5 - 0.05, y + FH * 0.5, 0);
    /* a bench along the back of each room */
    const bench = new THREE.Mesh(deskGeo, woodMat);
    bench.position.set(0, y + FH * 0.5 - FH * 0.18, -D * 0.34);
    tower.add(slab, back, left, right, bench);
  }

  /* --- ground floor: courtyard, doorway, reception, elevator shafts --- */
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(60, 64),
    new THREE.MeshStandardMaterial({ color: 0xe4dccb, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  scene.add(ground);

  const Y0 = 0.14;                       // eye level of a person on floor 0
  const DOOR_Z = D * 0.5 + 1.1;
  const DOOR_X = 1.9;

  const doorMat = new THREE.MeshStandardMaterial({ color: 0x2f3a44, roughness: .6, metalness: .2 });
  const postGeo = new THREE.BoxGeometry(0.16, 1.05, 0.16);
  const dpostL = new THREE.Mesh(postGeo, doorMat);
  dpostL.position.set(DOOR_X - 0.62, 0.5, DOOR_Z);
  const dpostR = new THREE.Mesh(postGeo, doorMat);
  dpostR.position.set(DOOR_X + 0.62, 0.5, DOOR_Z);
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 0.16), doorMat);
  lintel.position.set(DOOR_X, 1.02, DOOR_Z);
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 0.9), woodMat);
  canopy.position.set(DOOR_X, 1.16, DOOR_Z + 0.3);
  const mailbox = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.3, 0.22), woodMat);
  mailbox.position.set(DOOR_X + 1.15, 0.55, DOOR_Z - 0.1);
  tower.add(dpostL, dpostR, lintel, canopy, mailbox);

  const sMail = sign("MAILROOM", 1.5, 0.37, "#c8553d");
  sMail.position.set(DOOR_X, 1.42, DOOR_Z + 0.5);
  tower.add(sMail);

  const DESK_X = -1.75, DESK_Z = 0.75;
  const counter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.44, 0.44), woodMat);
  counter.position.set(DESK_X, Y0 + 0.22, DESK_Z);
  const counterTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.05, 0.54),
    new THREE.MeshStandardMaterial({ color: 0x6f5439, roughness: .55 })
  );
  counterTop.position.set(DESK_X, Y0 + 0.46, DESK_Z);
  tower.add(counter, counterTop);

  const sRecep = sign("RECEPTION", 1.6, 0.4, "#1f4e5f");
  sRecep.position.set(DESK_X, Y0 + 0.95, DESK_Z + 0.3);
  tower.add(sRecep);

  /* four shafts, and a lit cabin riding in each */
  const SHAFT_X = [0.35, 1.35, 2.35, 3.35];
  const SHAFT_Z = -D * 0.22;
  const shaftMat = new THREE.MeshStandardMaterial({ color: 0xb9b2a2, roughness: .8, metalness: .1 });
  SHAFT_X.forEach((x) => {
    for (const sx of [-0.34, 0.34]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, towerH, 0.05), shaftMat);
      rail.position.set(x + sx, towerH * 0.5, SHAFT_Z);
      tower.add(rail);
    }
  });
  const cabMat = new THREE.MeshStandardMaterial({
    color: 0xf4e9d2, roughness: .35, metalness: .25,
    emissive: 0xffd9a0, emissiveIntensity: .45,
  });
  const cabGeo = new THREE.BoxGeometry(0.62, 0.46, 0.62);
  const cabs = SHAFT_X.map((x) => {
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(x, 0.4, SHAFT_Z);
    tower.add(cab);
    return cab;
  });

  const sLift = sign("ELEVATORS", 1.7, 0.42, "#1f4e5f");
  sLift.position.set(1.85, Y0 + 1.35, SHAFT_Z + 0.2);
  tower.add(sLift);

  /* --- investigators: capsule body + head, one pair per token --- */
  const COUNT = 150;
  const bodyGeo = new THREE.CapsuleGeometry(0.034, 0.062, 3, 7);
  const headGeo = new THREE.SphereGeometry(0.031, 8, 6);
  const skinMat = new THREE.MeshStandardMaterial({ color: 0x1f4e5f, roughness: .45, metalness: .12 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0xe8b98f, roughness: .7, metalness: .02 });
  const bodies = new THREE.InstancedMesh(bodyGeo, skinMat, COUNT);
  const heads = new THREE.InstancedMesh(headGeo, headMat, COUNT);
  const dossierGeo = new THREE.BoxGeometry(0.09, 0.012, 0.065);
  const dossierMat = new THREE.MeshStandardMaterial({ color: 0xc8553d, roughness: .5, metalness: .15 });
  const dossiers = new THREE.InstancedMesh(dossierGeo, dossierMat, COUNT);
  tower.add(bodies, heads, dossiers);

  const invData = Array.from({ length: COUNT }, (_, i) => ({
    lane: i % 4,
    phase: (i / COUNT) * 0.92 + Math.random() * 0.02,
    slot: Math.floor(i / 4) % 9,
    seed: Math.random() * 100,
  }));

  /* --- the reception clerk and two mailroom staff --- */
  function person(x, z, y, colour) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: colour, roughness: .5 }));
    b.scale.set(1.25, 1.25, 1.25);
    b.position.y = 0.075;
    const h = new THREE.Mesh(headGeo, headMat);
    h.scale.setScalar(1.15);
    h.position.y = 0.185;
    g.add(b, h);
    g.position.set(x, y, z);
    return g;
  }
  tower.add(person(DESK_X, DESK_Z - 0.6, Y0, 0x8c3f2c));
  tower.add(person(DOOR_X - 0.95, DOOR_Z - 0.5, Y0, 0x3b5a63));
  tower.add(person(DOOR_X + 0.95, DOOR_Z - 0.35, Y0, 0x3b5a63));

  /* --- archive cargo, stacked along the back wall --- */
  const zipGeo = new THREE.BoxGeometry(0.1, 0.045, 0.1);
  const zipMat = new THREE.MeshStandardMaterial({ color: 0xb08a5f, roughness: .6, metalness: .1 });
  const zips = new THREE.InstancedMesh(zipGeo, zipMat, 160);
  tower.add(zips);

  const dummy = new THREE.Object3D();
  const clock = new THREE.Clock();

  function layoutCards() {
    return acts.map((a, i) => {
      const el = document.getElementById(a.id);
      const r = el.getBoundingClientRect();
      return { i, mid: r.top + scrollY + r.height / 2 };
    });
  }

  let marks = layoutCards();

  /* map scroll position to a fractional floor, interpolating between acts */
  function actProgress() {
    const centre = scrollY + innerHeight / 2;
    let i = 0;
    for (let k = 0; k < marks.length; k++) if (centre >= marks[k].mid - innerHeight * 0.5) i = k;
    const a = acts[i], b = acts[Math.min(i + 1, acts.length - 1)];
    if (a === b) return a.floor / 40;
    const span = marks[Math.min(i + 1, marks.length - 1)].mid - marks[i].mid;
    const f = span > 0 ? Math.min(1, Math.max(0, (centre - marks[i].mid) / span)) : 0;
    return (a.floor + (b.floor - a.floor) * f) / 40;
  }
  addEventListener("resize", () => {
    marks = layoutCards();
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  });

  /* the walk: door → queue → desk (dossier) → shaft → up */
  const v = new THREE.Vector3();
  function lerp(a, b, t) { return a + (b - a) * t; }
  function walkPath(u, lane) {
    const laneX = SHAFT_X[lane];
    const queueX = 0.2 + lane * 0.55;
    const pts = [
      //  u    x                        y            z
      [0.00, DOOR_X + 0.9, Y0, DOOR_Z + 2.4],
      [0.09, DOOR_X, Y0, DOOR_Z + 0.9],
      [0.16, DOOR_X - 0.5, Y0, DOOR_Z - 0.4],
      [0.24, queueX, Y0, 1.9],
      [0.33, DESK_X + 1.5, Y0, DESK_Z + 0.45],
      [0.40, DESK_X + 1.05, Y0, DESK_Z + 0.4],
      [0.50, laneX, Y0, SHAFT_Z + 0.75],
      [0.56, laneX, Y0, SHAFT_Z + 0.1],
      [0.99, laneX, towerH - 0.5, SHAFT_Z + 0.1],
      [1.00, laneX, towerH - 0.5, SHAFT_Z + 0.1],
    ];
    let k = 0;
    while (k < pts.length - 2 && u > pts[k + 1][0]) k++;
    const a = pts[k], b = pts[k + 1];
    const span = b[0] - a[0];
    const f = span > 0 ? Math.min(1, Math.max(0, (u - a[0]) / span)) : 0;
    v.set(lerp(a[1], b[1], f), lerp(a[2], b[2], f), lerp(a[3], b[3], f));
    return v;
  }

  const target = new THREE.Vector3(0, 2, 0);
  const camPos = new THREE.Vector3(12, 3, 24);

  function frame() {
    const t = clock.getElapsedTime();
    const maxScroll = Math.max(1, document.body.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / maxScroll));
    const af = actProgress();

    // low over the lobby when the story is on floor 0, then climb alongside
    const towerY = af * towerH;
    const low = Math.max(0, 1 - af * 9);           // 1 at the lobby, 0 by floor ~5
    const orbit = reduceMotion ? 0 : Math.sin(t * 0.14) * 0.3;
    const r = 22 - p * 5 - low * 8.5;
    const camY = towerY + 4.4 - low * 3.4;

    camPos.set(Math.sin(orbit) * r + low * 1.2, camY, Math.cos(orbit) * r);
    camera.position.lerp(camPos, 0.055);
    target.set(0, towerY + 1.5, 0);
    camera.lookAt(target);

    // investigators run their walk on a loop, staggered
    for (let i = 0; i < COUNT; i++) {
      const d = invData[i];
      let u = (t * 0.055 + d.phase) % 1;
      const pos = walkPath(u, d.lane);
      const walking = u < 0.56;
      const step = reduceMotion ? 0 : Math.sin(t * 9 + d.seed) * (walking ? 0.012 : 0.004);
      const bob = walking ? Math.abs(Math.sin(t * 9 + d.seed)) * 0.012 : 0;

      dummy.position.set(pos.x, pos.y + bob, pos.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.translateY(0.075);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);

      dummy.position.set(pos.x, pos.y + bob + 0.183, pos.z);
      dummy.scale.setScalar(1.01);
      dummy.updateMatrix();
      heads.setMatrixAt(i, dummy.matrix);

      // the dossier appears at the counter and is carried up
      const holding = u > 0.37 && u < 0.97;
      dummy.position.set(pos.x + step, pos.y + bob + 0.11, pos.z + 0.075);
      dummy.rotation.set(0.25, 0, 0);
      dummy.scale.setScalar(holding ? 1 : 0.001);
      dummy.updateMatrix();
      dossiers.setMatrixAt(i, dummy.matrix);
    }
    bodies.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
    dossiers.instanceMatrix.needsUpdate = true;

    // cabins ride the shafts
    cabs.forEach((cab, idx) => {
      const u = ((t * 0.035 + idx * 0.24) % 1);
      cab.position.y = 0.3 + u * (towerH - 0.7);
    });

    // archive cargo along the back wall
    for (let i = 0; i < zips.count; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const y = (row / 20) * towerH + 0.2;
      dummy.position.set(-W * 0.4 + col * 0.11, y, -D * 0.44);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(0.9 - row * 0.006);
      dummy.updateMatrix();
      zips.setMatrixAt(i, dummy.matrix);
    }
    zips.instanceMatrix.needsUpdate = true;

    // act entry highlight
    const centre = scrollY + innerHeight / 2;
    let active = 0;
    marks.forEach((m, idx) => { if (centre >= m.mid - 200) active = idx; });
    document.querySelectorAll(".act").forEach((el, idx) => {
      el.classList.toggle("is-active", idx === active);
    });

    const meter = document.getElementById("floor-o-meter");
    if (meter) {
      meter.classList.toggle("is-on", scrollY > innerHeight * 0.6);
      meter.firstElementChild.textContent = String(Math.round(af * 40));
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
