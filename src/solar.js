import { cloneBodies, placeOnOrbit } from "./physics.js";
import { applyBodyCopy, t } from "./i18n.js";
import { makeMoon, placeMoon } from "./learn.js";

export const VIEWS = {
  earth: { view: 0.085 },
  inner: { view: 4.2 },
  system: { view: 14 },
  outer: { view: 72 },
};

const PLANETS = [
  {
    id: "mercury",
    name: "Mercury",
    a: 0.387,
    mass: 1.66e-7,
    angle: 0.9,
    color: "#c4b8a5",
    size: 3.2,
    period: "88 Earth days",
  },
  {
    id: "venus",
    name: "Venus",
    a: 0.723,
    mass: 2.45e-6,
    angle: 2.4,
    color: "#e6c07b",
    size: 5.1,
    period: "225 Earth days",
  },
  {
    id: "earth",
    name: "Earth",
    a: 1,
    mass: 3.0e-6,
    angle: 3.5,
    color: "#6ec6ff",
    size: 5.4,
    period: "365 days",
  },
  {
    id: "mars",
    name: "Mars",
    a: 1.524,
    mass: 3.23e-7,
    angle: 5.1,
    color: "#d9784c",
    size: 4.2,
    period: "687 Earth days",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    a: 5.203,
    mass: 9.55e-4,
    angle: 1.3,
    color: "#e0b07a",
    size: 12,
    period: "12 Earth years",
  },
  {
    id: "saturn",
    name: "Saturn",
    a: 9.537,
    mass: 2.86e-4,
    angle: 4.4,
    color: "#f0d9a0",
    size: 10.5,
    period: "29 Earth years",
    rings: true,
  },
  {
    id: "uranus",
    name: "Uranus",
    a: 19.19,
    mass: 4.37e-5,
    angle: 0.4,
    color: "#7ad7d0",
    size: 7.2,
    period: "84 Earth years",
  },
  {
    id: "neptune",
    name: "Neptune",
    a: 30.07,
    mass: 5.15e-5,
    angle: 2.9,
    color: "#4f7cff",
    size: 7,
    period: "165 Earth years",
  },
  {
    id: "pluto",
    name: "Pluto",
    a: 39.5,
    mass: 6.6e-9,
    angle: 5.8,
    color: "#c9b7a2",
    size: 2.8,
    period: "248 Earth years",
  },
];

export function navWorlds() {
  return [
    { id: "sun", color: "#ffcf6b" },
    ...PLANETS.map((p) => ({ id: p.id, color: p.color, rings: Boolean(p.rings) })),
    { id: "moon", color: "#d9d4cc" },
  ];
}

export function systemGuide() {
  return { id: "system", kind: "guide", ...t("guide.system") };
}

export function beltGuide() {
  return { id: "belt", kind: "guide", ...t("guide.belt") };
}

export function makeSun() {
  return applyBodyCopy({
    id: "sun",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    mass: 1,
    a: 0,
    color: "#ffcf6b",
    size: 18,
    kind: "star",
    period: "—",
  });
}

export function makeSolarSystem() {
  const bodies = [
    makeSun(),
    ...PLANETS.map((p) =>
      applyBodyCopy({
        ...placeOnOrbit(p),
        kind: "planet",
      })
    ),
    makeMoon(),
  ];
  const earth = bodies.find((b) => b.id === "earth");
  const moon = bodies.find((b) => b.id === "moon");
  placeMoon(moon, earth, 0);
  return {
    bodies: cloneBodies(bodies),
    tracers: makeBelt(),
    view: VIEWS.system.view,
  };
}

export function makeBelt(count = 70) {
  const tracers = [];
  for (let i = 0; i < count; i++) {
    const a = 2.15 + Math.random() * 1.15;
    const angle = Math.random() * Math.PI * 2;
    tracers.push({
      ...placeOnOrbit({ a, angle, mass: 0, hostMass: 1 }),
      id: `belt-${i}`,
      kind: "asteroid",
      color: "#8a8478",
      size: 1.1 + Math.random() * 0.6,
    });
    applyBodyCopy(tracers[tracers.length - 1]);
  }
  return tracers;
}

export function topicFor(state) {
  const id = state.selected || "system";
  if (id === "lesson" && state.event) return state.event;
  if (id === "system") return systemGuide();
  if (id === "belt") return beltGuide();
  return (
    state.bodies.find((b) => b.id === id) ||
    state.tracers.find((t) => t.id === id) ||
    systemGuide()
  );
}
