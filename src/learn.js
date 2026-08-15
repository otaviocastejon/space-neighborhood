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
  if (body.id !== "earth" && body.id !== "sun") {
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

export function refreshLessonCopy(state) {
  if (!state?.lesson) return;
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
