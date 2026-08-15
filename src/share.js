export function readHash() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

export function encodeState(state) {
  const payload = {
    v: 2,
    z: Number(state.zoom.toFixed(4)),
    w: state.warp,
    vew: state.view,
    f: state.follow,
    t: Number(state.time.toFixed(4)),
    b: state.bodies.map((b) => ({
      id: b.id,
      name: b.name,
      x: round(b.x),
      y: round(b.y),
      vx: round(b.vx),
      vy: round(b.vy),
      mass: b.mass,
      color: b.color,
      size: b.size,
      kind: b.kind,
      a: b.a,
      period: b.period,
      role: b.role,
      blurb: b.blurb,
      didYouKnow: b.didYouKnow,
      live: b.live,
      rings: b.rings,
    })),
  };
  return `#${encodeURIComponent(JSON.stringify(payload))}`;
}

export function bodiesFromPayload(payload) {
  if (!Array.isArray(payload?.b)) return null;
  return payload.b;
}

export async function copyShareURL(state) {
  const hash = encodeState(state);
  const url = `${window.location.origin}${window.location.pathname}${hash}`;
  window.history.replaceState(null, "", hash);
  await navigator.clipboard.writeText(url);
  return url;
}

function round(n) {
  return Number(n.toFixed(6));
}
