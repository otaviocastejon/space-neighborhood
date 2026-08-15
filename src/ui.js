import { bodyFacts, followable, missionFacts } from "./learn.js";
import { topicFor } from "./solar.js";
import { applyStaticI18n, getLocale, setLocale, t } from "./i18n.js";

export const SPEEDS = [
  { n: 1, warp: 8 },
  { n: 2, warp: 28 },
  { n: 3, warp: 360 },
];

export function mountUI(handlers) {
  const viewsEl = document.getElementById("views");
  const speedsEl = document.getElementById("speeds");
  const pauseBtn = document.getElementById("speed-pause");
  const menu = document.getElementById("menu");
  const menuBtn = document.getElementById("btn-menu");
  const timeEl = document.getElementById("time");
  const followEl = document.getElementById("follow-flag");
  const hint = document.getElementById("hint");
  const toast = document.getElementById("toast");
  const card = document.getElementById("card");
  const cardRole = document.getElementById("card-role");
  const cardName = document.getElementById("card-name");
  const cardBlurb = document.getElementById("card-blurb");
  const cardKnow = document.getElementById("card-know");
  const cardStats = document.getElementById("card-stats");
  const eventEl = document.getElementById("event");

  applyStaticI18n();

  document.getElementById("btn-share").addEventListener("click", handlers.onShare);
  document.getElementById("btn-png").addEventListener("click", handlers.onPng);
  document.getElementById("btn-reset").addEventListener("click", handlers.onReset);

  menuBtn.addEventListener("click", () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? t("hide") : t("menu");
  });

  pauseBtn.addEventListener("click", handlers.onPause);

  for (const speed of SPEEDS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "speed-btn";
    btn.dataset.n = String(speed.n);
    for (let i = 0; i < speed.n; i++) {
      const pip = document.createElement("span");
      pip.className = "pip";
      btn.appendChild(pip);
    }
    btn.addEventListener("click", () => handlers.onSpeed(speed.n));
    speedsEl.appendChild(btn);
  }

  for (const input of menu.querySelectorAll("input[data-flag]")) {
    input.addEventListener("change", () => {
      handlers.onToggle(input.dataset.flag, input.checked);
    });
  }

  for (const btn of menu.querySelectorAll("[data-learn]")) {
    btn.addEventListener("click", () => handlers.onLearn(btn.dataset.learn));
  }

  for (const btn of document.querySelectorAll("[data-lang]")) {
    btn.addEventListener("click", () => {
      setLocale(btn.dataset.lang);
      handlers.onLocale?.();
    });
  }

  function speedMeta(n) {
    return t(`speeds.${n}`);
  }

  function refreshSpeedLabels() {
    for (const btn of speedsEl.querySelectorAll(".speed-btn")) {
      const meta = speedMeta(btn.dataset.n);
      btn.title = `${meta.label} · ${meta.hint}`;
      btn.setAttribute("aria-label", meta.label);
    }
    pauseBtn.setAttribute("aria-label", t("pause"));
    pauseBtn.setAttribute("title", t("pause"));
  }

  function setViewButtons(active) {
    viewsEl.innerHTML = "";
    for (const item of handlers.views) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = t(`views.${item.id}`);
      btn.dataset.id = item.id;
      if (item.id === active) btn.classList.add("active");
      btn.addEventListener("click", () => handlers.onView(item.id));
      viewsEl.appendChild(btn);
    }
  }

  function markView(id) {
    for (const btn of viewsEl.querySelectorAll("button")) {
      btn.classList.toggle("active", btn.dataset.id === id);
    }
  }

  function setFlags(flags) {
    for (const input of menu.querySelectorAll("input[data-flag]")) {
      input.checked = Boolean(flags[input.dataset.flag]);
    }
  }

  function applyI18n() {
    applyStaticI18n();
    refreshSpeedLabels();
    const active = viewsEl.querySelector("button.active")?.dataset.id || "system";
    setViewButtons(active);
    menuBtn.textContent = menu.hidden ? t("menu") : t("hide");
  }

  function update(state) {
    const years = Math.floor(state.time);
    const days = Math.floor((state.time - years) * 365.25);
    timeEl.textContent = t("time", { y: years, d: days });
    const followed = followable(state, state.follow);
    followEl.textContent = followed ? t("watching", { name: followed.name }) : t("looking");
    hint.classList.toggle("visible", !state.lesson && state.time < 1.2 && state.selected === "system" && menu.hidden);

    pauseBtn.classList.toggle("active", state.paused);
    for (const btn of speedsEl.querySelectorAll(".speed-btn")) {
      const speed = SPEEDS.find((s) => String(s.n) === btn.dataset.n);
      btn.classList.toggle("active", !state.paused && speed?.warp === state.warp);
    }

    for (const btn of menu.querySelectorAll("[data-learn]")) {
      btn.classList.toggle("active", btn.dataset.learn === state.lesson);
    }

    eventEl.hidden = true;

    const topic = topicFor(state);
    card.hidden = false;
    cardRole.textContent = topic.role || "";
    cardName.textContent = topic.name;
    cardBlurb.textContent = topic.blurb || "";
    if (topic.didYouKnow) {
      cardKnow.hidden = false;
      cardKnow.textContent = topic.didYouKnow;
    } else {
      cardKnow.hidden = true;
      cardKnow.textContent = "";
    }
    const earth = state.bodies.find((b) => b.id === "earth");
    const rows = topic.facts
      ? topic.facts
      : topic.kind === "ship"
        ? missionFacts(state)
        : bodyFacts(topic, earth);
    cardStats.innerHTML = rows
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
      .join("");
  }

  function closeMenu() {
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = t("menu");
  }

  function isMenuOpen() {
    return !menu.hidden;
  }

  let toastTimer = 0;
  function showToast(message) {
    toast.hidden = false;
    toast.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  }

  refreshSpeedLabels();

  return {
    setViewButtons,
    markView,
    setFlags,
    update,
    showToast,
    closeMenu,
    isMenuOpen,
    applyI18n,
    SPEEDS,
    getLocale,
  };
}

export function nearestSpeed(warp) {
  let best = SPEEDS[1];
  let dist = Infinity;
  for (const speed of SPEEDS) {
    const d = Math.abs(speed.warp - warp);
    if (d < dist) {
      dist = d;
      best = speed;
    }
  }
  return best;
}
