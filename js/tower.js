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

function boot() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf4f1ea, 26, 92);

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 400);
  camera.position.set(14, 8, 22);
  camera.lookAt(0, 10, 0);

  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x3d4353, 1.05));
  const sun = new THREE.DirectionalLight(0xffe9cc, 1.35);
  sun.position.set(-14, 30, 16);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x9fc6d8, 0.6);
  rim.position.set(18, 12, -18);
  scene.add(rim);

  /* --- tower: 40 floors --- */
  const FLOORS = 40, FH = 0.62, W = 5.6, D = 4.2;
  const tower = new THREE.Group();
  scene.add(tower);

  const floorMat = new THREE.MeshStandardMaterial({ color: 0xe6e0d2, roughness: .82, metalness: .04 });
  const encMat   = new THREE.MeshStandardMaterial({ color: 0xd9c9a8, roughness: .85, metalness: .03 });
  const decMat   = new THREE.MeshStandardMaterial({ color: 0xdfe6e6, roughness: .8,  metalness: .05 });
  const seamMat  = new THREE.MeshStandardMaterial({ color: 0xc8553d, roughness: .5,  metalness: .2, emissive: 0x3a1008, emissiveIntensity: .5 });

  const slabGeo = new THREE.BoxGeometry(W, FH * 0.16, D);
  const bodyGeo = new THREE.BoxGeometry(W * 0.94, FH * 0.84, D * 0.94);

  const floors = [];
  for (let i = 0; i < FLOORS; i++) {
    const y = i * FH;
    const isSeam = i === 20;
    const slab = new THREE.Mesh(slabGeo, isSeam ? seamMat : floorMat);
    slab.position.y = y;
    const body = new THREE.Mesh(bodyGeo, i < 20 ? encMat : decMat);
    body.position.y = y + FH * 0.5;
    tower.add(slab, body);
    floors.push({ y, body, slab });
  }

  /* --- investigators: one per "token", riding up --- */
  const COUNT = 220;
  const invGeo = new THREE.SphereGeometry(0.075, 7, 6);
  const invMat = new THREE.MeshStandardMaterial({ color: 0x1f4e5f, roughness: .4, metalness: .15 });
  const investigators = new THREE.InstancedMesh(invGeo, invMat, COUNT);
  tower.add(investigators);
  const invData = Array.from({ length: COUNT }, (_, i) => ({
    lane: i % 4,
    phase: Math.random(),
    speed: 0.06 + Math.random() * 0.05,
    seed: Math.random() * 100,
  }));

  /* --- archive: one ZIP per investigator, stacking in the shaft --- */
  const zipGeo = new THREE.BoxGeometry(0.11, 0.05, 0.11);
  const zipMat = new THREE.MeshStandardMaterial({ color: 0xc8553d, roughness: .45, metalness: .25 });
  const zips = new THREE.InstancedMesh(zipGeo, zipMat, 140);
  tower.add(zips);

  const dummy = new THREE.Object3D();
  const clock = new THREE.Clock();

  function layoutCards() {
    // pin each act to a camera height
    const tops = acts.map((a, i) => {
      const el = document.getElementById(a.id);
      const r = el.getBoundingClientRect();
      return { i, mid: r.top + scrollY + r.height / 2 };
    });
    return tops;
  }

  let marks = layoutCards();
  addEventListener("resize", () => {
    marks = layoutCards();
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  });

  const target = new THREE.Vector3(0, 10, 0);
  const camPos = new THREE.Vector3(14, 8, 22);

  function frame() {
    const t = clock.getElapsedTime();
    const maxScroll = Math.max(1, document.body.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / maxScroll));

    // camera climbs the tower with the page
    const towerH = FLOORS * FH;
    const wantY = 1.5 + p * (towerH - 2);
    const orbit = reduceMotion ? 0 : Math.sin(t * 0.16) * 0.35;
    const r = 21 - p * 5;

    camPos.set(Math.sin(orbit) * r, wantY + 4.5, Math.cos(orbit) * r);
    camera.position.lerp(camPos, 0.06);
    target.set(0, wantY + 1.2, 0);
    camera.lookAt(target);

    const { tx = 0, ty = 0, tz = 0 } = {};
    // investigators ride up four lanes
    for (let i = 0; i < COUNT; i++) {
      const d = invData[i];
      const h = ((t * d.speed + d.phase) % 1);
      const floorReached = h * towerH;
      const laneX = (d.lane - 1.5) * (W * 0.17);
      const wobble = reduceMotion ? 0 : Math.sin(t * 0.8 + d.seed) * 0.05;
      dummy.position.set(laneX + wobble, floorReached + FH * 0.4, D * 0.42);
      const arriving = 0.7 + 0.5 * Math.sin(t + d.seed);
      dummy.scale.setScalar(0.85 + arriving * 0.25);
      dummy.updateMatrix();
      investigators.setMatrixAt(i, dummy.matrix);
    }
    investigators.instanceMatrix.needsUpdate = true;

    // zips stack in the archive only above floor 0, thinning as they rise (m=2)
    for (let i = 0; i < zips.count; i++) {
      const h = (i / zips.count);
      const y = h * towerH * 0.9;
      const shrink = 1 - h * 0.55;            // cargo gets smaller upward
      const side = i % 2 ? 1 : -1;
      dummy.position.set(side * (W * 0.34), y + 0.3, D * 0.36);
      dummy.scale.set(shrink, shrink, shrink);
      dummy.rotation.set(0, reduceMotion ? 0 : t * 0.05 + i, 0);
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

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
