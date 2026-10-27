import * as THREE from "three";
import { acts } from "./content.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- narrative into the DOM (readable without WebGL) ---------- */
/* **x** marks something you can watch happen on the 3D screen */
const link = (t) =>
  t.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>');
const bold = (t) => link(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
const main = document.getElementById("acts");
acts.forEach((a, i) => {
  const sec = document.createElement("section");
  sec.className = "act";
  sec.id = a.id;
  sec.dataset.index = String(i);
  sec.innerHTML = `
    <div class="card">
      <p class="eyebrow">${a.eyebrow}</p>
      <h2>${a.title}</h2>
      ${a.story.map((p) => `<p>${bold(p)}</p>`).join("")}
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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(innerWidth, innerHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf4f1ea, 34, 130);

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 400);
  camera.position.set(12, 3, 24);

  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x2c3240, 1.15));
  const sun = new THREE.DirectionalLight(0xffe9cc, 1.55);
  sun.position.set(-16, 34, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -22; sun.shadow.camera.right = 22;
  sun.shadow.camera.top = 22; sun.shadow.camera.bottom = -22;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 90;
  sun.shadow.normalBias = 0.02;
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

  const slabThick = FH * 0.14;
  const backGeo = new THREE.BoxGeometry(W * 0.98, FH * 0.86, 0.08);
  const sideGeo = new THREE.BoxGeometry(0.09, FH * 0.86, D * 0.98);
  const deskGeo = new THREE.BoxGeometry(W * 0.52, FH * 0.22, 0.34);

  /* --- four elevator shafts, cut through every slab ---
     The shaft opening is a real hole in each floor, not a bar passing through
     concrete: a slab is laid as front strip, back strip, and fillers either side
     of each shaft. That is what makes the building read as a building. */
  const SHAFT_X = [-0.75, 0.15, 1.05, 1.95];
  const SHAFT_Z = -D * 0.22;
  const SHAFT_W = 0.34;                 // half-width of a shaft opening
  const SHAFT_HOLE = 0.52;              // half-depth of the opening
  const HOLES = SHAFT_X.map((x) => [x - SHAFT_W, x + SHAFT_W]);

  /* the strips that make up one floor slab, as [x0, x1, z0, z1] in local space */
  const SLAB_STRIPS = (() => {
    const zFront = SHAFT_Z + SHAFT_HOLE, zBack = SHAFT_Z - SHAFT_HOLE;
    const out = [
      [-W / 2, W / 2, zFront, D / 2],           // the room side of the slab
      [-W / 2, W / 2, -D / 2, zBack],           // behind the shafts
    ];
    let cursor = -W / 2;
    for (const [a, b] of HOLES) { out.push([cursor, a, zBack, zFront]); cursor = b; }
    out.push([cursor, W / 2, zBack, zFront]);
    return out;
  })();

  const slabUnit = new THREE.BoxGeometry(1, 1, 1);
  const slabInst = new THREE.InstancedMesh(slabUnit, floorMat, SLAB_STRIPS.length * FLOORS);
  const seamInst = new THREE.InstancedMesh(slabUnit, seamMat, SLAB_STRIPS.length);
  {
    const fit = new THREE.Object3D();
    let si = 0, mi = 0;
    for (let i = 0; i < FLOORS; i++) {
      const y = i * FH;
      for (const [x0, x1, z0, z1] of SLAB_STRIPS) {
        fit.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
        fit.rotation.set(0, 0, 0);
        fit.scale.set(x1 - x0, slabThick, z1 - z0);
        fit.updateMatrix();
        if (i === 20) seamInst.setMatrixAt(mi++, fit.matrix);
        else slabInst.setMatrixAt(si++, fit.matrix);
      }
    }
    // hide the unused tail of the instanced buffer
    fit.scale.set(0.001, 0.001, 0.001); fit.updateMatrix();
    for (; si < slabInst.count; si++) slabInst.setMatrixAt(si, fit.matrix);
    tower.add(slabInst, seamInst);
  }

  for (let i = 0; i < FLOORS; i++) {
    const y = i * FH;
    const isSeam = i === 20;
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
    tower.add(back, left, right, bench);
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

  /* --- special floors: the two locker storeys and the Archive --- */
  const LOCKER_FLOORS = [2, 15];
  const ARCHIVE_FLOOR = 18;
  const lockerMat = new THREE.MeshStandardMaterial({
    color: 0x35424a, roughness: .35, metalness: .55,
    emissive: 0x16343a, emissiveIntensity: .25,
  });
  const narrowMat = new THREE.MeshStandardMaterial({ color: 0x8f9aa0, roughness: .55, metalness: .3 });
  const lockerBox = new THREE.BoxGeometry(0.24, 0.42, 0.07);
  const lockerNote = new THREE.BoxGeometry(0.16, 0.28, 0.012);
  const noteMat = new THREE.MeshStandardMaterial({ color: 0xe8b06a, emissive: 0xffb066, emissiveIntensity: .9, roughness: .4 });
  const lockers = new THREE.InstancedMesh(lockerBox, lockerMat, LOCKER_FLOORS.length * 12);
  const notes = new THREE.InstancedMesh(lockerNote, noteMat, LOCKER_FLOORS.length * 12);
  tower.add(lockers, notes);

  /* the archive: deep banks of drawers, each one holding the envelopes */
  const drawerMat = new THREE.MeshStandardMaterial({ color: 0xa98f6b, roughness: .8, metalness: .05 });
  const drawerGeo = new THREE.BoxGeometry(0.26, 0.13, 0.18);
  const envGeo = new THREE.BoxGeometry(0.15, 0.1, 0.014);
  const envMat = new THREE.MeshStandardMaterial({ color: 0xd9c8a8, roughness: .85 });
  const drawers = new THREE.InstancedMesh(drawerGeo, drawerMat, 48);
  const envelopes = new THREE.InstancedMesh(envGeo, envMat, 24);
  tower.add(drawers, envelopes);

  {
    const fit = new THREE.Object3D();
    let li = 0;
    LOCKER_FLOORS.forEach((fl) => {
      const deck = fl * FH + FH * 0.07;
      // one long bank of lockers right at the open front, so nothing hides it
      for (let k = 0; k < 12; k++) {
        const x = -W * 0.44 + k * 0.26;
        const z = -D * 0.08;
        fit.position.set(x, deck + 0.21, z);
        fit.rotation.set(0, 0, 0);
        fit.scale.setScalar(1); fit.updateMatrix();
        lockers.setMatrixAt(li, fit.matrix);
        // half of them have a lit note stuck to the door
        fit.position.set(x, deck + 0.22, z + 0.045);
        fit.scale.setScalar(k % 2 === 0 ? 1 : 0.001);
        fit.updateMatrix();
        notes.setMatrixAt(li, fit.matrix);
        li++;
      }
    });
    // drawers + envelopes on the Archive floor
    const deck18 = ARCHIVE_FLOOR * FH + FH * 0.07;
    let di = 0, ei = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        const x = -W * 0.46 + col * 0.21;
        const y = deck18 + 0.075 + row * 0.125;
        fit.position.set(x, y, -D * 0.38);
        fit.rotation.set(0, 0, 0); fit.scale.setScalar(1); fit.updateMatrix();
        drawers.setMatrixAt(di++, fit.matrix);
        if ((row + col) % 4 === 0 && ei < 24) {
          fit.position.set(x, y + 0.02, -D * 0.38 + 0.10);
          fit.rotation.set(-0.5, 0, 0); fit.updateMatrix();
          envelopes.setMatrixAt(ei++, fit.matrix);
        }
      }
    }
    for (; ei < 24; ei++) {
      fit.position.set(0, -50, 0); fit.scale.setScalar(0.001); fit.updateMatrix();
      envelopes.setMatrixAt(ei, fit.matrix);
    }
  }

  /* the archive wall says what it is, from inside the room */
  {
    const a18 = ARCHIVE_FLOOR * FH + FH * 0.07;
    const sArc = sign("ARCHIVE", 1.05, 0.26, "#c8553d");
    sArc.position.set(-W * 0.06, a18 + 0.50, -D * 0.46);
    tower.add(sArc);
    // brass label plates on a few drawers, so the bank reads as furniture
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xf0e5cf, roughness: .5 });
    for (let k = 0; k < 12; k += 2) {
      const pl = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.022, 0.01), plateMat);
      pl.position.set(-W * 0.46 + k * 0.21, a18 + 0.14, -D * 0.38 + 0.092);
      tower.add(pl);
    }
  }

  /* a highlight band around each highlighted floor, brightened while its act is on */
  const HILITE = { 2: "engram", 15: "engram", 18: "archive", 20: "blockade", 39: "roof" };
  const bands = Object.keys(HILITE).map((k) => {
    const fl = Number(k);
    const mat = new THREE.MeshBasicMaterial({ color: 0xc8553d, transparent: true, opacity: 0.12 });
    const band = new THREE.Mesh(new THREE.BoxGeometry(W * 1.02, 0.03, D * 1.02), mat);
    band.position.set(0, fl * FH + FH * 0.07, 0);
    // a soft coloured haze that lives inside the storey, so the whole floor lights up
    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.98, FH * 0.7, D * 0.98),
      new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.0, depthWrite: false })
    );
    glow.position.set(0, fl * FH + FH * 0.5, 0);
    tower.add(band, glow);
    return { fl, mat, glow: glow.material, act: HILITE[k] };
  });

  /* name the special floors on the building itself */
  const flSign = (text, fl, ink) => {
    const pl = sign(text, 1.15, 0.26, ink);
    pl.position.set(W * 0.5 + 0.03, fl * FH + FH * 0.45, -D * 0.1);
    pl.rotation.y = Math.PI / 2;
    tower.add(pl);
  };
  LOCKER_FLOORS.concat([ARCHIVE_FLOOR]).forEach((fl) => {
    const glow = new THREE.PointLight(0xffc98a, 1.4, 9, 2);
    glow.position.set(0, fl * FH + FH * 0.55, D * 0.22);
    tower.add(glow);
  });
  flSign("LOCKERS", 2, "#2b6a72");
  flSign("LOCKERS", 15, "#2b6a72");
  flSign("ARCHIVE", 18, "#c8553d");
  flSign("ELEVATORS", 0, "#1f4e5f");

  /* floor numbers on the left flank, every fifth storey, so the climb is legible */
  for (let i = 5; i <= FLOORS; i += 5) {
    const plaque = sign(String(i), 0.5, 0.26, "#5a5344");
    plaque.position.set(-W * 0.5 - 0.02, i * FH + FH * 0.45, D * 0.42);
    plaque.rotation.y = -Math.PI / 2;
    tower.add(plaque);
  }

  const furn = new THREE.Object3D();
  const DECK = FH * 0.07;                 // top surface of a slab
  // acts 8 / 14 / 21 fix up their own furniture, so skip the generic rows there
  const STAGED = new Set([8, 14, 21]);
  for (let i = 0; i < FLOORS; i++) {
    if (STAGED.has(i)) continue;
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
  for (let i = 1; i < FLOORS; i += 2) {
    const lamp = new THREE.PointLight(0xffeed6, 0.7, 17, 2);
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

  const Y0 = FH * 0.07;                  // floor-0 slab top, so nothing floats
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
  /* (SHAFT_X, SHAFT_Z and the opening are declared above, with the slabs) */
  const shaftMat = new THREE.MeshStandardMaterial({ color: 0xb9b2a2, roughness: .8, metalness: .1 });
  /* rail segments run storey by storey, between the slabs — no bars sawing through floors */
  {
    const segH = FH * 0.86;
    const railGeo = new THREE.BoxGeometry(0.085, segH, 0.085);
    const railInst = new THREE.InstancedMesh(railGeo, shaftMat, SHAFT_X.length * 2 * FLOORS);
    const fit = new THREE.Object3D();
    let ri = 0;
    SHAFT_X.forEach((x) => {
      for (const sx of [-0.34, 0.34]) {
        for (let i = 0; i < FLOORS; i++) {
          fit.position.set(x + sx, i * FH + FH * 0.5, SHAFT_Z);
          fit.rotation.set(0, 0, 0); fit.scale.setScalar(1); fit.updateMatrix();
          railInst.setMatrixAt(ri++, fit.matrix);
        }
      }
    });
    tower.add(railInst);
  }
  /* A cabin is a frame, not a solid: floor, roof and three thin posts, with the
     front left completely open. That open front is the whole point — through it you
     can see who is riding, which is what the story is about. */
  const cabMat = new THREE.MeshStandardMaterial({
    color: 0xf4e9d2, roughness: .35, metalness: .25,
    emissive: 0xffcf85, emissiveIntensity: .45,
  });
  const cabGlass = new THREE.MeshStandardMaterial({
    color: 0xdff0f4, roughness: .1, metalness: .05, transparent: true,
    opacity: .18, emissive: 0x9ed3de, emissiveIntensity: .35,
  });
  /* one cabin per shaft — nothing rides outside a shaft, nothing parked in a lobby */
  const cabLamp = new THREE.MeshStandardMaterial({
    color: 0xfff3d8, roughness: .3, metalness: .2,
    emissive: 0xffcf85, emissiveIntensity: 1.15,
  });
  const cabs = SHAFT_X.map((x, idx) => {
    const cab = new THREE.Group();
    cab.position.set(x, Y0 + 0.02, SHAFT_Z);
    const halfW = SHAFT_W - 0.03, halfD = SHAFT_HOLE - 0.04, h = FH * 0.78;
    // floor and roof plates
    const plate = new THREE.BoxGeometry(halfW * 2, 0.035, halfD * 2);
    const floorPl = new THREE.Mesh(plate, cabMat); floorPl.position.y = 0;
    const roofPl = new THREE.Mesh(plate, cabMat); roofPl.position.y = h;
    cab.add(floorPl, roofPl);
    // a lit panel in the roof, so the cabin glows and throws light on its riders
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(halfW * 1.5, 0.02, halfD * 1.5), cabLamp);
    lamp.position.y = h - 0.02;
    cab.add(lamp);
    // three corner posts, the fourth left open at the front
    for (const [px, pz] of [[-halfW, -halfD], [halfW, -halfD], [halfW, halfD], [-halfW, halfD]]) {
      if (px < 0 && pz > 0) continue;             // the open front-left corner
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.028, h, 0.028), cabMat);
      post.position.set(px, h / 2, pz);
      cab.add(post);
    }
    // a glass side and back, so the ride is legible from outside without hiding it
    const back = new THREE.Mesh(new THREE.BoxGeometry(halfW * 2, h * 0.92, 0.02), cabGlass);
    back.position.set(0, h * 0.5, -halfD);
    const leftSide = new THREE.Mesh(new THREE.BoxGeometry(0.02, h * 0.92, halfD * 2), cabGlass);
    leftSide.position.set(-halfW, h * 0.5, 0);
    cab.add(back, leftSide);
    tower.add(cab);
    // a lintel over each opening so you can read the shaft as a doorway, not a hole
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(SHAFT_W * 2 + 0.16, 0.06, 0.05), cabLamp);
    lintel.position.set(x, Y0 + 0.56, SHAFT_Z + SHAFT_HOLE + 0.03);
    tower.add(lintel);
    // a lit back wall for every shaft, so all four read at a glance from the lobby
    const shaftBack = new THREE.Mesh(
      new THREE.BoxGeometry(SHAFT_W * 2 - 0.02, FH * 0.82, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x2b4a55, roughness: .8,
        emissive: 0x1f4e5f, emissiveIntensity: .55 })
    );
    shaftBack.position.set(x, Y0 + FH * 0.45, SHAFT_Z - SHAFT_HOLE + 0.02);
    tower.add(shaftBack);
    // and a number plate above each, 1 to 4, so the "four elevators" line is legible
    const numPlate = sign(String(idx + 1), 0.2, 0.2, "#c8553d");
    numPlate.position.set(x, Y0 + 0.68, SHAFT_Z + SHAFT_HOLE + 0.02);
    tower.add(numPlate);
    return cab;
  });

  const sLift = sign("ELEVATORS", 1.4, 0.34, "#1f4e5f");
  sLift.position.set(1.85, Y0 + 0.95, SHAFT_Z + 0.14);
  tower.add(sLift);

  /* --- investigators: capsule body + head, one pair per token --- */
  /* eighteen Investigators — exactly the crowd the story counts:
     Expand · Humanity · 's · Productivity · by · Collapsing · the · Distance ·
     Between · Idea · and · Impact · . · What · is · Ninja · Tech · ? */
  const COUNT = 18;
  const bodyGeo = new THREE.CapsuleGeometry(0.04, 0.078, 3, 7);
  const headGeo = new THREE.SphereGeometry(0.036, 8, 6);
  const skinMat = new THREE.MeshStandardMaterial({ color: 0x1f4e5f, roughness: .45, metalness: .12 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0xe8b98f, roughness: .7, metalness: .02 });
  const bodies = new THREE.InstancedMesh(bodyGeo, skinMat, COUNT);
  const heads = new THREE.InstancedMesh(headGeo, headMat, COUNT);
  const dossierGeo = new THREE.BoxGeometry(0.15, 0.016, 0.105);
  const dossierMat = new THREE.MeshStandardMaterial({ color: 0xc8553d, roughness: .5, metalness: .15 });
  const dossiers = new THREE.InstancedMesh(dossierGeo, dossierMat, COUNT);
  /* instance matrices move these all over the tower, but InstancedMesh computes its
     bounding sphere once, at the origin — so without this the whole crowd is culled
     as soon as the cars climb and the riders vanish from the frame */
  bodies.frustumCulled = false;
  heads.frustumCulled = false;
  dossiers.frustumCulled = false;
  tower.add(bodies, heads, dossiers);

  /* the eighteen tokens, in the order the prompt splits into them */
  const TOKENS = ["Expand", "Humanity", "'s", "Productivity", "by", "Collapsing",
                  "the", "Distance", "Between", "Idea", "and", "Impact", ".",
                  "What", "is", "Ninja", "Tech", "?"];

  const invData = Array.from({ length: COUNT }, (_, i) => ({
    lane: i % 4,
    row: Math.floor(i / 4),
    berth: Math.floor(i / 4),              // their place inside the cabin
    /* a crew of four boards one lane together and rides together, so every cabin
       is full of the people the story counts — and nobody is ever in mid-air */
    /* four crews, one per shaft, riding almost together: four cabins rise at once,
       each one full */
    phase: (i % 4) * 0.05 + Math.floor(i / 4) * 0.006,
    slot: Math.floor(i / 4) % 9,
    seed: Math.random() * 100,
  }));

  /* the clinic's visitors, driven by the reader's progress through Act V */
  let CLINIC_VISITORS = [];

  /* one small name tag above every Investigator, so you can read who is who */
  const tags = TOKENS.map((tok) => {
    const t = sign(tok, Math.max(0.34, tok.length * 0.075), 0.135, "#1f4e5f");
    t.renderOrder = 4;
    tower.add(t);
    return t;
  });

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
  /* staff at work in the rooms the story visits, so no room is ever empty:
     people filing in the Archive, specialists at the Clinic, the panel at the
     conference table, readers in the library, the crowd on the roof */
  {
    const near = (fl) => fl * FH + FH * 0.07;
    const workers = [
      // the Archive: two clerks pulling drawers, one carrying an envelope
      [ARCHIVE_FLOOR, -W * 0.30, -D * 0.30, 0x2f6b7a],
      [ARCHIVE_FLOOR, -W * 0.12, -D * 0.32, 0x2f6b7a],
      [ARCHIVE_FLOOR,  W * 0.04, -D * 0.22, 0x8c3f2c],
      [ARCHIVE_FLOOR,  W * 0.20, -D * 0.34, 0x2f6b7a],
      // the Clinic: a GP and two specialists in their booths
      [14, W * 0.16, D * 0.10, 0x8c3f2c],
      [14, -W * 0.26, D * 0.02, 0x2f6b7a],
      [14, -W * 0.10, D * 0.04, 0x6a5a8c],
      // the conference floor: heads of department around the table
      [8, -W * 0.20, -D * 0.12 + 0.42, 0x2f6b7a],
      [8,  W * 0.16, -D * 0.12 - 0.42, 0x6a5a8c],
      [8,  W * 0.02, -D * 0.12 + 0.42, 0x8c3f2c],
      // the reading room
      [21, -W * 0.22, D * 0.04, 0x2f6b7a],
      [21,  W * 0.20, D * 0.02, 0x6a5a8c],
      // Engram: the register desks
      [15, -W * 0.28, D * 0.00, 0x8c3f2c],
      [15,  W * 0.24, D * 0.02, 0x2f6b7a],
    ];
    for (const [fl, x, z, c] of workers) tower.add(person(x, z, near(fl), c));
  }
  tower.add(person(DESK_X, DESK_Z - 0.6, Y0, 0x8c3f2c));
  /* two sorters behind the mailroom table — the staff doing the slicing */
  tower.add(person(MAIL_X - 0.42, MAIL_Z - 0.4, Y0, 0x8c3f2c));
  tower.add(person(MAIL_X + 0.42, MAIL_Z - 0.4, Y0, 0x8c3f2c));

  /* --- the three working floors that need their own furniture --- */
  const micMat2 = new THREE.MeshStandardMaterial({ color: 0x2f3a44, roughness: .35, metalness: .55 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x7c8a90, roughness: .75 });
  {
    // floor 8: the conference room — a long table, 64 microphones overhead
    const deck = 8 * FH + FH * 0.07;
    const table = new THREE.Mesh(new THREE.BoxGeometry(W * 0.62, 0.13, 0.42), woodMat);
    table.position.set(0, deck + 0.07, -D * 0.12);
    tower.add(table);
    for (let k = 0; k < 14; k++) {
      const x = -W * 0.28 + k * (W * 0.048);
      const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.13, 6), micMat2);
      mic.position.set(x, deck + 0.34, -D * 0.12);
      tower.add(mic);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.1, 0.13), seatMat);
      seat.position.set(x, deck + 0.05, -D * 0.12 + 0.34);
      tower.add(seat);
    }
    // a ring of microphones hanging from the ceiling
    for (let k = 0; k < 8; k++) {
      const mic = new THREE.Mesh(new THREE.SphereGeometry(0.026, 6, 5), micMat2);
      mic.position.set(-W * 0.3 + k * (W * 0.086), deck + 0.48, D * 0.06);
      tower.add(mic);
    }

    /* floor 14: the clinic.
       Laid out so the whole visit is legible from the lobby end: the GP's desk
       sits front and centre with the GP behind it, the nurse stands at the door
       to the left, and six specialist booths line the back wall, numbered, each
       with a specialist behind its counter. */
    const cd = 14 * FH + FH * 0.07;
    const gpX = 0.0, gpZ = 1.05;
    const gpDesk = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.13, 0.38), woodMat);
    gpDesk.position.set(gpX, cd + 0.19, gpZ);
    tower.add(gpDesk);
    const gpTop = new THREE.MeshStandardMaterial({ color: 0x6b4a30, roughness: .7 });
    const gpLeg = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: .9 });
    for (const [lx, lz] of [[-0.34,-0.16],[-0.34,0.16],[0.34,-0.16],[0.34,0.16]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.04), gpLeg);
      leg.position.set(gpX + lx, cd + 0.09, gpZ + lz);
      tower.add(leg);
    }
    const gpBlotter = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.012, 0.15), gpTop);
    gpBlotter.position.set(gpX, cd + 0.256, gpZ);
    tower.add(gpBlotter);
    /* the GP stands at the END of the desk, in profile, with nothing in front of
       them — put them behind it and a storey-height desk hides them entirely */
    const gpPerson = person(gpX - 0.52, gpZ + 0.04, cd, 0x8c3f2c);
    gpPerson.scale.setScalar(1.5);
    tower.add(gpPerson);
    const sGP = sign("GENERAL PRACTITIONER", 1.5, 0.24, "#c8553d");
    sGP.position.set(gpX, cd + 0.56, gpZ + 0.16);
    tower.add(sGP);
    const sEvery = sign("everyone", 0.5, 0.15, "#1f4e5f");
    sEvery.position.set(gpX, cd + 0.42, gpZ + 0.16);
    tower.add(sEvery);

    /* six specialist booths along the back wall, each numbered, each staffed */
    const boothMat = new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: .8 });
    const boothTopMat = new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: .6 });
    const boothLit = new THREE.MeshStandardMaterial({
      color: 0xfff3d8, roughness: .4, emissive: 0xffb347, emissiveIntensity: .5 });
    const BOOTH_X = [];
    for (let k = 0; k < 6; k++) {
      const bx = -1.28 + k * 0.512;
      BOOTH_X.push(bx);
      // a back panel that catches the light, so each booth reads as a separate window
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.34, 0.03), boothLit);
      back.position.set(bx, cd + 0.19, -D * 0.42);
      // the counter you stand at
      const counter = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 0.18), boothTopMat);
      counter.position.set(bx, cd + 0.055, -D * 0.30);
      // dividers between booths
      const divL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.30, 0.30), boothMat);
      divL.position.set(bx - 0.235, cd + 0.15, -D * 0.34);
      tower.add(back, counter, divL);
      // the specialist, behind their counter
      tower.add(person(bx, -D * 0.38, cd, 0x2f6b7a));
      // and the number, so the six are countable
      const num = sign(String(k + 1), 0.16, 0.16, "#c8553d");
      num.position.set(bx, cd + 0.40, -D * 0.30);
      tower.add(num);
    }
    const sSpec = sign("SIX SPECIALISTS", 1.05, 0.24, "#1f4e5f");
    sSpec.position.set(0.0, cd + 0.46, -D * 0.30);
    tower.add(sSpec);
    /* the triage nurse, at the door, holding the clipboard the visit is decided on */
    const nurse = person(-W * 0.34, D * 0.26, cd, 0x6a5a8c);
    nurse.scale.setScalar(1.15);
    tower.add(nurse);
    const sNurse = sign("TRIAGE", 0.62, 0.19, "#c8553d");
    sNurse.position.set(-W * 0.34, cd + 0.42, D * 0.26);
    tower.add(sNurse);
    /* this floor's visitors, animated below: the door, the GP, then their booth */
    /* the queue is a real queue: everyone lines up on the same strip of floor,
       waits, is seen by the GP one at a time, then walks to their own booth */
    const QUEUE_Z = D * 0.30;
    const CLINIC_PATH = [
      [-W * 0.34, D * 0.82],    // in at the door, past triage
      [-W * 0.18, QUEUE_Z + 0.62], // join the back of the queue
      [0.66, QUEUE_Z],           // shuffle forward, one place at a time
      [gpX + 0.55, QUEUE_Z],     // at the GP's desk
      [gpX + 0.55, gpZ + 0.42],  // seen
      [0.20, QUEUE_Z - 0.10],    // out of the line
    ];
    CLINIC_VISITORS = BOOTH_X.map((bx, k) => {
      const g = person(0, 0, cd, k % 2 ? 0x2f6b7a : 0x8c3f2c);
      g.scale.setScalar(1.35);
      tower.add(g);
      return { g, path: [...CLINIC_PATH, [bx, -D * 0.24]] };
    });

    // floor 21: the reading room — the local desk, then the library stacks
    const rd = 21 * FH + FH * 0.07;
    const local = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.13, 0.36), woodMat);
    local.position.set(W * 0.16, rd + 0.07, D * 0.10);
    tower.add(local);
    const sLocal = sign("LOCAL", 0.58, 0.3, "#1f4e5f");
    sLocal.position.set(W * 0.16, rd + 0.30, D * 0.10);
    tower.add(sLocal);
    /* library stacks: bookcases with rows of coloured spines */
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x8a7a5e, roughness: .85 });
    const spineColours = [0xc8553d, 0x2b6a72, 0xd9b26a, 0x4a5b7a];
    for (let r = 0; r < 2; r++) {
      for (let k = 0; k < 4; k++) {
        const sx = -W * 0.26 + k * 0.34;
        const sz = -D * 0.20 + r * 0.30;
        const case_ = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.16), shelfMat);
        case_.position.set(sx, rd + 0.2, sz);
        tower.add(case_);
      }
    }
    spineColours.forEach((c, ci) => {
      const spineMat = new THREE.MeshStandardMaterial({ color: c, roughness: .8 });
      for (let r = 0; r < 2; r++) {
        for (let k = 0; k < 4; k++) {
          const sx = -W * 0.26 + k * 0.34;
          const sz = -D * 0.20 + r * 0.30;
          const spines = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.055, 0.02), spineMat);
          spines.position.set(sx, rd + 0.12 + ci * 0.075, sz + 0.09);
          tower.add(spines);
        }
      }
    });
    const sLib = sign("LIBRARY", 0.86, 0.3, "#c8553d");
    sLib.position.set(W * 0.02, rd + 0.44, -D * 0.34);
    tower.add(sLib);
  }

  /* --- the roof: a press conference, a one-way mirror, an intern's desk --- */
  {
    const deck = 39 * FH + FH * 0.07;
    const podium = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.34, 0.42), woodMat);
    podium.position.set(0, deck + 0.17, -D * 0.24);
    tower.add(podium);
    const sPodium = sign("PRESS", 0.75, 0.19, "#c8553d");
    sPodium.position.set(0, deck + 0.34, -D * 0.24 + 0.23);
    tower.add(sPodium);

    // a row of microphones on the podium
    const micMat = new THREE.MeshStandardMaterial({ color: 0x2f3a44, roughness: .4, metalness: .5 });
    for (let k = 0; k < 5; k++) {
      const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 6), micMat);
      mic.position.set(-0.3 + k * 0.15, deck + 0.42, -D * 0.24);
      tower.add(mic);
    }
    // the one-way mirror along the back wall
    const mirror = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.7, FH * 0.52, 0.03),
      new THREE.MeshStandardMaterial({
        color: 0x8fa6b0, roughness: .05, metalness: .95,
        emissive: 0x2b4a55, emissiveIntensity: .3,
      })
    );
    mirror.position.set(0, deck + 0.30, -D * 0.47);
    tower.add(mirror);
    // the intern's desk to one side, with five draft cards on it
    const intern = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.36), woodMat);
    intern.position.set(W * 0.28, deck + 0.15, D * 0.1);
    tower.add(intern);
    const sWin = sign("NinjaTech", 1.9, 0.46, "#c8553d");
    sWin.position.set(0, deck + 0.92, -D * 0.44);
    tower.add(sWin);
    const draftMat = new THREE.MeshStandardMaterial({ color: 0xc9bfa8, roughness: .85 });
    const winMat = new THREE.MeshStandardMaterial({
      color: 0xfff3d8, roughness: .4, emissive: 0xffb347, emissiveIntensity: .55 });
    for (let k = 0; k < 5; k++) {
      const card = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.008, 0.13),
        k === 2 ? winMat : draftMat);
      card.position.set(W * 0.28 - 0.16 + k * 0.08, deck + 0.31, D * 0.1);
      card.rotation.y = (k - 2) * 0.1;
      tower.add(card);
    }
    tower.add(person(0, -D * 0.28, deck, 0x8c3f2c));      // the speaker at the podium
    tower.add(person(-1.5, D * 0.24, deck, 0x3b5a63));     // reporters
    tower.add(person(-0.9, D * 0.28, deck, 0x3b5a63));
    tower.add(person(1.2, D * 0.26, deck, 0x3b5a63));
    tower.add(person(W * 0.28 - 0.05, D * 0.1 + 0.30, deck, 0x6a5a8c));  // the intern drafting
  }

  const dummy = new THREE.Object3D();
  const clock = new THREE.Clock();

  function layoutCards() {
    return acts.map((a, i) => {
      const el = document.getElementById(a.id);
      const r = el.getBoundingClientRect();
      return { i, mid: r.top + scrollY + r.height / 2, top: r.top + scrollY, bot: r.top + scrollY + r.height };
    });
  }

  let marks = layoutCards();

  /* map scroll position to a fractional floor, interpolating between acts */
  function actState() {
    const centre = scrollY + innerHeight / 2;
    /* the act is the one whose card the reader is actually on: it changes when a
       card's top reaches the middle of the screen, not when its centre does —
       otherwise the shot plays for the act below the one you are reading. */
    let i = 0;
    for (let k = 0; k < marks.length; k++) if (centre >= marks[k].top) i = k;
    const a = acts[i], b = acts[Math.min(i + 1, acts.length - 1)];
    const mk = marks[i];
    const f = Math.min(1, Math.max(0, (centre - mk.top) / Math.max(1, mk.bot - mk.top)));
    if (a === b) return { i, frac: f, floor: a.floor / 40 };
    return { i, frac: f, floor: (a.floor + (b.floor - a.floor) * f) / 40 };
  }
  function actProgress() { return actState().floor; }

  /* Some acts are about one specific thing, so they get their own framing — and
     a few move through the shot as you scroll, in the order the story happens:
     you stand on the street, you walk in, and only then do you see the mailroom. */
  const VIEWS = {
    // fl pins the camera to the act's real floor. at: 0 → 1 is the act's own progress.
    // A storey is only FH (0.62) tall, so eyes sit ~0.40 up and aims ~0.28 up:
    // higher than that and you are looking at the ceiling slab, not the room.
    lobby: { fl: 0, path: [
      /* a storey is only FH (0.62) tall, so the eye must stay under the ceiling:
         any higher and the camera shoots through the slab above and sees beams
         instead of the room. From just inside the door the whole lobby is open. */
      { at: 0.00, eye: [ 5.30, 1.05,  9.20], aim: [ 1.90, 0.46,  3.20] }, // out on the street, facing the entrance
      /* step in past the door posts (they sit at x 1.28 and 2.52, z 3.2) and take
         the far corner: from there the table, the queue and all four shafts are
         in one frame, with nothing in the near field to hide them */
      /* the building is a dollhouse: open at the front. So the reliable vantage is
         OUTSIDE the front, low, looking in — the eye stays under the first ceiling
         and nothing in the near field is between you and the room. */
      { at: 0.35, eye: [ 4.10, 0.44,  6.60], aim: [ 0.60, 0.24,  1.10] },
      { at: 1.00, eye: [ 4.05, 0.42,  6.20], aim: [ 0.35, 0.22,  0.70] },
    ] },
    reception: { fl: 0, path: [
      { at: 0.00, eye: [ 2.90, 0.60,  4.35], aim: [ 0.55, 0.30,  1.35] }, // the queue, waiting its turn
      { at: 0.55, eye: [ 0.70, 0.52,  3.35], aim: [-0.45, 0.28,  1.25] }, // walking them up to the counter
      { at: 1.00, eye: [ 0.20, 0.50,  3.10], aim: [-0.55, 0.30,  1.20] }, // the clipboard changing hands
    ] },
    /* the climb shot rides the car that is actually moving: trackShaft tells the
       camera to follow the highest cabin instead of a fixed height */
    /* the climb shot rides the car in lane 2 that is actually moving: trackShaft
       pins the camera to that cabin's height, so the storeys fly past. */
    /* the climb shot rides whichever car is highest, so through the open fronts you
       watch the same people the card is talking about go up */
    /* the climb shot rides one named car down the whole act. Deterministic: no
       flicker between lanes, and through the open front you always see whoever
       is in that car. */
    elevators: { fl: 0, trackLane: 1, path: [
      /* The camera rides OUTSIDE the open front. It has to: while the cars climb,
         an eye inside the tower passes straight through the floor slabs and spends
         the shot buried in concrete. Out here the four cars are always in clean
         air, level with each other, with people visible through the open fronts. */
      { at: 0.00, eye: [ 0.60, 0.40,  3.55], aim: [ 0.60, 0.28, -0.92] }, // the whole shaft bank
      { at: 0.34, eye: [ 0.60, 0.34,  3.20], aim: [ 0.60, 0.25, -0.92] },
      { at: 1.00, eye: [ 0.60, 0.30,  2.95], aim: [ 0.60, 0.23, -0.92] }, // hold: four cars, side by side
    ] },
    conference: { fl: 8, path: [
      { at: 0.00, eye: [ 0.55, 0.46,  3.45], aim: [ 0.00, 0.26, -0.55] },
      { at: 1.00, eye: [ 0.15, 0.42,  2.15], aim: [-0.10, 0.24, -0.60] }, // push in on the table and its mics
    ] },
    clinic: { fl: 14, path: [
      { at: 0.00, eye: [ 0.30, 0.46,  3.30], aim: [ 0.00, 0.26, -0.50] },
      { at: 1.00, eye: [ 0.10, 0.42,  2.50], aim: [ 0.05, 0.22, -0.55] },
    ] },
    reading: { fl: 21, path: [
      { at: 0.00, eye: [ 0.25, 0.46,  3.20], aim: [ 0.00, 0.26, -0.50] },
      { at: 1.00, eye: [ 0.10, 0.42,  2.40], aim: [ 0.05, 0.22, -0.55] },
    ] },
    lockers: { fl: 15, path: [
      { at: 0.00, eye: [ 0.10, 0.44,  3.60], aim: [ 0.00, 0.26, -0.35] },
      { at: 1.00, eye: [ 0.00, 0.40,  3.10], aim: [ 0.00, 0.24, -0.40] }, // close on the locker doors
    ] },
    archive: { fl: 18, path: [
      { at: 0.00, eye: [ 2.90, 1.55,  5.20], aim: [ 0.00, 0.10, -0.30] }, // the whole storey, and the ones above and below
      { at: 0.30, eye: [ 1.60, 0.85,  2.70], aim: [-0.10, 0.22, -1.20] }, // the wall of drawers, at eye height
      { at: 1.00, eye: [ 0.45, 0.42,  1.15], aim: [-0.25, 0.24, -1.55] }, // in on the envelopes being filed
    ] },
    seam: { fl: 20, path: [
      { at: 0.00, eye: [ 3.60, 1.60,  5.60], aim: [ 0.00, 0.06, -0.20] }, // the whole floor, so you know where you stand
      { at: 0.32, eye: [ 2.30, 0.80,  3.40], aim: [ 0.20, 0.18, -0.60] }, // the stained deck, side on
      { at: 1.00, eye: [ 1.35, 0.36,  1.95], aim: [ 0.00, 0.20, -0.55] }, // in on the red seam itself
    ] },
    roof: { fl: 39, path: [
      { at: 0.00, eye: [ 3.35, 0.62,  3.05], aim: [ 0.05, 0.34, -1.35] },
      { at: 1.00, eye: [ 2.45, 0.58,  2.25], aim: [ 0.00, 0.32, -1.50] },
    ] },
  };

  /* the shot for progress f through the act: a gentle glide between waypoints */
  function shotAt(view, f) {
    const p = view.path;
    if (!p) return { eye: view.eye, aim: view.aim };
    let a = p[0], b = p[p.length - 1];
    for (let k = 0; k < p.length - 1; k++) if (f >= p[k].at) { a = p[k]; b = p[k + 1]; }
    const u = Math.min(1, Math.max(0, (f - a.at) / Math.max(1e-4, b.at - a.at)));
    const e = u * u * (3 - 2 * u);          // ease in, ease out — never a hard cut
    const m = (x, y) => x + (y - x) * e;
    return {
      eye: [m(a.eye[0], b.eye[0]), m(a.eye[1], b.eye[1]), m(a.eye[2], b.eye[2])],
      aim: [m(a.aim[0], b.aim[0]), m(a.aim[1], b.aim[1]), m(a.aim[2], b.aim[2])],
    };
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
  /* --- the ride ---
     A cabin holds its place in the lobby until somebody boards, rises with them,
     and slides back down once it is empty. Riders are pinned to the cabin's y, so
     nobody is ever flying: they ride. */
  const ROOF_DECK = 39 * FH + FH * 0.07;
  /* the cars spend most of the cycle in motion: four shafts climbing together is
     what the room is about, so a parked shaft is the exception, not the rule */
  const RIDE_IN = 0.12, RIDE_OUT = 0.74;
  /* --- the building is driven by the reader, not by a clock ---
     The Investigators walk at the speed you scroll. Stop, and the lobby stops.
     Scroll back, and they walk back. A full climb of the tower takes about four
     turns of the page, so the queue is always visibly moving while you read. */
  const SCROLL_TURNS = 4.85;             // trips over the whole page: ends on the roof
  let scrollP = 0;                       // 0..1 down the page, set every frame
  let prevScrollP = 0;
  let travel = 0;                        // accumulated trips, never wraps
  let glide = 0;                         // signed speed of the page, for footfalls

  /* a lane's clock. Up while the crew is aboard, back down once they have stepped
     out. The body's height is read from this, never interpolated on its own, so a
     rider can never drift out of the cabin carrying them. */
  /* act III pins car 2: while the card is on screen its crew is aboard and the car
     climbs with the reader's progress through the act, so the people you are reading
     about are the people in the frame */
  let forced = null;                     // a clock forced by the climb act
  /* All four shafts run on the SAME clock. That is the point of the room: four
     cars rise together, side by side, every time. Offsetting them per lane meant
     you only ever saw one car moving, which read as one elevator, not four. */
  function laneClock() {
    if (forced !== null) return forced;
    const c = travel;
    return ((c % 1) + 1) % 1;
  }
  function cabinYFor(lane) {
    const c = laneClock();
    let f;
    if (c < RIDE_IN) f = 0;
    else if (c <= RIDE_OUT) f = (c - RIDE_IN) / (RIDE_OUT - RIDE_IN);
    else f = 1 - (c - RIDE_OUT) / (1 - RIDE_OUT);
    f = f < 0 ? 0 : f > 1 ? 1 : f;
    return Y0 + (f * f * (3 - 2 * f)) * (ROOF_DECK - Y0);
  }
  /* height is read off the lane clock, not off the walker's own progress, so a
     rider is welded to the cabin floor no matter how they are staggered */
  function yFor(u, lane) {
    const c = laneClock();
    if (c < RIDE_IN) return Y0;              // on a floor
    if (c <= RIDE_OUT) return cabinYFor(lane) + 0.035; // standing on the cabin floor
    return ROOF_DECK;                        // out on the roof deck
  }

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
      [0.10, laneX, Y0, SHAFT_Z + 0.86],    // walk to their shaft
      [RIDE_IN, laneX, Y0, SHAFT_Z + 0.06], // step through the opening
      [RIDE_OUT, laneX, Y0, SHAFT_Z],       // riding: height comes from yFor
      [0.90, laneX, Y0, SHAFT_Z + 0.62],    // step out onto the roof
      [1.00, laneX, Y0, SHAFT_Z + 0.74],
    ];
    let k = 0;
    while (k < pts.length - 2 && u > pts[k + 1][0]) k++;
    const a = pts[k], b = pts[k + 1];
    const span = b[0] - a[0];
    const f = span > 0 ? Math.min(1, Math.max(0, (u - a[0]) / span)) : 0;
    v.set(lerp(a[1], b[1], f), yFor(u, lane), lerp(a[3], b[3], f));
    return v;
  }

  let trackLane = null;                  // which cabin the climb shot is riding
  const veil = document.getElementById("veil");
  const inspectMatch = /[?&]floor=(\d+)/.exec(location.search);
  const INSPECT = inspectMatch ? Number(inspectMatch[1]) : null;
  const target = new THREE.Vector3(0, 2, 0);
  const camPos = new THREE.Vector3(12, 3, 24);

  function frame() {
    const t = clock.getElapsedTime();
    const maxScroll = Math.max(1, document.body.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / maxScroll));
    /* the Investigators are driven by the page, not by a wall clock: scrolling
       moves them, stopping stops them, scrolling back walks them back down */
    scrollP = p;
    const dP = scrollP - prevScrollP;
    prevScrollP = scrollP;
    travel += dP * SCROLL_TURNS;
    glide += (dP * 900 - glide) * 0.25;
    const pace = Math.min(1, Math.abs(glide) * 8);   // 0 at rest, 1 while moving
    const st = actState();
    const af = st.floor;
    const act = acts[st.i];
    const view = VIEWS[act && act.focus];
    /* in the climb act, car 2's crew rides for the whole card, from the lobby to
       the roof, exactly as fast as you scroll through it */
    if (act && act.focus === "elevators") {
      forced = RIDE_IN + 0.02 + st.frac * (RIDE_OUT - RIDE_IN - 0.04);
    } else forced = null;

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
    let aimY = towerY + (wide * 6) + 0.2;
    let aimX = side * 2.6 * (1 - low) + low * 0.6;

    // fully committed while the card is on screen — the shot plays from the top of
    // the card to the bottom of it, then eases back to the wide view between acts
    const c0 = scrollY + innerHeight / 2, mk = marks[st.i];
    const out = c0 < mk.top ? mk.top - c0 : (c0 > mk.bot ? c0 - mk.bot : 0);
    const blend = Math.max(0, Math.min(1, 1 - out / (innerHeight * 0.8)));
    /* between acts the camera pulls back to the whole tower and then pushes in to
       the next room — never a straight cut from one floor to another */
    const away = 1 - blend;
    camPos.set(
      camPos.x * (1 + away * 0.55),
      camPos.y + away * 3.4,
      camPos.z * (1 + away * 0.55),
    );
    if (view) {
      // this act is about one specific thing: get close enough to actually see it
      const shot = shotAt(view, st.frac);
      let vy = view.fl !== undefined ? view.fl * FH : towerY;
      if (view.trackLane !== undefined) {
        /* the camera rides car 2. It goes up as you scroll down and back down as you
           scroll up, so the climb is literally your scroll — and the people in that
           car are in frame the whole way, seen through the open front. */
        vy = Math.min(cabinYFor(0) + 0.10, ROOF_DECK - 1.2);
      }
      camPos.set(
        camPos.x + (shot.eye[0] - camPos.x) * blend,
        camPos.y + (vy + shot.eye[1] - camPos.y) * blend,
        camPos.z + (shot.eye[2] - camPos.z) * blend,
      );
      aimX = aimX + (shot.aim[0] - aimX) * blend;
      aimY = aimY + (vy + shot.aim[1] - aimY) * blend;
      target.set(aimX, aimY, shot.aim[2]);
    } else {
      target.set(aimX, aimY, 0);
    }
    /* ease in, but never lag: the further the camera has to travel, the faster it
       closes the gap, so a jump between floors settles instead of trailing behind */
    const travel = camera.position.distanceTo(camPos);
    /* a shot that rides a moving car must not lag behind it, or the camera slides
       under the cabin floor and you see the underside of the elevator */
    const ease = view && view.trackLane !== undefined
      ? 0.55
      : (view ? Math.min(1, (0.10 + travel * 0.16) * (0.35 + blend * 0.65)) : 0.06);
    camera.position.lerp(camPos, ease);
    camera.lookAt(target);
    window.__cam = { eye: camPos.toArray().map(n => +n.toFixed(2)),
                     aim: target.toArray().map(n => +n.toFixed(2)),
                     real: camera.position.toArray().map(n => +n.toFixed(2)),
                     blend: +blend.toFixed(2), act: act ? act.id : null, frac: +st.frac.toFixed(2) };
    }

    // investigators run their walk on a loop, staggered
    for (let i = 0; i < COUNT; i++) {
      const d = invData[i];
      let u = (laneClock() + d.row * 0.006) % 1;
      const pos = walkPath(u, d.lane);
      const walking = u < RIDE_IN;
      const swing = reduceMotion ? 0 : Math.sin(t * 9 * Math.sign(glide || 1) + d.seed);
      const step = walking * swing * 0.012 * pace;
      const bob = walking ? Math.abs(Math.sin(t * 9 + d.seed)) * 0.012 * pace : 0;

      const lc = laneClock();
      const riding = lc >= RIDE_IN && lc <= RIDE_OUT;
      const bx = pos.x + (riding ? (d.berth - 2) * 0.092 : 0);
      dummy.position.set(bx, pos.y + bob, pos.z + (riding ? -0.02 : 0));
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(riding ? 1.35 : 1);
      dummy.translateY(0.075);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);

      dummy.position.set(bx, pos.y + bob + 0.183, pos.z + (riding ? -0.02 : 0));
      dummy.scale.setScalar(riding ? 1.35 : 1.01);
      dummy.updateMatrix();
      heads.setMatrixAt(i, dummy.matrix);

      // the dossier appears at the counter and is carried up
      const holding = u > 0.44 && u < 0.97;
      dummy.position.set(bx + step, pos.y + bob + 0.11, pos.z + 0.075);
      dummy.rotation.set(0.25, 0, 0);
      dummy.scale.setScalar(holding ? 1 : 0.001);
      dummy.updateMatrix();
      dossiers.setMatrixAt(i, dummy.matrix);
    }
    window.__inv = invData.map((d, i) => {
      const u = (laneClock() + d.row * 0.006) % 1;
      const pos = walkPath(u, d.lane);
      const lc2 = laneClock();
      return { u: +u.toFixed(2), lane: d.lane, y: +pos.y.toFixed(2),
               cab: +cabinYFor(d.lane).toFixed(2),
               riding: lc2 >= RIDE_IN && lc2 <= RIDE_OUT };
    });
    bodies.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
    dossiers.instanceMatrix.needsUpdate = true;

    // name tags follow their Investigator and always face the camera
    for (let i = 0; i < COUNT; i++) {
      const d = invData[i];
      const u = (laneClock() + d.row * 0.006) % 1;
      const pos = walkPath(u, d.lane);
      const lc = laneClock();
      const ridingNow = lc >= RIDE_IN && lc <= RIDE_OUT;
      tags[i].position.set(pos.x + (ridingNow ? (d.berth - 2) * 0.092 : 0),
                           pos.y + 0.335, pos.z);
      tags[i].quaternion.copy(camera.quaternion);
    }

    /* the clinic: while its card is on screen, the day actually runs. Each visitor
       walks the same route — door, triage, GP desk, then their own numbered booth —
       timed off the reader's progress through Act V, so you watch it happen. */
    if (CLINIC_VISITORS) {
      const live = !!act && act.focus === "clinic";
      CLINIC_VISITORS.forEach((v, k) => {
        const pts = v.path;
        /* each visitor is a little ahead of the one before, and the whole clinic is
           driven by how far down the card you are */
        const local = Math.min(1, Math.max(0, st.frac * 1.5 - k * 0.06));
        const seg = local * (pts.length - 1);
        const i0 = Math.min(pts.length - 2, Math.floor(seg));
        const f = seg - i0;
        const a = pts[i0], b = pts[i0 + 1];
        const x = a[0] + (b[0] - a[0]) * f;
        const z = a[1] + (b[1] - a[1]) * f;
        v.g.position.set(x, 14 * FH + FH * 0.07, z);
        v.g.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]);
        v.g.visible = live;
      });
    }

    // cabins ride their shafts on their lane's clock
    cabs.forEach((cab, lane) => { cab.position.y = cabinYFor(lane); });

    // brighten the band on the floor this act is about
    /* the floor being talked about glows, and breathes, so your eye lands on the
       thing the card is describing rather than hunting for it */
    const pulse = reduceMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 2.1);
    bands.forEach((b) => {
      const isOn = act.focus && b.act === act.id && (act.floors || []).includes(b.fl);
      const near = act.focus && b.act === act.id && Math.abs(b.fl - af * 40) < 6;
      b.mat.opacity = isOn ? 0.3 + pulse * 0.35 : (near ? 0.14 : 0.06);
      b.glow.opacity = isOn ? 0.1 + pulse * 0.13 : 0;
    });

    // act entry highlight
    const centre = scrollY + innerHeight / 2;
    let active = 0;
    marks.forEach((m, idx) => { if (centre >= m.mid - 200) active = idx; });
    document.querySelectorAll(".act").forEach((el, idx) => {
      el.classList.toggle("is-active", idx === active);
    });

    if (veil) veil.style.opacity = String(Math.max(0, Math.min(1, 1 - scrollY / (innerHeight * 0.85))));

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
