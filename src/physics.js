export const G = 4 * Math.PI * Math.PI;
export const EPS = 0.002;
export const DT = 0.00004;
export const MAX_TRACERS = 220;

const EPS2 = EPS * EPS;

export function cloneBodies(bodies) {
  return bodies.map((b) => ({ ...b }));
}

export function accelerations(bodies) {
  const n = bodies.length;
  const ax = new Float64Array(n);
  const ay = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    const bi = bodies[i];
    for (let j = i + 1; j < n; j++) {
      const bj = bodies[j];
      const dx = bj.x - bi.x;
      const dy = bj.y - bi.y;
      const r2 = dx * dx + dy * dy + EPS2;
      const inv = 1 / Math.sqrt(r2);
      const s = G * inv * inv * inv;
      const ai = s * bj.mass;
      const aj = s * bi.mass;
      ax[i] += ai * dx;
      ay[i] += ai * dy;
      ax[j] -= aj * dx;
      ay[j] -= aj * dy;
    }
  }

  return { ax, ay };
}

export function step(bodies, dt = DT) {
  const live = bodies.filter((b) => b.kind !== "moon");
  if (live.length === 0) return;

  const a0 = accelerations(live);
  for (let i = 0; i < live.length; i++) {
    const b = live[i];
    b.vx += a0.ax[i] * dt * 0.5;
    b.vy += a0.ay[i] * dt * 0.5;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }

  const a1 = accelerations(live);
  for (let i = 0; i < live.length; i++) {
    const b = live[i];
    b.vx += a1.ax[i] * dt * 0.5;
    b.vy += a1.ay[i] * dt * 0.5;
  }
}

export function accelAt(x, y, massive) {
  let ax = 0;
  let ay = 0;
  for (const b of massive) {
    const dx = b.x - x;
    const dy = b.y - y;
    const r2 = dx * dx + dy * dy + EPS2;
    const inv = 1 / Math.sqrt(r2);
    const s = G * b.mass * inv * inv * inv;
    ax += s * dx;
    ay += s * dy;
  }
  return { ax, ay };
}

export function stepTracers(tracers, massive, dt = DT) {
  for (const t of tracers) {
    const a0 = accelAt(t.x, t.y, massive);
    t.vx += a0.ax * dt * 0.5;
    t.vy += a0.ay * dt * 0.5;
    t.x += t.vx * dt;
    t.y += t.vy * dt;
    const a1 = accelAt(t.x, t.y, massive);
    t.vx += a1.ax * dt * 0.5;
    t.vy += a1.ay * dt * 0.5;
  }
}

export function barycenter(bodies) {
  let m = 0;
  let x = 0;
  let y = 0;
  for (const b of bodies) {
    m += b.mass;
    x += b.x * b.mass;
    y += b.y * b.mass;
  }
  if (m === 0) return { x: 0, y: 0, mass: 0 };
  return { x: x / m, y: y / m, mass: m };
}

export function energy(bodies) {
  let kinetic = 0;
  let potential = 0;

  for (let i = 0; i < bodies.length; i++) {
    const bi = bodies[i];
    kinetic += 0.5 * bi.mass * (bi.vx * bi.vx + bi.vy * bi.vy);
    for (let j = i + 1; j < bodies.length; j++) {
      const bj = bodies[j];
      const dx = bj.x - bi.x;
      const dy = bj.y - bi.y;
      const r = Math.sqrt(dx * dx + dy * dy + EPS2);
      potential -= (G * bi.mass * bj.mass) / r;
    }
  }

  return { kinetic, potential, total: kinetic + potential };
}

export function circularVelocity(radius, hostMass = 1) {
  return Math.sqrt((G * hostMass) / radius);
}

export function placeOnOrbit({ a, angle, mass, hostMass = 1, ...rest }) {
  const x = a * Math.cos(angle);
  const y = a * Math.sin(angle);
  const v = circularVelocity(a, hostMass);
  return {
    x,
    y,
    vx: -Math.sin(angle) * v,
    vy: Math.cos(angle) * v,
    mass,
    a,
    ...rest,
  };
}

export function ellipseSpeed(r, a, hostMass = 1) {
  return Math.sqrt(G * hostMass * (2 / r - 1 / a));
}
