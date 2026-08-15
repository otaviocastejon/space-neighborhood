import { t } from "./i18n.js";

export class Renderer {
  constructor(space, stars, overlay) {
    this.space = space;
    this.stars = stars;
    this.overlay = overlay;
    this.sctx = space.getContext("2d");
    this.xctx = stars.getContext("2d");
    this.octx = overlay.getContext("2d");
    this.starfield = [];
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.pixelsPerUnit = 1;
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    for (const canvas of [this.space, this.stars, this.overlay]) {
      canvas.width = Math.floor(this.width * this.dpr);
      canvas.height = Math.floor(this.height * this.dpr);
    }

    this.sctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.xctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.octx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.seedStars();
    this.drawStars();
    this.clearSpace();
  }

  seedStars() {
    const count = Math.floor((this.width * this.height) / 2800);
    this.starfield = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      r: Math.random() * 1.1 + 0.15,
      a: Math.random() * 0.45 + 0.08,
    }));
  }

  drawStars() {
    const ctx = this.xctx;
    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, this.width, this.height);
    for (const s of this.starfield) {
      ctx.fillStyle = `rgba(232,230,223,${s.a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    const g = ctx.createRadialGradient(
      this.width * 0.5,
      this.height * 0.5,
      Math.min(this.width, this.height) * 0.2,
      this.width * 0.5,
      this.height * 0.5,
      Math.max(this.width, this.height) * 0.7
    );
    g.addColorStop(0, "rgba(5,5,8,0)");
    g.addColorStop(1, "rgba(5,5,8,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  clearSpace() {
    this.sctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.sctx.clearRect(0, 0, this.width, this.height);
  }

  scale(view, zoom) {
    const span = Math.min(this.width, this.height);
    this.pixelsPerUnit = (span / view) * zoom;
  }

  worldToScreen(x, y, cam) {
    return {
      x: (x - cam.x) * this.pixelsPerUnit + this.width / 2 + cam.panX,
      y: (cam.y - y) * this.pixelsPerUnit + this.height / 2 + cam.panY,
    };
  }

  screenToWorld(sx, sy, cam) {
    return {
      x: (sx - this.width / 2 - cam.panX) / this.pixelsPerUnit + cam.x,
      y: cam.y - (sy - this.height / 2 - cam.panY) / this.pixelsPerUnit,
    };
  }

  hitTest(sx, sy, bodies, cam, opts = {}) {
    const pad = opts.generous ? 18 : 14;
    let best = null;
    let bestScore = Infinity;
    for (const b of bodies) {
      if (b.kind === "moon" && this.pixelsPerUnit < 50) continue;
      const p = this.worldToScreen(b.x, b.y, cam);
      const r = Math.max(b.size + pad, opts.generous ? 22 : 20);
      const d = Math.hypot(p.x - sx, p.y - sy);
      if (d >= r) continue;
      const rank = b.kind === "star" ? 0 : b.kind === "planet" ? 1 : 2;
      const score = d + rank * 4;
      if (score < bestScore) {
        best = b;
        bestScore = score;
      }
    }
    return best;
  }

  drawTrails(tracers, cam, enabled) {
    const ctx = this.sctx;
    if (!enabled) return;
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalCompositeOperation = "lighter";
    for (const t of tracers) {
      if (t.kind === "asteroid") continue;
      const p = this.worldToScreen(t.x, t.y, cam);
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
      glow.addColorStop(0, hexAlpha(t.color, 0.9));
      glow.addColorStop(1, hexAlpha(t.color, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  drawOverlay(state, cam) {
    const ctx = this.octx;
    ctx.clearRect(0, 0, this.width, this.height);

    const sun = state.bodies.find((b) => b.kind === "star") || { x: 0, y: 0 };
    if (state.flags.orbits && state.bodies.filter((b) => b.kind === "star").length === 1) {
      ctx.strokeStyle = "rgba(232,230,223,0.08)";
      ctx.lineWidth = 1;
      for (const b of state.bodies) {
        if (!b.a) continue;
        if (state.spotlight && !state.spotlight.includes(b.id)) continue;
        const c = this.worldToScreen(sun.x, sun.y, cam);
        ctx.beginPath();
        ctx.arc(c.x, c.y, b.a * this.pixelsPerUnit, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    this.drawLineup(ctx, state, cam);
    this.drawShadow(ctx, state, cam);

    if (state.selected === "belt" && !state.spotlight) {
      const c = this.worldToScreen(sun.x, sun.y, cam);
      ctx.strokeStyle = "rgba(78,205,196,0.35)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 6]);
      ctx.beginPath();
      ctx.arc(c.x, c.y, 2.7 * this.pixelsPerUnit, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (state.flags.orbits) {
      const earth = state.bodies.find((b) => b.id === "earth");
      const moon = state.bodies.find((b) => b.id === "moon");
      if (earth && moon && this.pixelsPerUnit > 40) {
        const e = this.worldToScreen(earth.x, earth.y, cam);
        ctx.strokeStyle = "rgba(232,230,223,0.16)";
        ctx.beginPath();
        ctx.arc(e.x, e.y, moon.radius * this.pixelsPerUnit, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (state.flags.asteroids && !state.spotlight) {
      for (const t of state.tracers) {
        if (t.kind !== "asteroid") continue;
        const p = this.worldToScreen(t.x, t.y, cam);
        ctx.fillStyle = state.selected === "belt" ? "rgba(232,230,223,0.9)" : "rgba(180,175,165,0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, t.size + (state.selected === "belt" ? 0.6 : 0), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const showLabels = state.flags.labels || Boolean(state.spotlight);
    for (const b of state.bodies) {
      const lit = !state.spotlight || state.spotlight.includes(b.id);
      ctx.globalAlpha = lit ? 1 : 0.12;
      const p = this.worldToScreen(b.x, b.y, cam);
      if (b.rings) this.drawRings(ctx, p, b.size);
      this.drawBody(ctx, p, b, state.selected === b.id);
      if (showLabels && lit) {
        if (b.kind === "moon" && this.pixelsPerUnit < 50 && !state.spotlight) continue;
        ctx.fillStyle = state.selected === b.id ? "rgba(78,205,196,0.95)" : "rgba(232,230,223,0.72)";
        ctx.font = "11px 'Avenir Next', 'Segoe UI', sans-serif";
        ctx.fillText(b.name, p.x + b.size + 8, p.y + 4);
      }
      ctx.globalAlpha = 1;
    }

    this.drawSunCue(ctx, sun, cam);
  }

  drawLineup(ctx, state, cam) {
    if (!state.lineup?.length) return;
    const pts = state.lineup
      .map((id) => state.bodies.find((b) => b.id === id) || state.tracers.find((t) => t.id === id))
      .filter(Boolean)
      .map((b) => this.worldToScreen(b.x, b.y, cam));
    if (pts.length < 2) return;
    ctx.save();
    ctx.strokeStyle = "rgba(78,205,196,0.55)";
    ctx.lineWidth = 1.6;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  drawShadow(ctx, state, cam) {
    if (!state.shadow) return;
    const sun = state.bodies.find((b) => b.id === "sun");
    const earth = state.bodies.find((b) => b.id === "earth");
    const moon = state.bodies.find((b) => b.id === "moon");
    if (!sun || !earth || !moon) return;
    const s = this.worldToScreen(sun.x, sun.y, cam);
    const e = this.worldToScreen(earth.x, earth.y, cam);
    const m = this.worldToScreen(moon.x, moon.y, cam);

    ctx.save();
    ctx.strokeStyle = "rgba(255, 207, 107, 0.22)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    if (state.shadow === "lunar") ctx.lineTo(e.x, e.y);
    else ctx.lineTo(m.x, m.y);
    ctx.stroke();
    ctx.restore();

    const cone = (from, toward, reach, halfNear, halfFar, fill) => {
      const dx = toward.x - from.x;
      const dy = toward.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(from.x - uy * halfNear, from.y + ux * halfNear);
      ctx.lineTo(from.x + uy * halfNear, from.y - ux * halfNear);
      ctx.lineTo(from.x + ux * reach + uy * halfFar, from.y + uy * reach - ux * halfFar);
      ctx.lineTo(from.x + ux * reach - uy * halfFar, from.y + uy * reach + ux * halfFar);
      ctx.closePath();
      ctx.fill();
    };

    if (state.shadow === "lunar") {
      const reach = Math.hypot(m.x - e.x, m.y - e.y) + 36;
      cone(e, m, reach, earth.size, earth.size * 1.6, "rgba(8, 8, 16, 0.45)");
    } else {
      const reach = Math.hypot(e.x - m.x, e.y - m.y) + 28;
      cone(m, e, reach, moon.size, moon.size * 1.8, "rgba(8, 8, 16, 0.4)");
    }
  }

  drawSunCue(ctx, sun, cam) {
    const p = this.worldToScreen(sun.x, sun.y, cam);
    const m = 36;
    if (p.x >= m && p.x <= this.width - m && p.y >= m && p.y <= this.height - m) return;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const dx = p.x - cx;
    const dy = p.y - cy;
    const ts = [];
    if (dx > 0) ts.push((this.width - m - cx) / dx);
    else if (dx < 0) ts.push((m - cx) / dx);
    if (dy > 0) ts.push((this.height - m - cy) / dy);
    else if (dy < 0) ts.push((m - cy) / dy);
    const t = Math.min(...ts.filter((n) => n > 0));
    if (!Number.isFinite(t)) return;
    const x = cx + dx * t;
    const y = cy + dy * t;
    const ang = Math.atan2(dy, dx);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.fillStyle = "#ffcf6b";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-6, 7);
    ctx.lineTo(-6, -7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#ffcf6b";
    ctx.font = "11px 'Avenir Next', 'Segoe UI', sans-serif";
    const labelX = x + (x < cx ? 14 : -36);
    const labelY = y + (y < cy ? 16 : -10);
    ctx.fillText(t("sunCue"), labelX, labelY);
  }

  drawBody(ctx, p, b, selected) {
    const glowR = b.size * (b.kind === "star" ? 4.2 : 2.6);
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
    glow.addColorStop(0, hexAlpha(b.color, b.kind === "star" ? 1 : 0.95));
    glow.addColorStop(0.35, hexAlpha(b.color, 0.35));
    glow.addColorStop(1, hexAlpha(b.color, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, b.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(p.x - b.size * 0.25, p.y - b.size * 0.25, Math.max(1, b.size * 0.22), 0, Math.PI * 2);
    ctx.fill();

    if (selected) {
      ctx.strokeStyle = "rgba(78,205,196,0.95)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, b.size + 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawRings(ctx, p, size) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(1, 0.38);
    ctx.strokeStyle = "rgba(232, 210, 160, 0.55)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(232, 210, 160, 0.28)";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  snapshot() {
    const out = document.createElement("canvas");
    out.width = this.space.width;
    out.height = this.space.height;
    const ctx = out.getContext("2d");
    ctx.drawImage(this.stars, 0, 0);
    ctx.drawImage(this.space, 0, 0);
    ctx.drawImage(this.overlay, 0, 0);
    return out;
  }
}

function hexAlpha(hex, a) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
