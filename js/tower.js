import * as THREE from "three";
import { acts } from "./content.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- narrative into the DOM (readable without WebGL) ---------- */
/* **x** marks something you can watch happen on the 3D screen */
const bold = (t) => t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
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
      ${a.story.map((p) => `<p>${bold(p)}</p>`).join("")}
      <p class="example"><b>Step by step</b>${bold(a.example)}</p>
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
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setSize(innerWidth, innerHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf4f1ea, 34, 130);

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 400);
  camera.position.set(12, 3, 24);

  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x2c3240, 0.9));
  const sun = new THREE.DirectionalLight(0xffe9cc, 1.55);
  sun.position.set(-16, 34, 20);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x9fc6d8, 0.6);
  rim.position.set(20, 14, -22);
  scene.add(rim);
  const front = new THREE.DirectionalLight(0xffffff, 0.85);
  front.position.set(6, 8, 30);
  scene.add(front);

  /* --- the tower: 40 floors, front wall cut away so you can see in --- */
  const FLOORS = 40, FH = 0.62, W = 5.6, D = 4.2;
  const towerH = FLOORS * FH;
  const tower = new THREE.Group();
  scene.add(tower);

  const floorMat = new THREE.MeshStandardMaterial({ color: 0xcfc4ac, roughness: .84, metalness: .04 });
  const encMat   = new THREE.MeshStandardMaterial({ color: 0xa88b5c, roughness: .88, metalness: .03 });
  const decMat   = new THREE.MeshStandardMaterial({ color: 0xa8c0c6, roughness: .84, metalness: .05 });
  const seamMat  = new THREE.MeshStandardMaterial({ color: 0xc8553d, roughness: .5, metalness: .2, emissive: 0x3a1008, emissiveIntensity: .5 });
  const backMat  = new THREE.MeshStandardMaterial({ color: 0xa89a80, roughness: .95, metalness: .02 });
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
    bench.position.set(0, y + FH * 0.07 + FH * 0.11, -D * 0.36);
    tower.add(slab, back, left, right, bench);
  }

  /* furniture: every floor is a working room, not an empty shelf.
     Two rows of desks plus a run of filing cabinets, all instanced. */
  const deskUnit = new THREE.BoxGeometry(0.34, 0.16, 0.24);
  const chairUnit = new THREE.BoxGeometry(0.16, 0.14, 0.16);
  const cabUnit = new THREE.BoxGeometry(0.2, 0.42, 0.18);
  const deskInst = new THREE.InstancedMesh(deskUnit, woodMat, FLOORS * 4);
  const chairInst = new THREE.InstancedMesh(chairUnit,
    new THREE.MeshStandardMaterial({ color: 0x5c6b70, roughness: .7 }), FLOORS * 4);
  const cabInst = new THREE.InstancedMesh(cabUnit,
    new THREE.MeshStandardMaterial({ color: 0xa9927a, roughness: .8 }), FLOORS * 6);
  tower.add(deskInst, chairInst, cabInst);

  /* floor numbers on the left flank, every fifth storey, so the climb is legible */
  for (let i = 5; i <= FLOORS; i += 5) {
    const plaque = sign(String(i), 0.5, 0.26, "#5a5344");
    plaque.position.set(-W * 0.5 - 0.02, i * FH - FH * 0.35, D * 0.42);
    plaque.rotation.y = -Math.PI / 2;
    tower.add(plaque);
  }

  const furn = new THREE.Object3D();
  const DECK = FH * 0.07;                 // top surface of a slab
  for (let i = 0; i < FLOORS; i++) {
    const deck = i * FH + DECK;
    for (let k = 0; k < 4; k++) {
      const x = -W * 0.32 + k * (W * 0.21);
      furn.position.set(x, deck + 0.08, -D * 0.22);
      furn.rotation.set(0, 0, 0); furn.scale.setScalar(1); furn.updateMatrix();
      deskInst.setMatrixAt(i * 4 + k, furn.matrix);
      furn.position.set(x, deck + 0.07, -D * 0.04);
      furn.updateMatrix();
      chairInst.setMatrixAt(i * 4 + k, furn.matrix);
    }
    for (let k = 0; k < 6; k++) {
      furn.position.set(-W * 0.42 + k * 0.17, deck + 0.21, D * 0.14);
      furn.scale.setScalar(1); furn.updateMatrix();
      cabInst.setMatrixAt(i * 6 + k, furn.matrix);
    }
  }

  /* lamps at the open front, so the rooms are not shadow boxes */
  for (let i = 1; i < FLOORS; i += 4) {
    const lamp = new THREE.PointLight(0xffeed6, 0.55, 15, 2);
    lamp.position.set(0, i * FH + FH * 0.5, D * 0.34);
    tower.add(lamp);
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

  /* a mat under the doorway and a rail to the counter, so the entry line reads */
  const mat = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.02, 3.6),
    new THREE.MeshStandardMaterial({ color: 0xa8b3b6, roughness: .95 })
  );
  mat.position.set(DOOR_X - 0.15, 0.01, DOOR_Z + 0.4);
  tower.add(mat);
  const railMat = new THREE.MeshStandardMaterial({ color: 0x8a8377, roughness: .8 });
  for (const rz of [1.55, 2.35]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.03, 0.03), railMat);
    rail.position.set(0.85, 0.34, rz);
    tower.add(rail);
    for (const rx of [-0.45, 0.85, 2.15]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.34, 0.035), railMat);
      post.position.set(rx, 0.17, rz);
      tower.add(post);
    }
  }

  /* the door itself is just the door — the mailroom is the sorting table inside */
  const sDoor = sign("ENTRANCE", 1.0, 0.26, "#3d4353");
  sDoor.position.set(DOOR_X, 1.42, DOOR_Z + 0.12);
  tower.add(sDoor);

  /* the mailroom: a long sorting table just inside the door, where the prompt
     gets sliced. Investigators walk straight past it on their way to reception. */
  const MAIL_X = 1.75, MAIL_Z = 1.62;
  const mailTable = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.38, 0.46), woodMat);
  mailTable.position.set(MAIL_X, Y0 + 0.19, MAIL_Z);
  const mailTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.05, 0.54),
    new THREE.MeshStandardMaterial({ color: 0x6f5439, roughness: .55 })
  );
  mailTop.position.set(MAIL_X, Y0 + 0.41, MAIL_Z);
  tower.add(mailTable, mailTop);

  const sMail = sign("MAILROOM", 1.1, 0.26, "#c8553d");
  sMail.position.set(MAIL_X, Y0 + 0.74, MAIL_Z - 0.26);
  tower.add(sMail);


  const DESK_X = -0.85, DESK_Z = 1.05;
  const counter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.44, 0.44), woodMat);
  counter.position.set(DESK_X, Y0 + 0.22, DESK_Z);
  const counterTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.05, 0.54),
    new THREE.MeshStandardMaterial({ color: 0x6f5439, roughness: .55 })
  );
  counterTop.position.set(DESK_X, Y0 + 0.46, DESK_Z);
  tower.add(counter, counterTop);

  const sRecep = sign("RECEPTION", 1.35, 0.34, "#1f4e5f");
  sRecep.position.set(DESK_X, Y0 + 0.82, DESK_Z + 0.28);
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

  const sLift = sign("ELEVATORS", 1.4, 0.34, "#1f4e5f");
  sLift.position.set(1.85, Y0 + 0.95, SHAFT_Z + 0.14);
  tower.add(sLift);

  /* --- investigators: capsule body + head, one pair per token --- */
  /* fourteen Investigators — exactly the crowd the story counts:
     What · is · Ninja · Tech · ?  +  https · :// · www · . · ninja · tech · .ai · / · about */
  const COUNT = 14;
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
    phase: (i / COUNT) * 0.9 + Math.random() * 0.015,
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
  /* two sorters behind the mailroom table — the staff doing the slicing */
  tower.add(person(MAIL_X - 0.42, MAIL_Z - 0.4, Y0, 0x8c3f2c));
  tower.add(person(MAIL_X + 0.42, MAIL_Z - 0.4, Y0, 0x8c3f2c));

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
    const qz = 1.30 + lane * 0.11;         // four parallel queue lines in front of the desk
    const pts = [
      //  u    x                              y   z
      [0.00, DOOR_X, Y0, DOOR_Z + 2.6],     // out on the street
      [0.06, DOOR_X, Y0, DOOR_Z + 0.35],    // through the entrance
      [0.12, DOOR_X - 0.6, Y0, 1.72],       // in, past the mailroom sorting table
      [0.20, 1.15, Y0, qz],                 // join the queue
      [0.33, -0.35, Y0, qz],                // shuffle forward toward reception
      [0.40, DESK_X + 1.15, Y0, DESK_Z + 0.5], // at the counter: clipboard handed over
      [0.47, DESK_X + 1.15, Y0, DESK_Z + 0.42],
      [0.56, laneX, Y0, SHAFT_Z + 0.8],     // walk to a shaft
      [0.62, laneX, Y0, SHAFT_Z + 0.1],     // step in
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

  const inspectMatch = /[?&]floor=(\d+)/.exec(location.search);
  const INSPECT = inspectMatch ? Number(inspectMatch[1]) : null;
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
    // Frame a band of ~9 floors around the storey the story is on, so the rooms
    // are big enough to read. Step back for the whole tower at the very top.
    const wide = Math.max(0, (af - 0.86) / 0.14);   // 0 → 1 over the last act
    const orbit = -0.55 + (reduceMotion ? 0 : Math.sin(t * 0.14) * 0.16);
    const r = (11.5 + wide * 14) - low * 5.5;
    const camY = towerY + 4.6 + wide * 8 - low * 4.0;

    if (INSPECT !== null) {
      camPos.set(4.6, INSPECT * FH, 7.4);
      camera.position.lerp(camPos, 0.25);
      target.set(0, INSPECT * FH + 0.3, 0);
      camera.lookAt(target);
    } else {
    // the active card sits on one side, so swing the framing to the other
    const centre0 = scrollY + innerHeight / 2;
    let actSide = 0;
    marks.forEach((m, idx) => { if (centre0 >= m.mid - 200) actSide = idx; });
    const side = (actSide % 2 === 0 ? 1 : -1) * (innerWidth > 900 ? 1 : 0.35);

    camPos.set(Math.sin(orbit) * r + low * 3.0 - side * 3.4 * (1 - low), camY, Math.cos(orbit) * r);
    camera.position.lerp(camPos, 0.055);
    target.set(side * 2.6 * (1 - low) + low * 0.6, towerY + (wide * 6) + 0.2, 0);
    camera.lookAt(target);
    }

    // investigators run their walk on a loop, staggered
    for (let i = 0; i < COUNT; i++) {
      const d = invData[i];
      let u = (t * 0.032 + d.phase) % 1;
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
      const holding = u > 0.44 && u < 0.97;
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
