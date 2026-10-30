const ROOT = new URL("../", document.currentScript.src);

function pageHref(path) {
  return new URL(path, ROOT).href;
}

if (/\/index\.html$/i.test(window.location.pathname)) {
  const clean = window.location.pathname.replace(/index\.html$/i, "");
  window.location.replace(clean + window.location.search + window.location.hash);
}

const NAV = [
  { href: pageHref("./"), id: "home", label: "Home" },
  {
    href: pageHref("about/"),
    id: "about",
    label: "About",
    children: [
      { href: pageHref("team/"), id: "team", label: "Meet the Team" },
      { href: pageHref("clientele/"), id: "clientele", label: "Clientele" },
      { href: pageHref("community/"), id: "community", label: "Community Service" }
    ]
  },
  { href: pageHref("services/"), id: "services", label: "Services" },
  { href: pageHref("demos/"), id: "demos", label: "Demos" },
  { href: pageHref("awards/"), id: "awards", label: "Awards" },
  { href: pageHref("press/"), id: "press", label: "Press" },
  { href: pageHref("blog/"), id: "blog", label: "Blog" },
  { href: pageHref("contact/"), id: "contact", label: "Contact" }
];

let logoCount = 0;
function logoMarkup() {
  logoCount += 1;
  const id = `mark${logoCount}`;
  return `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <defs>
    <radialGradient id="${id}" cx="36%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#ffe0b0"/>
      <stop offset="42%" stop-color="#ff6a32"/>
      <stop offset="100%" stop-color="#8d1c16"/>
    </radialGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="#2a0c10" stroke="rgba(232,196,141,.45)"/>
  <circle cx="32" cy="32" r="21" fill="url(#${id})"/>
  <ellipse cx="26" cy="27" rx="1.5" ry="2.5" fill="#3b120c" transform="rotate(-20 26 27)"/>
  <ellipse cx="34" cy="25" rx="1.4" ry="2.3" fill="#3b120c" transform="rotate(16 34 25)"/>
  <ellipse cx="30" cy="34" rx="1.5" ry="2.4" fill="#3b120c"/>
  <ellipse cx="37" cy="33" rx="1.3" ry="2.1" fill="#3b120c" transform="rotate(8 37 33)"/>
</svg>`;
}

function pageId() {
  return document.body.dataset.page || "home";
}

function linkClass(id) {
  const current = pageId();
  if (id === current) return "is-active";
  const parent = NAV.find((item) => item.children && item.children.some((child) => child.id === current));
  if (parent && parent.id === id) return "is-active";
  return "";
}

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const links = NAV.map((item) => {
    if (!item.children) {
      return `<a href="${item.href}" class="${linkClass(item.id)}">${item.label}</a>`;
    }
    const kids = item.children.map((child) => `<a href="${child.href}" class="${linkClass(child.id)}">${child.label}</a>`).join("");
    return `<div class="has-sub"><a href="${item.href}" class="${linkClass(item.id)}">${item.label}</a><div class="sub">${kids}</div></div>`;
  }).join("");

  mount.innerHTML = `
    <a class="skip" href="#content">Skip to content</a>
    <div class="progress" id="progress"></div>
    <header class="header">
      <div class="header-inner">
        <a class="brand" href="${pageHref("./")}">${logoMarkup()}<span class="brand-name">Passion Fruit<small>Voiceovers</small></span></a>
        <nav class="nav" id="nav">${links}</nav>
        <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false"><span></span></button>
      </div>
    </header>`;
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  mount.innerHTML = `
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <a class="brand" href="${pageHref("./")}">${logoMarkup()}<span class="brand-name">Passion Fruit<small>Voiceovers</small></span></a>
          <p class="muted">Providing your organization’s voice is our passion. A full-service voice over studio in Atlanta.</p>
        </div>
        <div>
          <strong>Studio</strong>
          <div><a href="${pageHref("services/")}">Services</a></div>
          <div><a href="${pageHref("demos/")}">Demos</a></div>
          <div><a href="${pageHref("team/")}">Meet the team</a></div>
          <div><a href="${pageHref("clientele/")}">Clientele</a></div>
        </div>
        <div>
          <strong>Visit</strong>
          <div><a href="tel:7709921437">770-992-1437</a></div>
          <div>Fax 770-992-1432</div>
          <div>Atlanta, GA · US EST</div>
          <div><a href="${pageHref("contact/")}">Contact us</a></div>
          <div><a href="${pageHref("privacy/")}">Privacy policy</a></div>
        </div>
      </div>
      <p class="legal">© Passion Fruit Voiceovers. All rights reserved.</p>
    </footer>`;
}

function initMenu() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (!burger || !nav) return;
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a") && window.matchMedia("(max-width: 980px)").matches) {
      document.body.classList.remove("nav-open");
    }
  });
}

function initScroll() {
  const header = document.querySelector(".header");
  const bar = document.getElementById("progress");
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 8);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initReveal() {
  document.documentElement.classList.add("js");
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach((node) => node.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  nodes.forEach((node) => io.observe(node));
}

function initCounters() {
  const nodes = document.querySelectorAll("[data-count]");
  if (!nodes.length) return;
  const tick = (node) => {
    const target = Number(node.dataset.count);
    const suffix = node.dataset.suffix || "";
    const start = performance.now();
    const run = (now) => {
      const p = Math.min(1, (now - start) / 1100);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        tick(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  nodes.forEach((node) => io.observe(node));
}

function initType() {
  const el = document.getElementById("type-line");
  if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (el) el.textContent = "Providing your organization’s voice is our passion.";
    return;
  }
  const lines = [
    "Providing your organization’s voice is our passion.",
    "The smart voice for smart technology.",
    "A human touch for an automated world.",
    "Take a look behind the mic."
  ];
  let line = 0;
  let char = 0;
  let deleting = false;
  const step = () => {
    const text = lines[line];
    char += deleting ? -1 : 1;
    el.innerHTML = `${text.slice(0, char)}<i class="caret"></i>`;
    let delay = deleting ? 28 : 48;
    if (!deleting && char === text.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && char === 0) {
      deleting = false;
      line = (line + 1) % lines.length;
      delay = 360;
    }
    setTimeout(step, delay);
  };
  step();
}

function initWave() {
  const canvas = document.getElementById("wave");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let t = 0;
  const resize = () => {
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
  };
  resize();
  window.addEventListener("resize", resize);
  const draw = () => {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const lines = [
      { amp: 26 * dpr, freq: 0.007, speed: 0.9, color: "rgba(255,92,50,0.45)" },
      { amp: 16 * dpr, freq: 0.012, speed: 1.25, color: "rgba(232,196,141,0.35)" },
      { amp: 10 * dpr, freq: 0.02, speed: 1.7, color: "rgba(246,239,230,0.22)" }
    ];
    lines.forEach((line) => {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const y = h * 0.55
          + Math.sin(x * line.freq + t * line.speed) * line.amp
          + Math.sin(x * 0.0025 + t * 0.6) * 8 * dpr;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();
    });
    t += 0.016;
    if (!reduce) requestAnimationFrame(draw);
  };
  draw();
}

function initAudio() {
  const cards = document.querySelectorAll("[data-audio]");
  let active = null;
  cards.forEach((card) => {
    const button = card.querySelector(".play");
    const audio = card.querySelector("audio");
    if (!button || !audio) return;
    const setIcon = (playing) => {
      button.innerHTML = playing
        ? `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.2" height="12" rx="1" fill="currentColor"/><rect x="9.6" y="2" width="3.2" height="12" rx="1" fill="currentColor"/></svg>`
        : `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l10-5.5L4 2.5z" fill="currentColor"/></svg>`;
      button.setAttribute("aria-label", playing ? "Pause demo" : "Play demo");
    };
    setIcon(false);
    button.addEventListener("click", () => {
      if (active && active !== audio) {
        active.pause();
        active.closest("[data-audio]")?.classList.remove("is-playing");
        const other = active.closest("[data-audio]")?.querySelector(".play");
        if (other) {
          other.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l10-5.5L4 2.5z" fill="currentColor"/></svg>`;
        }
      }
      if (audio.paused) {
        const pending = audio.play();
        card.classList.add("is-playing");
        setIcon(true);
        active = audio;
        if (pending && typeof pending.catch === "function") {
          pending.catch(() => {
            card.classList.remove("is-playing");
            setIcon(false);
            if (active === audio) active = null;
          });
        }
      } else {
        audio.pause();
        card.classList.remove("is-playing");
        setIcon(false);
      }
    });
    audio.addEventListener("ended", () => {
      card.classList.remove("is-playing");
      setIcon(false);
    });
  });
}

function initTeam() {
  document.querySelectorAll(".member-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const member = button.closest(".member");
      const open = member.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });
  });
}

function initForm() {
  const form = document.getElementById("quote-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const note = document.getElementById("form-note");
    if (note) {
      note.innerHTML = `<strong>Message ready.</strong> Call <a href="tel:7709921437">770-992-1437</a> or fax 770-992-1432 and share this note:<br><br>${escapeHtml(data.get("name"))} · ${escapeHtml(data.get("email"))}<br>${escapeHtml(data.get("company") || "Independent")} · ${escapeHtml(data.get("service"))}<br>${escapeHtml(data.get("message"))}`;
      note.classList.add("show");
    }
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function normalizePath(pathname) {
  let path = pathname.replace(/\/index\.html$/i, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

function isSitePage(url) {
  const rootPath = new URL(ROOT).pathname;
  if (url.origin !== window.location.origin || !url.pathname.startsWith(rootPath)) return false;
  const relative = url.pathname.slice(rootPath.length);
  return !/\.(css|js|svg|png|jpe?g|gif|webp|mp3|mp4|wav|pdf)$/i.test(relative);
}

function initTransitions() {
  let leaving = false;
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || link.target || link.hasAttribute("download") || leaving) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const url = new URL(link.href, window.location.href);
    if (!isSitePage(url)) return;
    if (normalizePath(url.pathname) === normalizePath(window.location.pathname)) {
      if (!url.hash) event.preventDefault();
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    leaving = true;
    document.body.classList.add("is-leaving");
    window.setTimeout(() => { window.location.href = url.href; }, 260);
  });
}

renderHeader();
renderFooter();
initMenu();
initScroll();
initReveal();
initCounters();
initType();
initWave();
initAudio();
initTeam();
initForm();
initTransitions();

(function addOptionsBackLink() {
  if (document.querySelector("[data-options-back]")) return;
  const a = document.createElement("a");
  a.dataset.optionsBack = "1";
  a.href = new URL("../", ROOT).href;
  a.textContent = "← All options";
  a.setAttribute("style", "position:fixed;top:14px;left:14px;z-index:9999;background:rgba(0,0,0,.7);color:#ff8a5c;padding:8px 12px;border-radius:999px;font:600 12px Figtree,system-ui,sans-serif;text-decoration:none;backdrop-filter:blur(8px)");
  document.body.appendChild(a);
})();
