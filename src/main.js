import { DT, barycenter, step, stepTracers } from "./physics.js";
import { Renderer } from "./render.js";
import { bodiesFromPayload, copyShareURL, readHash } from "./share.js";
import { VIEWS, makeSolarSystem } from "./solar.js";
import { SPEEDS, mountUI, nearestSpeed } from "./ui.js";
import {
  followable,
  missionFocus,
  placeMoon,
  refreshLessonCopy,
  setupEclipse,
  setupVisibility,
  startStarship,
  stepMission,
} from "./learn.js";
import { localizeState, t } from "./i18n.js";

const CLICK_PX = 8;
const UI_SELECTOR = "button, aside, label, .menu, .speed-dock, input, .card, .event";

const space = document.getElementById("space");
const stars = document.getElementById("stars");
const overlay = document.getElementById("overlay");
const renderer = new Renderer(space, stars, overlay);

const state = {
  bodies: [],
  tracers: [],
  paused: false,
  warp: 28,
  zoom: 1,
  panX: 0,
  panY: 0,
  view: VIEWS.system.view,
  viewId: "system",
  follow: null,
  selected: "system",
  time: 0,
  flags: {
    labels: true,
    orbits: true,
    asteroids: true,
    trails: true,
  },
  mission: null,
  event: null,
  lesson: null,
  focus: null,
  spotlight: null,
  lineup: null,
  shadow: null,
  frameIds: null,
};

let panDrag = null;

const ui = mountUI({
  views: Object.keys(VIEWS).map((id) => ({ id })),
  onShare: async () => {
    try {
      await copyShareURL(state);
      ui.showToast(t("toast.copied"));
    } catch {
      ui.showToast(t("toast.copyFail"));
    }
  },
  onPng: exportPng,
  onReset: () => resetSystem(t("toast.reset")),
  onView: (id) => {
    if (state.lesson) resetSystem();
    setView(id);
  },
  onLearn: (id) => learn(id),
  onPause: () => {
    state.paused = !state.paused;
  },
  onSpeed: (n) => {
    const speed = SPEEDS.find((s) => s.n === n);
    if (!speed) return;
    state.warp = speed.warp;
    state.paused = false;
  },
  onToggle: (flag, value) => {
    state.flags[flag] = value;
    if (flag === "trails" && !value) renderer.clearSpace();
  },
  onLocale: () => {
    localizeState(state);
    refreshLessonCopy(state);
    ui.applyI18n();
    ui.update(state);
  },
});

ui.setViewButtons("system");

function resetSystem(message) {
  const flags = state.flags;
  const warp = state.warp;
  const fresh = makeSolarSystem();
  state.bodies = fresh.bodies;
  state.tracers = fresh.tracers;
  state.time = 0;
  state.follow = null;
  state.selected = "system";
  state.panX = 0;
  state.panY = 0;
  state.zoom = 1;
  state.viewId = "system";
  state.view = VIEWS.system.view;
  state.mission = null;
  state.event = null;
  state.lesson = null;
  state.focus = null;
  state.spotlight = null;
  state.lineup = null;
  state.shadow = null;
  state.frameIds = null;
  state.paused = false;
  state.warp = warp;
  state.flags = flags;
  renderer.clearSpace();
  ui.markView("system");
  localizeState(state);
  if (message) ui.showToast(message);
}

function setView(id) {
  const next = VIEWS[id];
  if (!next) return;
  state.viewId = id;
  state.view = next.view;
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  state.focus = null;
  ui.markView(id);
}

function camera() {
  if (state.focus) {
    return { x: state.focus.x, y: state.focus.y, panX: state.panX, panY: state.panY };
  }
  const followed = followable(state, state.follow);
  const origin = followed || barycenter(state.bodies.filter((b) => b.kind !== "moon"));
  return { x: origin.x, y: origin.y, panX: state.panX, panY: state.panY };
}

function bodyById(id) {
  return state.bodies.find((b) => b.id === id) || state.tracers.find((t) => t.id === id);
}

function frameBodies(ids, pad = 1.95) {
  const pts = ids.map((id) => bodyById(id)).filter(Boolean);
  if (!pts.length) return;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const w = Math.max(maxX - minX, 0.04);
  const h = Math.max(maxY - minY, 0.04);
  const extra = Math.max(w, h) * 0.28;
  minX -= extra;
  maxX += extra;
  minY -= extra;
  maxY += extra;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const span = Math.min(renderer.width, renderer.height) || 1;
  const view = Math.max(
    ((maxX - minX) * pad * span) / Math.max(renderer.width, 1),
    ((maxY - minY) * pad * span) / Math.max(renderer.height, 1),
    0.12
  );
  state.frameIds = ids;
  state.focus = { x: cx, y: cy };
  state.follow = null;
  state.view = view;
  state.viewId = null;
  state.zoom = 1;
  state.panX = Math.min(180, renderer.width * 0.1);
  state.panY = 0;
  ui.markView(null);
}

function restoreLessonFrame() {
  if (state.frameIds) frameBodies(state.frameIds);
}

function applyLesson(id, lesson) {
  if (!lesson) return;
  state.lesson = id;
  state.event = lesson.event || null;
  state.spotlight = lesson.spotlight || null;
  state.lineup = lesson.lineup || null;
  state.shadow = lesson.shadow || null;
  state.selected = lesson.select || "lesson";
  state.paused = Boolean(lesson.pause);
  if (lesson.warp) state.warp = lesson.warp;
  if (lesson.view) setView(lesson.view);
  if (lesson.follow) {
    state.follow = lesson.follow;
    state.focus = null;
    state.panX = 0;
    state.panY = 0;
  }
  if (lesson.frame) frameBodies(lesson.frame);
}

function select(id, { follow = false } = {}) {
  state.selected = id;
  if (follow) {
    state.follow = id;
    state.focus = null;
    state.panX = 0;
    state.panY = 0;
  } else if (id === "system") {
    state.follow = null;
  }
}

function learn(id) {
  resetSystem();
  let lesson = null;
  if (id === "starship") {
    lesson = startStarship(state);
    renderer.clearSpace();
  } else if (id.startsWith("eclipse-")) {
    lesson = setupEclipse(state, id.replace("eclipse-", ""));
  } else {
    lesson = setupVisibility(state, id);
  }
  applyLesson(id, lesson);
}

function restoreFromHash() {
  const payload = readHash();
  resetSystem();
  if (!payload) return;
  const custom = bodiesFromPayload(payload);
  if (custom?.length) state.bodies = custom;
  if (payload.z) state.zoom = payload.z;
  if (payload.w) {
    state.warp = nearestSpeed(payload.w).warp;
  }
  if (payload.vew) {
    state.view = payload.vew;
    const match = Object.entries(VIEWS).find(([, v]) => v.view === payload.vew);
    if (match) {
      state.viewId = match[0];
      ui.markView(match[0]);
    }
  }
  if (payload.f) {
    state.follow = payload.f;
    state.selected = payload.f;
  }
  if (payload.t) state.time = payload.t;
  localizeState(state);
}

window.addEventListener("resize", () => renderer.resize());
renderer.resize();
restoreFromHash();

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    state.paused = !state.paused;
    return;
  }
  if (event.key === "[" || event.key === "]") {
    const delta = event.key === "]" ? 1 : -1;
    const current = nearestSpeed(state.warp);
    const next = SPEEDS.find((s) => s.n === current.n + delta) || current;
    state.warp = next.warp;
    state.paused = false;
  }
  if (event.key === "r") resetSystem(t("toast.reset"));
  if (event.key === "Escape") {
    if (ui.isMenuOpen()) {
      ui.closeMenu();
      return;
    }
    state.follow = null;
    state.selected = state.lesson ? "lesson" : "system";
    state.panX = 0;
    state.panY = 0;
    if (state.lesson) restoreLessonFrame();
  }
  if (event.key === "0") {
    state.follow = null;
    state.selected = state.lesson ? "lesson" : "system";
    state.panX = 0;
    state.panY = 0;
    if (state.lesson) restoreLessonFrame();
  }
  if (event.key === "1") setView("earth");
  if (event.key === "2") setView("inner");
  if (event.key === "3") setView("system");
  if (event.key === "4") setView("outer");
  if (event.key === "m") {
    document.getElementById("btn-menu").click();
  }
});

window.addEventListener(
  "wheel",
  (event) => {
    if (event.target.closest(UI_SELECTOR)) return;
    event.preventDefault();
    const factor = event.deltaY > 0 ? 0.9 : 1.11;
    const cam = camera();
    const world = renderer.screenToWorld(event.clientX, event.clientY, cam);
    state.zoom = Math.min(24, Math.max(0.2, state.zoom * factor));
    renderer.scale(state.view, state.zoom);
    const now = renderer.worldToScreen(world.x, world.y, camera());
    state.panX += event.clientX - now.x;
    state.panY += event.clientY - now.y;
  },
  { passive: false }
);

window.addEventListener("contextmenu", (event) => event.preventDefault());

window.addEventListener("pointerdown", (event) => {
  if (event.target.closest(UI_SELECTOR)) return;
  if (event.button !== 0 && event.button !== 2) return;
  panDrag = {
    x: event.clientX,
    y: event.clientY,
    panX: state.panX,
    panY: state.panY,
    click: event.button === 0 && !event.shiftKey,
  };
});

window.addEventListener("pointermove", (event) => {
  if (!panDrag) return;
  state.panX = panDrag.panX + (event.clientX - panDrag.x);
  state.panY = panDrag.panY + (event.clientY - panDrag.y);
});

window.addEventListener("pointerup", (event) => {
  if (!panDrag) return;
  const pixelMove = Math.hypot(event.clientX - panDrag.x, event.clientY - panDrag.y);
  const wasClick = panDrag.click && pixelMove < CLICK_PX;
  panDrag = null;
  if (!wasClick) return;
  inspectAt(event.clientX, event.clientY);
});

function inspectAt(sx, sy) {
  const cam = camera();
  const notables = [
    ...state.bodies.filter((b) => !state.spotlight || state.spotlight.includes(b.id)),
    ...state.tracers.filter((t) => t.kind === "ship"),
  ];
  const hit = renderer.hitTest(sx, sy, notables, cam);
  if (hit) {
    select(hit.id, { follow: true });
    return;
  }
  if (state.flags.asteroids && !state.spotlight) {
    const rock = renderer.hitTest(
      sx,
      sy,
      state.tracers.filter((t) => t.kind === "asteroid"),
      cam,
      { generous: true }
    );
    if (rock) {
      select("belt");
      return;
    }
  }
  if (state.lesson) {
    restoreLessonFrame();
    state.selected = "lesson";
    return;
  }
  select("system");
}

function exportPng() {
  const canvas = renderer.snapshot();
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "aphelion.png";
  a.click();
}

function tick() {
  renderer.scale(state.view, state.zoom);
  if (!state.paused) {
    const earth = state.bodies.find((b) => b.id === "earth");
    const moon = state.bodies.find((b) => b.id === "moon");
    const simDt = state.mission?.active ? DT / 8 : DT;
    for (let i = 0; i < state.warp; i++) {
      step(state.bodies, simDt);
      if (earth && moon) placeMoon(moon, earth, simDt);
      stepTracers(state.tracers, state.bodies, simDt);
      stepMission(state, simDt);
      state.time += simDt;
    }
    if (state.mission?.active) {
      const focus = missionFocus(state);
      if (focus) state.focus = focus;
    }
    if (state.mission && !state.mission.active && state.mission.phase === "done") {
      state.mission.phase = "landed";
      state.follow = "earth";
      state.focus = null;
      state.selected = "lesson";
      ui.showToast(t("toast.welcome"));
    }
  } else {
    const earth = state.bodies.find((b) => b.id === "earth");
    const moon = state.bodies.find((b) => b.id === "moon");
    if (earth && moon) placeMoon(moon, earth, 0);
  }
  const cam = camera();
  renderer.drawTrails(state.tracers, cam, state.flags.trails);
  renderer.drawOverlay(state, cam);
  ui.update(state);
  requestAnimationFrame(tick);
}

tick();
