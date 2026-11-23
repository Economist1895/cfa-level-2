/* CFA L2 Quick Notes — shared behaviour (home + module pages). No dependencies besides KaTeX. */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const root = document.body.dataset.root || "";
  const CAT = window.CATALOG || [];

  /* ---------- Theme toggle ---------- */
  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  };
  const paintToggle = () => $$(".theme-toggle").forEach(b => { b.innerHTML = isDark() ? sun : moon; b.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode"); });
  $$(".theme-toggle").forEach(b => b.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintToggle();
  }));
  paintToggle();

  /* Maths is pre-rendered at build time (tools/render-math.mjs) — no KaTeX JS at runtime. */

  /* ---------- Module page ---------- */
  const code = document.body.dataset.module;
  if (code) {
    // locate in catalog
    let vol, idx, flat = [];
    CAT.forEach(v => v.modules.forEach((m, i) => {
      flat.push({ ...m, vol: v });
      if (m.code === code) { vol = v; idx = i; }
    }));

    // eyebrow
    if (vol) $$("[data-fill=eyebrow]").forEach(e => e.textContent = `Vol ${vol.n} · ${vol.title} · Module ${idx + 1}`);

    // meta pills: formulas + read time (≈230 wpm skim, +12s per formula)
    const main = $("main");
    const clone = main.cloneNode(true);
    $$(".katex, .f-math", clone).forEach(n => n.remove());
    const words = (clone.textContent || "").split(/\s+/).filter(Boolean).length;
    const nF = $$(".f-card", main).length;
    const mins = Math.max(1, Math.round(words / 230 + nF / 5));
    const meta = $(".meta");
    if (meta) meta.insertAdjacentHTML("afterbegin",
      `<span class="pill">⏱ ~${mins} min read</span><span class="pill">ƒ ${nF} formulas</span>`);

    // jump chips from sections
    const chips = $(".chips");
    if (chips) chips.innerHTML = $$(".sec[id]", main).map(s =>
      `<a href="#${s.id}">${s.dataset.chip || $("h2", s).textContent.replace(/^\s*\d+\s*/, "")}</a>`).join("");

    // top bar title fade + progress bar
    const bar = $(".topbar"), prog = $(".progress"), h1 = $("h1");
    const onScroll = () => {
      const st = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      if (prog) prog.style.width = (max > 0 ? Math.min(100, st / max * 100) : 0) + "%";
      if (bar && h1) bar.classList.toggle("scrolled", h1.getBoundingClientRect().bottom < 54);
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // prev / next (only across ready modules)
    const ready = flat.filter(m => m.status === "ready");
    const pos = ready.findIndex(m => m.code === code);
    const pager = $(".pager");
    if (pager) {
      const cell = (m, cls, lbl) => m
        ? `<a class="${cls}" href="${root}${m.href}"><small>${lbl}</small><b>${m.title}</b></a>`
        : `<i></i>`;
      const prev = ready[pos - 1], next = ready[pos + 1];
      if (prev || next) pager.innerHTML = cell(prev, "prev", "← Previous") + cell(next, "next", "Next →");
      else pager.remove();
    }
  }

  /* ---------- Home page ---------- */
  const list = $("#volumes");
  if (list) {
    const chev = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>';
    const total = CAT.reduce((a, v) => a + v.modules.length, 0);
    $("#stat-mods").textContent = `${total} modules`;

    // remember which volumes the user left open (collapsed by default)
    let opened = [];
    try { opened = JSON.parse(localStorage.getItem("openVols") || "[]"); } catch (e) {}

    list.innerHTML = CAT.map(v => {
      const rows = v.modules.map((m, i) => {
        const hay = (m.title + " " + (m.tags || "") + " " + v.title).toLowerCase();
        const inner = `<span class="mi">${i + 1}</span><span class="mt">${m.title}</span>` +
          `<span class="ms">${m.status === "ready" ? (m.mins ? m.mins + " min" : "Read") + " →" : "soon"}</span>`;
        return `<li class="${m.status === "ready" ? "ready" : "soon"}" data-hay="${hay.replace(/"/g, "")}">` +
          (m.status === "ready" ? `<a href="${root}${m.href}">${inner}</a>` : `<span>${inner}</span>`) + "</li>";
      }).join("");
      return `<details class="vol" data-vol="${v.n}" ${opened.includes(v.n) ? "open" : ""}>
        <summary><span class="vnum">${v.n}</span>
          <span><div class="vtitle">${v.title}</div>
          <div class="vsub">${v.modules.length} modules</div></span>${chev}</summary>
        <ul class="mods">${rows}</ul></details>`;
    }).join("");

    // search filter (temporarily opens matching volumes; restores afterwards)
    const q = $("#q"), empty = $(".empty");
    let searching = false;
    $$(".vol").forEach(d => d.addEventListener("toggle", () => {
      if (searching) return;
      const open = $$(".vol").filter(x => x.open).map(x => +x.dataset.vol);
      try { localStorage.setItem("openVols", JSON.stringify(open)); } catch (e) {}
    }));
    q && q.addEventListener("input", () => {
      const term = q.value.trim().toLowerCase();
      searching = true;
      if (!term) { try { opened = JSON.parse(localStorage.getItem("openVols") || "[]"); } catch (e) {} }
      let any = false;
      $$(".vol").forEach(d => {
        let hit = 0;
        $$("li", d).forEach(li => {
          const ok = !term || term.split(/\s+/).every(t => li.dataset.hay.includes(t));
          li.style.display = ok ? "" : "none"; if (ok) hit++;
        });
        d.style.display = hit ? "" : "none";
        d.open = term ? hit > 0 : opened.includes(+d.dataset.vol);
        if (hit) any = true;
      });
      if (empty) empty.style.display = any ? "none" : "block";
      setTimeout(() => { searching = false; }, 0); // toggle events fire async
    });
  }
})();
