import * as THREE from "./vendor/three.module.js";

export function initConstructionScene({ hero, grid, track, visual, copy }) {
  const canvas = visual.querySelector("canvas"),
    view = canvas.parentElement;
  const label = visual.querySelector(".construction-stage");
  const count = visual.querySelector(".construction-count");
  const bar = visual.querySelector(".construction-progress span");
  const control = visual.querySelector(".construction-control");
  const hint = visual.querySelector(".construction-hint");
  const mobile = matchMedia("(max-width:700px)"),
    reduced = matchMedia("(prefers-reduced-motion:reduce)");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, mobile.matches ? 1.4 : 1.7),
  );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-7, 7, 6, -6, 0.1, 70);
  camera.position.set(10, 8, 13);
  camera.lookAt(0, 2.05, 0);
  scene.add(new THREE.HemisphereLight(0xfff8eb, 0x969381, 2.4));
  const sun = new THREE.DirectionalLight(0xffecd0, 3.4);
  sun.position.set(-6, 10, 7);
  sun.castShadow = true;
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 10, bottom: -9 });
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.normalBias = 0.025;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xdce7f0, 1.8);
  fill.position.set(6, 5, -5);
  scene.add(fill);
  const model = new THREE.Group();
  model.rotation.y = -0.25;
  scene.add(model);
  const material = (color, roughness = 0.8, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const concrete = material(0xbab7a9, 0.96),
    soil = material(0xd2bda1),
    steel = material(0x655f57, 0.45, 0.6);
  const brick = material(0xb98864),
    plaster = material(0xeee4d3),
    trim = material(0xad5129),
    wood = material(0x845c3c);
  const charcoal = material(0x384447, 0.4, 0.4),
    tile = material(0xaa5633),
    glass = new THREE.MeshStandardMaterial({
      color: 0x8aafb9,
      roughness: 0.16,
      metalness: 0.25,
      transparent: true,
      opacity: 0.6,
    });
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const phases = Array.from({ length: 9 }, () => []);
  function box(parent, w, h, d, x, y, z, mat) {
    const m = new THREE.Mesh(cube, mat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  // Every animated component retains its installed position; no floating structural layers.
  function component(phase, order = 0, kind = "rise") {
    const g = new THREE.Group();
    model.add(g);
    phases[phase].push({ g, order, kind });
    return g;
  }
  function registerBase() {
    phases.flat().forEach((item) => {
      item.base = item.g.position.clone();
    });
  }
  const site = new THREE.Group();
  model.add(site);
  box(site, 7.7, 0.15, 6.3, 0, -0.48, 0, soil);
  const excavation = material(0x9b876c);
  box(site, 6.3, 0.07, 4.95, 0, -0.37, 0, excavation);
  // Stage 1: strip footings, reinforcement cage and foundation pour.
  for (const x of [-2.5, 0, 2.5]) {
    const g = component(0, (x + 2.5) / 20);
    box(g, 0.65, 0.3, 4.5, x, -0.18, 0, concrete);
  }
  for (const z of [-1.95, 1.95]) {
    const g = component(0, 0.1);
    box(g, 5.65, 0.3, 0.6, 0, -0.18, z, concrete);
  }
  const rebar = component(0, 0.12);
  for (let x = -2.5; x <= 2.5; x += 0.32)
    box(rebar, 0.018, 0.018, 4.1, x, 0.012, 0, steel);
  for (let z = -2; z <= 2; z += 0.32)
    box(rebar, 5.25, 0.018, 0.018, 0, 0.035, z, steel);
  const baseSlab = component(0, 0.5);
  box(baseSlab, 5.65, 0.16, 4.5, 0, 0.09, 0, concrete);
  // Two-storey concrete frame: columns are cast before the slab above them.
  const xs = [-2.5, 0, 2.5],
    zs = [-1.95, 1.95];
  for (let floor = 0; floor < 2; floor++) {
    const columnPhase = floor === 0 ? 1 : 3,
      slabPhase = floor === 0 ? 2 : 4;
    const bottom = 0.17 + floor * 2.5;
    for (const [i, x] of xs.entries())
      for (const [j, z] of zs.entries()) {
        const g = component(columnPhase, (i * 2 + j) * 0.05, "grow");
        g.position.y = bottom;
        box(g, 0.25, 2.32, 0.25, x, 1.16, z, concrete);
      }
    for (const z of zs) {
      const g = component(slabPhase, 0.02);
      box(g, 5.45, 0.26, 0.28, 0, bottom + 2.2, z, concrete);
    }
    for (const x of xs) {
      const g = component(slabPhase, 0.05);
      box(g, 0.28, 0.26, 4.18, x, bottom + 2.2, 0, concrete);
    }
    const slab = component(slabPhase, 0.2);
    box(slab, 5.65, 0.18, 4.5, 0, bottom + 2.41, 0, concrete);
  }
  // Masonry walls are built around real apertures. The same geometry receives plaster later.
  const wallPieces = [];
  function wall(w, h, d, x, y, z, order) {
    const g = component(5, order, "grow");
    g.position.y = y - h / 2;
    box(g, w, h, d, x, h / 2, z, brick);
    wallPieces.push({ w, h, d, x, y, z, order });
  }
  for (let level = 0; level < 2; level++) {
    const b = 0.18 + level * 2.5,
      order = level * 0.25;
    // Front windows in two bays, entrance on lower right.
    for (const x of [-2.34, -0.83, 0.83, 2.34])
      wall(0.3, 2.25, 0.18, x, b + 1.125, 2, order);
    for (const x of [-1.58, 0, 1.58]) {
      const door = level === 0 && x === 1.58;
      wall(
        1.2,
        door ? 0.3 : 0.43,
        0.18,
        x,
        b + (door ? 2.1 : 2.035),
        2,
        order + 0.1,
      );
      if (!door) wall(1.2, 0.62, 0.18, x, b + 0.31, 2, order + 0.05);
    }
    // Side elevations: two windows on each side.
    for (const x of [-2.5, 2.5]) {
      for (const z of [-1.84, 0, 1.84])
        wall(0.18, 2.25, 0.35, x, b + 1.125, z, order + 0.07);
      for (const z of [-0.95, 0.95]) {
        wall(0.18, 0.62, 1.45, x, b + 0.31, z, order + 0.08);
        wall(0.18, 0.43, 1.45, x, b + 2.035, z, order + 0.12);
      }
    }
    wall(4.9, 2.25, 0.18, 0, b + 1.125, -1.96, order + 0.15);
  }
  // Window casements, mullions, glass, sill and a timber front door.
  function windowUnit(x, y, z, width, side, order) {
    const g = component(6, order, "install");
    g.position.set(x, y, z);
    g.rotation.y = side;
    for (const dx of [-width / 2, width / 2])
      box(g, 0.055, 1.2, 0.075, dx, 0, 0, charcoal);
    for (const dy of [-0.6, 0.6])
      box(g, width + 0.055, 0.055, 0.075, 0, dy, 0, charcoal);
    box(g, 0.045, 1.2, 0.08, 0, 0, 0.01, charcoal);
    box(g, width - 0.04, 1.14, 0.022, 0, 0, 0, glass);
    box(g, width + 0.12, 0.045, 0.25, 0, -0.63, 0.04, plaster);
  }
  for (let level = 0; level < 2; level++) {
    const y = 1.39 + level * 2.5;
    for (const x of [-1.58, 0, 1.58])
      if (level || x !== 1.58) windowUnit(x, y, 2.025, 1.2, 0, level * 0.2);
    for (const x of [-2.525, 2.525])
      for (const z of [-0.95, 0.95])
        windowUnit(x, y, z, 1.43, Math.PI / 2, level * 0.2 + 0.07);
  }
  const door = component(6, 0.08);
  box(door, 1.16, 1.91, 0.085, 1.58, 1.14, 2.03, wood);
  for (const x of [1, 2.18])
    box(door, 0.06, 1.96, 0.11, x, 1.16, 2.035, charcoal);
  box(door, 0.035, 0.27, 0.04, 1.95, 1.13, 2.1, charcoal);
  // Finish grows up the wall as a plaster/paint pass, retaining the apertures.
  for (const p of wallPieces) {
    const g = component(7, p.order, "grow");
    g.position.y = p.y - p.h / 2;
    box(g, p.w + 0.008, p.h, p.d + 0.008, p.x, p.h / 2, p.z, plaster);
  }
  for (const y of [2.57, 5.07]) {
    const band = component(7, 0.35);
    box(band, 5.7, 0.18, 4.55, 0, y, 0, trim);
  }
  // Stage 9: pitched timber roof, rafters, tile planes, seams, ridge and rainwater goods.
  const roofBase = 5.31,
    ridge = 6.5,
    span = 2.98;
  function timber(a, b, parent) {
    const av = new THREE.Vector3(...a),
      bv = new THREE.Vector3(...b),
      length = av.distanceTo(bv);
    const m = new THREE.Mesh(cube, wood);
    m.scale.set(0.1, length, 0.12);
    m.position.copy(av).add(bv).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      bv.sub(av).normalize(),
    );
    parent.add(m);
    m.castShadow = true;
  }
  for (let z = -2.25; z <= 2.3; z += 0.55) {
    const g = component(8, 0.03);
    timber([-span, roofBase, z], [0, ridge, z], g);
    timber([0, ridge, z], [span, roofBase, z], g);
  }
  const angle = Math.atan2(ridge - roofBase, span),
    slopeLength = Math.hypot(span, ridge - roofBase);
  // Close both triangular gable ends beneath the pitched roof.
  for (const z of [-2.12, 2.12]) {
    const outline = new THREE.Shape();
    outline.moveTo(-2.8, 0);
    outline.lineTo(0, 1.12);
    outline.lineTo(2.8, 0);
    outline.closePath();
    const geometry = new THREE.ExtrudeGeometry(outline, {
      depth: 0.12,
      bevelEnabled: false,
    });
    const g = component(8, 0.12, "grow");
    g.position.set(0, roofBase, z - 0.06);
    const mesh = new THREE.Mesh(geometry, plaster);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    g.add(mesh);
  }
  for (const side of [-1, 1]) {
    const g = component(8, 0.25);
    g.position.set((side * span) / 2, (roofBase + ridge) / 2, 0);
    g.rotation.z = -side * angle;
    box(g, slopeLength + 0.18, 0.065, 4.95, 0, 0, 0, tile);
    for (let z = -2.4; z < 2.45; z += 0.2)
      box(g, slopeLength + 0.18, 0.022, 0.035, 0, 0.047, z, trim);
    for (let x = -slopeLength / 2; x < slopeLength / 2; x += 0.4)
      box(g, 0.018, 0.022, 4.95, x, 0.045, 0, trim);
  }
  const finishing = component(8, 0.46);
  box(finishing, 0.14, 0.13, 5.04, 0, ridge + 0.04, 0, trim);
  for (const x of [-3.05, 3.05])
    box(finishing, 0.1, 0.12, 5, x, roofBase, 0, charcoal);
  for (const x of [-2.78, 2.78])
    box(finishing, 0.055, 5.07, 0.055, x, 2.69, -2.13, charcoal);
  for (let i = 0; i < 3; i++)
    box(
      finishing,
      1.7,
      0.12,
      0.35,
      1.58,
      0.025 + i * 0.05,
      2.82 - i * 0.27,
      concrete,
    );
  registerBase();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.ShadowMaterial({ opacity: 0.14 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.56;
  shadow.receiveShadow = true;
  scene.add(shadow);
  const groundGrid = new THREE.GridHelper(11, 22, 0xb29476, 0xd1baa0);
  groundGrid.position.y = -0.55;
  groundGrid.material.transparent = true;
  groundGrid.material.opacity = 0.23;
  model.add(groundGrid);

  const clamp = THREE.MathUtils.clamp,
    ease = (t) => t * t * (3 - 2 * t);
  let progress = 0,
    elapsed = 0,
    last = 0,
    visible = false,
    paused = false,
    optIn = false,
    lost = false,
    disposed = false,
    frame = 0,
    stageIndex = -1;
  const duration = Math.max(12, Number(copy.duration) || 24);
  const staticMode = () => reduced.matches && !optIn;
  const timed = () => optIn;
  const cleanups = [];
  function listen(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    cleanups.push(() => target.removeEventListener(event, handler, options));
  }
  function draw() {
    if (disposed || lost) return;
    const p = staticMode() ? 1 : progress;
    phases.forEach((parts, i) =>
      parts.forEach(({ g, order, kind, base }) => {
        const local = clamp((p * 9 - i - order) / (1 - order), 0, 1),
          t = ease(local);
        g.visible = local > 0;
        g.position.copy(base);
        g.scale.set(1, 1, 1);
        if (kind === "grow") g.scale.y = Math.max(0.001, t);
        else if (kind === "install") {
          g.position.z += 0.4 * (1 - t);
          g.scale.setScalar(0.9 + 0.1 * t);
        } else g.position.y += 0.35 * (1 - t);
      }),
    );
    const next = Math.min(8, Math.floor(p * 9));
    if (next !== stageIndex || p === 1) {
      label.textContent = p === 1 ? copy.complete : copy.stages[next];
      stageIndex = next;
      count.textContent = `${String(next + 1).padStart(2, "0")} / 09`;
    }
    bar.style.transform = `scaleX(${p})`;
    visual.dataset.progress = p.toFixed(4);
    visual.dataset.stage = String(next);
    control.textContent = staticMode()
      ? copy.start
      : progress >= 1
        ? copy.replay
        : paused
          ? copy.resume
          : copy.pause;
    renderer.render(scene, camera);
  }
  function scrollProgress() {
    if (!timed() && !staticMode() && !paused) {
      const scrollTrack = mobile.matches ? visual.parentElement : track;
      const pinned = mobile.matches ? visual : grid;
      const rect = scrollTrack.getBoundingClientRect();
      // The model is finished while the sticky section still has a short viewing hold.
      progress = clamp(
        ((mobile.matches ? 72 : 84) - rect.top) /
          Math.max(1, (scrollTrack.offsetHeight - pinned.offsetHeight) * 0.88),
        0,
        1,
      );
    }
  }
  function requestDraw() {
    if (!frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        scrollProgress();
        draw();
      });
  }
  function tick(time) {
    const dt = last ? Math.min((time - last) / 1000, 0.08) : 0;
    last = time;
    if (timed() && !staticMode() && !paused) {
      elapsed = Math.min(duration, elapsed + dt);
      progress = elapsed / duration;
    }
    draw();
    if (progress >= 1) renderer.setAnimationLoop(null);
  }
  function updateLoop() {
    last = 0;
    renderer.setAnimationLoop(
      visible &&
        !document.hidden &&
        timed() &&
        !staticMode() &&
        !paused &&
        !lost &&
        progress < 1
        ? tick
        : null,
    );
    requestDraw();
  }
  function resize() {
    const w = view.clientWidth,
      h = view.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h,
      half = Math.max(4.85, 5.15 / aspect);
    camera.left = -half * aspect;
    camera.right = half * aspect;
    camera.top = half;
    camera.bottom = -half;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  function modeChanged() {
    elapsed = 0;
    progress = 0;
    paused = false;
    stageIndex = -1;
    hero.classList.toggle("construction-static", staticMode() || optIn);
    control.hidden = !(timed() || staticMode());
    hint.textContent = copy.desktopHint;
    resize();
    updateLoop();
  }
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0].intersectionRatio >= 0.3;
      updateLoop();
    },
    { threshold: [0, 0.3, 0.6] },
  );
  io.observe(visual);
  const ro = new ResizeObserver(resize);
  ro.observe(view);
  listen(
    window,
    "scroll",
    () => {
      if (!timed()) requestDraw();
    },
    { passive: true },
  );
  listen(document, "visibilitychange", updateLoop);
  listen(mobile, "change", modeChanged);
  listen(reduced, "change", () => {
    optIn = false;
    modeChanged();
  });
  listen(control, "click", () => {
    if (staticMode()) {
      optIn = true;
      modeChanged();
      return;
    }
    if (progress >= 1) {
      elapsed = 0;
      progress = 0;
      paused = false;
      stageIndex = -1;
    } else paused = !paused;
    control.setAttribute("aria-pressed", String(paused));
    updateLoop();
  });
  listen(canvas, "webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    renderer.setAnimationLoop(null);
    hero.classList.add("construction-unavailable");
    visual.classList.add("construction-failed");
    visual.classList.remove("construction-ready");
    control.hidden = true;
  });
  listen(canvas, "webglcontextrestored", () => {
    lost = false;
    hero.classList.remove("construction-unavailable");
    visual.classList.remove("construction-failed");
    visual.classList.add("construction-ready");
    modeChanged();
  });
  modeChanged();
  scrollProgress();
  draw();
  visual.classList.add("construction-ready");
  listen(window, "pagehide", (event) => {
    if (event.persisted) {
      renderer.setAnimationLoop(null);
      return;
    }
    disposed = true;
    renderer.setAnimationLoop(null);
    cancelAnimationFrame(frame);
    io.disconnect();
    ro.disconnect();
    cleanups.forEach((fn) => fn());
    const geometries = new Set(),
      materials = new Set();
    scene.traverse((o) => {
      if (o.geometry) geometries.add(o.geometry);
      if (o.material) materials.add(o.material);
    });
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    renderer.dispose();
  });
  listen(window, "pageshow", (event) => {
    if (event.persisted) updateLoop();
  });
}
