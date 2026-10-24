/* Portfolio script — plain ES6+, no frameworks */
(function () {
  "use strict";

  const TYPED_PHRASES = [
    "LLM applications & RAG",
    "computer vision in production",
    "evaluation & MLOps",
    "cost & latency optimization",
  ];

  const SKILLS = [
    { group: "Models & Research", items: ["PyTorch", "TensorFlow", "Hugging Face", "scikit-learn", "OpenAI / Anthropic APIs", "RAG", "Fine-tuning", "Prompt engineering"] },
    { group: "Engineering & MLOps", items: ["Python", "FastAPI", "Docker", "Kubernetes", "MLflow", "Weights & Biases", "CI/CD", "Testing & eval harnesses"] },
    { group: "Tools & Cloud", items: ["AWS", "GCP", "Postgres", "Redis", "Vector DBs (pgvector, Qdrant)", "GitHub Actions", "Terraform", "Linux"] },
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function safeStorage() { try { return window.localStorage; } catch (e) { return null; } }

  function initTheme() {
    const stored = safeStorage() ? safeStorage().getItem("theme") : null;
    let theme = stored;
    if (!theme) theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    const btn = $("#theme-toggle");
    if (btn) btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    if (btn) {
      btn.addEventListener("click", () => {
        const cur = document.documentElement.getAttribute("data-theme");
        const next = cur === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        btn.setAttribute("aria-pressed", next === "light" ? "true" : "false");
        const ls = safeStorage();
        if (ls) { try { ls.setItem("theme", next); } catch (e) {} }
      });
    }
  }
  const PROJECTS = [
    { id: "rag-support", category: "llm", title: "Support Copilot", tag: "LLM", meta: "2024 · B2B SaaS", result: "Cut median handle time 38% and deflected 22% of tickets.", tags: ["RAG", "FastAPI", "pgvector", "OpenAI"], problem: "Support agents spent ~6 min per ticket searching scattered docs; deflection was near zero.", approach: "Built a retrieval-augmented assistant over 12k internal docs with hybrid search, re-ranking, and a grounded answer format with citations. Added an eval suite of 400 real tickets.", resultDetail: "Median handle time fell from 6.1 to 3.8 min; 22% of tickets auto-resolved; hallucination rate <2% on eval set.", github: "https://github.com/jordanreyes/support-copilot", demo: "#" },
    { id: "vision-qa", category: "vision", title: "Visual QA Inspector", tag: "Vision", meta: "2023 · Manufacturing", result: "99.2% defect detection at 30 fps on edge hardware.", tags: ["YOLOv8", "ONNX", "TensorRT", "Edge"], problem: "Manual inspection missed ~4% of defects and couldn't keep up with line speed.", approach: "Trained a YOLOv8 detector on 40k labeled images, exported to ONNX/TensorRT, deployed on Jetson with a small web dashboard for overrides and active learning.", resultDetail: "Defect escape rate dropped from 4.1% to 0.8%; throughput held at 30 fps; model retrained monthly from override data.", github: "https://github.com/jordanreyes/visual-qa", demo: "#" },
    { id: "agent-orch", category: "llm", title: "Research Agent", tag: "LLM", meta: "2024 · Internal tool", result: "Reduced analyst research time from days to hours.", tags: ["Agents", "LangGraph", "Tools", "Eval"], problem: "Analysts spent 2-3 days per market brief gathering and synthesizing sources.", approach: "Multi-step agent with tool use (search, fetch, extract) and a critic loop; strict budget and citation requirements; offline eval against 60 briefs.", resultDetail: "Briefs produced in ~3 hours with comparable quality; 85% citation accuracy; cost ~$1.20 per brief.", github: "https://github.com/jordanreyes/research-agent", demo: "#" },
    { id: "mlops-platform", category: "mlops", title: "ML Serving Platform", tag: "MLOps", meta: "2022-2024 · Platform", result: "Cut inference cost 40% and deploy time from weeks to days.", tags: ["Kubernetes", "FastAPI", "MLflow", "Terraform"], problem: "Each model team rebuilt serving infra; deploys took weeks and costs ballooned.", approach: "Shared serving platform with autoscaling, canary deploys, model registry, and per-model cost dashboards. Standardized on FastAPI + Triton.", resultDetail: "7 models on one platform; deploy time 3 weeks → 2 days; inference cost -40%; 99.97% uptime.", github: "https://github.com/jordanreyes/ml-platform", demo: "#" },
  ];
  const EXPERIENCE = [
    { role: "Senior AI Engineer", company: "Acme AI", dates: "2022 — Present", bullets: ["Led LLM platform serving 7 models; cut inference cost 40% and deploy time from weeks to days.", "Shipped support copilot deflecting 22% of tickets and cutting handle time 38%.", "Built eval harnesses adopted across 4 product teams."] },
    { role: "ML Engineer", company: "Globex", dates: "2019 — 2022", bullets: ["Deployed defect-detection vision system: 99.2% accuracy at 30 fps on edge.", "Reduced training cost 55% via mixed precision and data pruning.", "Mentored 3 junior engineers; ran weekly ML reading group."] },
    { role: "Data Scientist", company: "Initech", dates: "2017 — 2019", bullets: ["Built churn model lifting retention 9% in A/B test.", "Created feature store and monitoring for 20+ models."] },
  ];
  const TESTIMONIALS = [
    { quote: "Jordan turns messy ML problems into boring, reliable software — which is exactly what we needed.", author: "Priya Shah", role: "VP Engineering, Acme AI" },
    { quote: "The best AI engineer I've worked with. Ships fast, measures everything, and writes code the rest of us can read.", author: "Marcus Lee", role: "Head of Product, Globex" },
    { quote: "Took our defect rate from 4% to under 1% and didn't break the line once.", author: "Dana Ortiz", role: "Operations Director, Manufacturing client" },
  ];
  const WRITING = [
    { title: "Why your RAG eval is lying to you", meta: "2024 · 8 min read", desc: "The metrics that look good and the ones that matter.", link: "#" },
    { title: "Latency budgets for LLM apps", meta: "2024 · 6 min read", desc: "How to set and hit p99 targets without over-engineering.", link: "#" },
    { title: "Edge vision: from notebook to Jetson", meta: "2023 · Talk", desc: "A practical path to deploying vision models on edge hardware.", link: "#" },
  ];
  function debounce(fn, wait) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }
  /* Mobile nav */
  function initMobileNav() {
    const hamburger = $("#hamburger");
    if (!hamburger) return;
    let panel = $(".mobile-nav");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "mobile-nav";
      panel.id = "mobile-nav";
      panel.innerHTML = `<button class="icon-btn mobile-nav__close" type="button" aria-label="Close menu">&times;</button>
        <a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a>
        <a href="#experience">Experience</a><a href="#testimonials">Testimonials</a><a href="#contact">Contact</a>`;
      document.body.appendChild(panel);
    }
    const closeBtn = $(".mobile-nav__close", panel);
    function open() {
      panel.classList.add("is-open"); hamburger.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden";
      const focusable = $$("a, button", panel); if (focusable.length) focusable[0].focus();
      document.addEventListener("keydown", onKey);
    }
    function close() {
      panel.classList.remove("is-open"); hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey); hamburger.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      const focusable = $$("a, button", panel).filter((el) => !el.disabled);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    hamburger.addEventListener("click", () => { panel.classList.contains("is-open") ? close() : open(); });
    closeBtn.addEventListener("click", close);
    $$(".mobile-nav a", panel).forEach((a) => a.addEventListener("click", close));
  }

  /* Typed text */
  function initTyped() {
    const el = $("#typed-text");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = TYPED_PHRASES[0]; return; }
    let phraseIndex = 0, charIndex = 0, deleting = false;
    function tick() {
      const phrase = TYPED_PHRASES[phraseIndex];
      if (deleting) {
        charIndex--; el.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % TYPED_PHRASES.length; setTimeout(tick, 400); return; }
        setTimeout(tick, 40);
      } else {
        charIndex++; el.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) { deleting = true; setTimeout(tick, 1600); return; }
        setTimeout(tick, 70);
      }
    }
    tick();
  }

  /* Canvas neural network */
  function initCanvas() {
    const canvas = $("#hero-canvas");
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    let w, h, nodes = [], mouse = { x: -1000, y: -1000 };
    const NODE_COUNT = 55;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: 1.2 + Math.random() * 1.6 });
      }
    }
    function step() {
      ctx.clearRect(0, 0, w, h);
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      const nodeColor = isDark ? "rgba(245,158,11,0.7)" : "rgba(180,83,9,0.7)";
      const edgeColor = isDark ? "rgba(245,158,11,0.12)" : "rgba(180,83,9,0.12)";
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0) { n.vx += (dx / dist) * 0.02; n.vy += (dy / dist) * 0.02; }
        n.vx *= 0.99; n.vy *= 0.99;
      }
      ctx.strokeStyle = edgeColor; ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 110) { ctx.globalAlpha = 1 - d / 110; ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke(); }
        }
      }
      ctx.globalAlpha = 1; ctx.fillStyle = nodeColor;
      for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); }
      requestAnimationFrame(step);
    }
    resize();
    window.addEventListener("resize", debounce(resize, 200));
    canvas.addEventListener("mousemove", (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    canvas.addEventListener("mouseleave", () => { mouse.x = -1000; mouse.y = -1000; });
    canvas.addEventListener("touchmove", (e) => { const t = e.touches[0]; const r = canvas.getBoundingClientRect(); mouse.x = t.clientX - r.left; mouse.y = t.clientY - r.top; }, { passive: true });
    step();
  }


  /* Reveal on scroll */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /* Count-up metrics */
  function initCountUp() {
    const nums = $$(".proof__num");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseFloat(el.getAttribute("data-count"));
        const duration = 1400;
        const start = performance.now();
        function frame(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = target % 1 === 0 ? Math.round(val) : val.toFixed(1);
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    nums.forEach((n) => io.observe(n));
  }

  /* Active nav highlighting */
  function initActiveNav() {
    const sections = $$("main section[id]");
    const links = $$(".nav__link");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const id = en.target.id;
          links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + id));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  /* Skills render */
  function renderSkills() {
    const root = $("#skills-root");
    if (!root) return;
    root.innerHTML = SKILLS.map((g) => `
      <div class="skill-group reveal">
        <h3 class="skill-group__title">${g.group}</h3>
        <div class="skill-group__chips">
          ${g.items.map((i) => `<span class="skill-chip">${i}</span>`).join("")}
        </div>
      </div>
    `).join("");
  }

  /* Projects render */
  function renderProjects(filter = "all") {
    const grid = $("#projects-grid");
    if (!grid) return;
    const list = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
    grid.innerHTML = list.map((p) => `
      <article class="project-card reveal" data-id="${p.id}" tabindex="0" role="button" aria-label="Open case study: ${p.title}">
        <div class="project-card__head">
          <h3 class="project-card__title">${p.title}</h3>
          <span class="project-card__tag">${p.tag}</span>
        </div>
        <p class="project-card__meta">${p.meta}</p>
        <p class="project-card__result">${p.result}</p>
        <div class="project-card__tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <div class="project-card__links">
          <a href="${p.github}" target="_blank" rel="noopener" onclick="event.stopPropagation()">GitHub</a>
          <a href="${p.demo}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Live demo</a>
        </div>
      </article>
    `).join("");
    initReveal();
    $$(".project-card", grid).forEach((card) => {
      const open = () => openCase(card.getAttribute("data-id"));
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  function openCase(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    const modal = $("#case-modal");
    const body = $("#modal-body");
    body.innerHTML = `
      <p class="eyebrow">${p.tag} · ${p.meta}</p>
      <h2 id="modal-title">${p.title}</h2>
      <p class="project-card__result">${p.result}</p>
      <div class="case__label">Problem</div>
      <p>${p.problem}</p>
      <div class="case__label">Approach</div>
      <p>${p.approach}</p>
      <div class="case__label">Result</div>
      <p>${p.resultDetail}</p>
      <div class="case__label">Tech</div>
      <div class="project-card__tags" style="margin-top:.5rem">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      <div style="margin-top:1.5rem;display:flex;gap:.75rem">
        <a class="btn btn--primary btn--sm" href="${p.github}" target="_blank" rel="noopener">GitHub</a>
        <a class="btn btn--ghost btn--sm" href="${p.demo}" target="_blank" rel="noopener">Live demo</a>
      </div>
    `;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = $(".modal__close", modal);
    if (closeBtn) closeBtn.focus();
    document.addEventListener("keydown", onModalKey);
  }
  function closeCase() {
    const modal = $("#case-modal");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKey);
  }
  function onModalKey(e) { if (e.key === "Escape") closeCase(); }

  function initProjectFilters() {
    $$(".chip--filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".chip--filter").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderProjects(btn.getAttribute("data-filter"));
      });
    });
    const modal = $("#case-modal");
    if (modal) $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeCase));
  }

  function renderExperience() {
    const root = $("#timeline-root");
    if (!root) return;
    root.innerHTML = EXPERIENCE.map((e) => `
      <li class="timeline__item reveal">
        <h3 class="timeline__role">${e.role} <span style="color:var(--text-muted);font-weight:400;font-size:var(--fs-1)">· ${e.company}</span></h3>
        <p class="timeline__meta">${e.dates}</p>
        <ul class="timeline__bullets">
          ${e.bullets.map((b) => `<li>${b}</li>`).join("")}
        </ul>
      </li>
    `).join("");
  }

  function initCarousel() {
    const track = $("#carousel-track");
    const dotsWrap = $("#carousel-dots");
    if (!track) return;
    track.innerHTML = TESTIMONIALS.map((t) => `
      <div class="carousel__slide" role="group" aria-roledescription="slide">
        <p class="carousel__quote">“${t.quote}”</p>
        <p class="carousel__author"><strong>${t.author}</strong> · ${t.role}</p>
      </div>
    `).join("");
    const slides = $$(".carousel__slide", track);
    let index = 0;
    function renderDots() {
      dotsWrap.innerHTML = TESTIMONIALS.map((_, i) => `<button class="carousel__dot ${i === index ? "is-active" : ""}" type="button" aria-label="Go to slide ${i + 1}" data-i="${i}"></button>`).join("");
      $$("button", dotsWrap).forEach((b) => b.addEventListener("click", () => goTo(parseInt(b.getAttribute("data-i"), 10))));
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      const slide = slides[index];
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
      renderDots();
    }
    renderDots();
    const prev = $("#carousel-prev"), next = $("#carousel-next");
    if (prev) prev.addEventListener("click", () => goTo(index - 1));
    if (next) next.addEventListener("click", () => goTo(index + 1));
    track.tabIndex = 0;
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    });
    let startX = 0;
    track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? index + 1 : index - 1);
    });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(() => goTo(index + 1), 6000);
    }
  }

  function renderWriting() {
    const root = $("#writing-grid");
    if (!root) return;
    root.innerHTML = WRITING.map((w) => `
      <article class="writing-card reveal">
        <p class="writing-card__meta">${w.meta}</p>
        <h3 class="writing-card__title"><a href="${w.link}">${w.title}</a></h3>
        <p class="writing-card__desc">${w.desc}</p>
      </article>
    `).join("");
  }

  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;
    const FORM_ENDPOINT = ""; // EDIT: set Formspree/Netlify endpoint, e.g. "https://formspree.io/f/xxxx"
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = $("#name").value.trim();
      const email = $("#email").value.trim();
      const message = $("#message").value.trim();
      let valid = true;
      const nameField = $("#name").closest(".field");
      if (!name) { setError(nameField, "Please enter your name."); valid = false; } else clearError(nameField);
      const emailField = $("#email").closest(".field");
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!email) { setError(emailField, "Please enter your email."); valid = false; }
      else if (!emailOk) { setError(emailField, "Please enter a valid email."); valid = false; }
      else clearError(emailField);
      const msgField = $("#message").closest(".field");
      if (!message || message.length < 10) { setError(msgField, "Please write a message (10+ chars)."); valid = false; } else clearError(msgField);

      const status = $("#form-status");
      if (!valid) { status.textContent = "Please fix the errors above."; status.style.color = "var(--danger)"; return; }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      status.textContent = "";

      try {
        if (FORM_ENDPOINT) {
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ name, email, message }),
          });
          if (!res.ok) throw new Error("Network error");
        } else {
          const subject = encodeURIComponent("Portfolio contact from " + name);
          const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
          window.location.href = `mailto:hello@jordanreyes.dev?subject=${subject}&body=${body}`;
        }
        status.textContent = "Thanks! I'll get back to you within 1-2 business days.";
        status.style.color = "var(--success)";
        form.reset();
      } catch (err) {
        status.textContent = "Something went wrong. Email me directly at hello@jordanreyes.dev.";
        status.style.color = "var(--danger)";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";
      }
    });

    function setError(field, msg) {
      field.classList.add("is-invalid");
      const err = $(".field__error", field);
      if (err) err.textContent = msg;
    }
    function clearError(field) {
      field.classList.remove("is-invalid");
      const err = $(".field__error", field);
      if (err) err.textContent = "";
    }
  }

  function initBackToTop() {
    const btn = $("#back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function init() {
    initTheme();
    initMobileNav();
    initTyped();
    initCanvas();
    renderSkills();
    renderProjects();
    initProjectFilters();
    renderExperience();
    initCarousel();
    renderWriting();
    initContactForm();
    initReveal();
    initCountUp();
    initActiveNav();
    initBackToTop();
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

