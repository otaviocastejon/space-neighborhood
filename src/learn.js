import { G } from "./physics.js";
import { applyBodyCopy, localeTag, t } from "./i18n.js";

const AU_KM = 149597870.7;
const KMS_PER_AU_YEAR = AU_KM / (365.25 * 24 * 3600);
const LIGHT_SECONDS_PER_AU = 499.0;

export const MOON_PERIOD = 27.321661 / 365.25;
export const MOON_REAL_AU = 384400 / AU_KM;
export const MOON_VISUAL_AU = 0.018;
export const MOON_STRETCH = MOON_VISUAL_AU / MOON_REAL_AU;

export const VIEWS_EXTRA = {
  earth: { label: "earth", view: 0.085 },
};

export function toKmS(auPerYear) {
  return auPerYear * KMS_PER_AU_YEAR;
}

export function formatSpeed(auPerYear) {
  const kmS = toKmS(auPerYear);
  const kmH = kmS * 3600;
  const loc = localeTag();
  if (kmS >= 1) return `${kmS.toFixed(1)} km/s  ·  ${Math.round(kmH).toLocaleString(loc)} km/h`;
  return `${Math.round(kmH).toLocaleString(loc)} km/h`;
}

export function formatKm(au) {
  const km = Math.abs(au) * AU_KM;
  const loc = localeTag();
  if (km >= 1e6) return t("facts.millionKm", { n: (km / 1e6).toFixed(2) });
  if (km >= 1000) return `${Math.round(km).toLocaleString(loc)} km`;
  return `${km.toFixed(0)} km`;
}

export function formatLight(au) {
  const seconds = Math.abs(au) * LIGHT_SECONDS_PER_AU;
  if (seconds < 90) return t("facts.lightSeconds", { n: seconds.toFixed(1) });
  if (seconds < 5400) return t("facts.lightMinutes", { n: (seconds / 60).toFixed(1) });
  return t("facts.lightHours", { n: (seconds / 3600).toFixed(2) });
}

export function formatDuration(years) {
  const days = Math.abs(years) * 365.25;
  const hours = days * 24;
  if (hours < 36) return t("facts.hours", { n: hours.toFixed(1) });
  if (days < 80) return t("facts.days", { n: days.toFixed(1) });
  if (days < 500) return t("facts.months", { n: (days / 30.44).toFixed(1) });
  return t("facts.years", { n: years.toFixed(2) });
}

export function jetTime(au) {
  const hours = (Math.abs(au) * AU_KM) / 900;
  return formatDuration(hours / (24 * 365.25));
}

export function bodyFacts(body, earth) {
  const speed = Math.hypot(body.vx, body.vy);
  const distSun = Math.hypot(body.x, body.y);
  const distEarth =
    body.id === "earth" ? 0 : Math.hypot(body.x - earth.x, body.y - earth.y);
  const periodYears = body.a > 0 ? Math.sqrt(body.a ** 3) : null;
  const rows = [];

  rows.push([t("facts.speed"), formatSpeed(speed)]);
  if (body.id !== "sun") rows.push([t("facts.fromSun"), `${distSun.toFixed(3)} AU  ·  ${formatKm(distSun)}`]);
  if (body.id !== "earth" && body.id !== "sun" && body.kind !== "ship") {
    rows.push([t("facts.fromEarth"), `${distEarth.toFixed(3)} AU  ·  ${formatKm(distEarth)}`]);
    rows.push([t("facts.lightTime"), formatLight(distEarth)]);
    rows.push([t("facts.jet"), jetTime(distEarth)]);
  }
  if (body.id === "earth") {
    rows.push([t("facts.year"), t("facts.yearEarth")]);
    rows.push([t("facts.lightSun"), t("facts.lightSunVal")]);
  }
  if (periodYears && body.kind === "planet") {
    rows.push([t("facts.orbitSun"), formatDuration(periodYears)]);
  }
  if (body.id === "moon") {
    rows.push([t("facts.realDist"), t("facts.realDistMoon")]);
    rows.push([t("facts.onMap"), t("facts.onMapMoon", { n: MOON_STRETCH.toFixed(0) })]);
  }
  if (body.live) rows.push([t("facts.live"), body.live]);
  return rows;
}

export function makeMoon() {
  return applyBodyCopy({
    id: "moon",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    mass: 0,
    a: 0,
    color: "#d9d4cc",
    size: 2.7,
    kind: "moon",
    period: "27.3 days",
    angle: 1.2,
    radius: MOON_VISUAL_AU,
  });
}

export function placeMoon(moon, earth, dt) {
  if (!moon.freeze) moon.angle += dt * ((Math.PI * 2) / MOON_PERIOD);
  const r = moon.radius || MOON_VISUAL_AU;
  const c = Math.cos(moon.angle);
  const s = Math.sin(moon.angle);
  const omega = (Math.PI * 2) / MOON_PERIOD;
  moon.x = earth.x + r * c;
  moon.y = earth.y + r * s;
  moon.vx = earth.vx - r * s * omega;
  moon.vy = earth.vy + r * c * omega;
}

const SHIP_ORBIT = 0.0052;
const SHIP_BULGE = 0.0032;
const SHIP_START = 0.0042;
const T_OUT = 0.0027;
const T_LOOP = 0.0032;
const T_HOME = 0.0027;
const LOOP_TURNS = 2;

export function makeStarship(earth, moon) {
  const p = shipPathPoint(earth, moon, "to-moon", 0);
  return applyBodyCopy({
    id: "starship",
    x: p.x,
    y: p.y,
    vx: earth.vx,
    vy: earth.vy,
    mass: 0,
    kind: "ship",
    color: "#e8e6df",
    size: 5.2,
    burn: true,
  });
}

function flightBeat(phase) {
  const key = phase === "landed" ? "done" : phase;
  const beat = t(`flight.${key}`);
  return beat && typeof beat === "object" ? beat : null;
}

export function startStarship(state) {
  const earth = byId(state, "earth");
  const moon = byId(state, "moon");
  if (!earth || !moon) return null;
  moon.radius = MOON_VISUAL_AU;
  moon.freeze = true;
  moon.angle = 0;
  moon.size = 6.2;
  placeMoon(moon, earth, 0);
  state.tracers = state.tracers.filter((t) => t.kind !== "ship");
  const ship = makeStarship(earth, moon);
  state.tracers.push(ship);
  state.mission = {
    active: true,
    phase: "to-moon",
    t: 0,
    legT: 0,
    burn: true,
  };
  return {
    event: lessonCard(flightBeat("to-moon")),
    frame: ["earth", "moon"],
    spotlight: ["sun", "earth", "moon", "starship"],
    select: "lesson",
    pause: false,
    warp: 1,
  };
}

export function stepMission(state, dt) {
  const mission = state.mission;
  if (!mission?.active) return;
  const earth = byId(state, "earth");
  const moon = byId(state, "moon");
  const ship = state.tracers.find((t) => t.kind === "ship");
  if (!earth || !moon || !ship) {
    mission.active = false;
    return;
  }

  mission.t += dt;
  mission.legT += dt;

  if (mission.phase === "to-moon") {
    const u = Math.min(1, mission.legT / T_OUT);
    putShip(ship, shipPathPoint(earth, moon, "to-moon", u), dt);
    if (u >= 1) setFlightPhase(state, "lunar");
    return;
  }

  if (mission.phase === "lunar") {
    const u = Math.min(1, mission.legT / T_LOOP);
    putShip(ship, shipPathPoint(earth, moon, "lunar", u), dt);
    if (u >= 1) setFlightPhase(state, "home");
    return;
  }

  if (mission.phase === "home") {
    const u = Math.min(1, mission.legT / T_HOME);
    putShip(ship, shipPathPoint(earth, moon, "home", u), dt);
    if (u >= 1) {
      ship.x = earth.x;
      ship.y = earth.y;
      ship.vx = earth.vx;
      ship.vy = earth.vy;
      ship.burn = false;
      mission.active = false;
      mission.burn = false;
      setFlightPhase(state, "done");
    }
  }
}

function setFlightPhase(state, phase) {
  state.mission.phase = phase;
  state.mission.legT = 0;
  const beat = flightBeat(phase);
  if (beat && state.event) {
    state.event.role = t("flight.happening");
    state.event.name = beat.name;
    state.event.blurb = beat.blurb;
    state.event.didYouKnow = beat.didYouKnow || "";
    state.event.facts = beat.facts;
    state.selected = "lesson";
  }
}

export function refreshLessonCopy(state) {
  if (!state?.lesson) return;
  if (state.lesson === "starship") {
    const beat = flightBeat(state.mission?.phase || "to-moon");
    if (beat && state.event) {
      state.event.role = t("flight.happening");
      state.event.name = beat.name;
      state.event.blurb = beat.blurb;
      state.event.didYouKnow = beat.didYouKnow || "";
      state.event.facts = beat.facts;
    }
    applyBodyCopy(state.tracers.find((tr) => tr.kind === "ship") || {});
    return;
  }
  if (state.lesson.startsWith("eclipse-")) {
    const type = state.lesson.replace("eclipse-", "");
    const copy = t(`eclipse.${type}`);
    if (copy && state.event) {
      state.event.role = t("flight.happening");
      state.event.name = copy.name;
      state.event.blurb = copy.blurb;
      state.event.didYouKnow = t("eclipse.squish");
      state.event.facts = copy.facts;
    }
    return;
  }
  const copy = t(`sky.${state.lesson}`);
  if (copy && state.event) {
    state.event.role = t("flight.happening");
    state.event.name = copy.name;
    state.event.blurb = copy.blurb;
    state.event.didYouKnow = copy.didYouKnow || t("sky.oppositionKnow");
    state.event.facts = copy.facts;
  }
}

function putShip(ship, point, dt) {
  const step = dt || 1e-6;
  ship.vx = (point.x - ship.x) / step;
  ship.vy = (point.y - ship.y) / step;
  ship.x = point.x;
  ship.y = point.y;
  ship.burn = true;
}

function earthMoonBasis(earth, moon) {
  const dx = moon.x - earth.x;
  const dy = moon.y - earth.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  return { ux, uy, px: -uy, py: ux, dist };
}

function shipPathPoint(earth, moon, phase, u) {
  const { ux, uy, px, py } = earthMoonBasis(earth, moon);
  const end = (moon.radius || MOON_VISUAL_AU) - SHIP_ORBIT;
  if (phase === "to-moon") {
    const s = smooth(u);
    const along = SHIP_START + s * (end - SHIP_START);
    const side = Math.sin(s * Math.PI) * SHIP_BULGE;
    return { x: earth.x + ux * along + px * side, y: earth.y + uy * along + py * side };
  }
  if (phase === "lunar") {
    const ang0 = Math.atan2(-uy, -ux);
    const ang = ang0 + u * LOOP_TURNS * Math.PI * 2;
    return {
      x: moon.x + SHIP_ORBIT * Math.cos(ang),
      y: moon.y + SHIP_ORBIT * Math.sin(ang),
    };
  }
  const s = smooth(u);
  const along = end + s * (SHIP_START - end);
  const side = -Math.sin(s * Math.PI) * SHIP_BULGE;
  return { x: earth.x + ux * along + px * side, y: earth.y + uy * along + py * side };
}

function smooth(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function missionPathSamples(earth, moon, n = 48) {
  const outbound = [];
  const inbound = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    outbound.push(shipPathPoint(earth, moon, "to-moon", u));
    inbound.push(shipPathPoint(earth, moon, "home", u));
  }
  return { outbound, inbound, orbitR: SHIP_ORBIT };
}

export function missionFocus(state) {
  const earth = byId(state, "earth");
  const moon = byId(state, "moon");
  if (!earth || !moon) return null;
  return { x: (earth.x + moon.x) / 2, y: (earth.y + moon.y) / 2 };
}

export function missionFacts(state) {
  const mission = state.mission;
  const ship = state.tracers.find((t) => t.kind === "ship");
  const earth = byId(state, "earth");
  const moon = byId(state, "moon");
  if (!mission || !ship || !earth || !moon) return [];
  const target = mission.phase === "home" || mission.phase === "done" ? earth : moon;
  const dist = Math.hypot(ship.x - target.x, ship.y - target.y);
  const rel = Math.hypot(ship.vx - earth.vx, ship.vy - earth.vy);
  const phaseLabel = t(`flight.phase.${mission.phase}`) || mission.phase;
  return [
    [t("facts.phase"), phaseLabel],
    [t("facts.speed"), formatSpeed(rel)],
    [t("facts.distance"), formatKm(dist)],
    [t("facts.flight"), formatDuration(mission.t)],
    [t("facts.lightEarth"), formatLight(Math.hypot(ship.x - earth.x, ship.y - earth.y))],
  ];
}

const ECLIPSE_EARTH_AU = 0.3;

export function setupEclipse(state, type) {
  const sun = byId(state, "sun");
  const earth = byId(state, "earth");
  const moon = byId(state, "moon");
  if (!sun || !earth || !moon) return null;

  setOnRails(earth, ECLIPSE_EARTH_AU, 0);
  earth.a = ECLIPSE_EARTH_AU;
  sun.size = 26;
  earth.size = 9;
  moon.size = 5.6;

  const squish = t("eclipse.squish");

  if (type === "solar") {
    moon.radius = 0.055;
    moon.angle = Math.PI;
    placeMoon(moon, earth, 0);
    const copy = t("eclipse.solar");
    return {
      event: lessonCard({ ...copy, didYouKnow: squish }),
      frame: ["sun", "earth", "moon"],
      spotlight: ["sun", "earth", "moon"],
      lineup: ["sun", "moon", "earth"],
      shadow: "solar",
      select: "lesson",
      pause: true,
    };
  }

  if (type === "annular") {
    moon.radius = 0.11;
    moon.angle = Math.PI;
    placeMoon(moon, earth, 0);
    const copy = t("eclipse.annular");
    return {
      event: lessonCard({ ...copy, didYouKnow: squish }),
      frame: ["sun", "earth", "moon"],
      spotlight: ["sun", "earth", "moon"],
      lineup: ["sun", "moon", "earth"],
      shadow: "annular",
      select: "lesson",
      pause: true,
    };
  }

  moon.radius = 0.055;
  moon.angle = 0;
  moon.color = "#c45c4a";
  placeMoon(moon, earth, 0);
  const lunarCopy = t("eclipse.lunar");
  return {
    event: lessonCard({ ...lunarCopy, didYouKnow: squish }),
    frame: ["sun", "earth", "moon"],
    spotlight: ["sun", "earth", "moon"],
    lineup: ["sun", "earth", "moon"],
    shadow: "lunar",
    select: "lesson",
    pause: true,
  };
}

export function setupVisibility(state, id) {
  const earth = byId(state, "earth");
  const planet = byId(state, id);
  if (!earth || !planet) return null;
  const moon = byId(state, "moon");
  if (moon) moon.radius = MOON_VISUAL_AU;

  setOnRails(earth, 1, 0);

  if (id === "mars" || id === "jupiter" || id === "saturn") {
    setOnRails(planet, planet.a || Math.hypot(planet.x, planet.y), 0);
    const copy = t(`sky.${id}`);
    return {
      event: lessonCard({ ...copy, didYouKnow: t("sky.oppositionKnow") }),
      frame: ["sun", "earth", id],
      spotlight: ["sun", "earth", id],
      lineup: ["sun", "earth", id],
      select: "lesson",
      pause: true,
    };
  }

  if (id === "mercury") {
    const a = planet.a;
    setOnRails(planet, a, Math.acos(Math.min(0.999, a)));
    return {
      event: lessonCard(t("sky.mercury")),
      frame: ["sun", "earth", "mercury"],
      spotlight: ["sun", "earth", "mercury"],
      lineup: ["sun", "earth", "mercury"],
      select: "lesson",
      pause: true,
    };
  }

  if (id === "venus") {
    const a = planet.a;
    setOnRails(planet, a, -Math.acos(Math.min(0.999, a)));
    return {
      event: lessonCard(t("sky.venus")),
      frame: ["sun", "earth", "venus"],
      spotlight: ["sun", "earth", "venus"],
      lineup: ["sun", "earth", "venus"],
      select: "lesson",
      pause: true,
    };
  }

  return null;
}

function lessonCard({ name, blurb, didYouKnow, facts }) {
  return {
    id: "lesson",
    kind: "guide",
    role: t("flight.happening"),
    name,
    blurb,
    didYouKnow,
    facts,
  };
}

function setOnRails(body, radius, angle) {
  const v = Math.sqrt(G / radius);
  body.x = radius * Math.cos(angle);
  body.y = radius * Math.sin(angle);
  body.vx = -Math.sin(angle) * v;
  body.vy = Math.cos(angle) * v;
}

function byId(state, id) {
  return state.bodies.find((b) => b.id === id);
}

export function followable(state, id) {
  return state.bodies.find((b) => b.id === id) || state.tracers.find((t) => t.id === id);
}
