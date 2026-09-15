const $ = (selector, root = document) => root.querySelector(selector);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const arrow = '<span aria-hidden="true">↗</span>';

async function start() {
  const response = await fetch("./data.json");
  if (!response.ok) throw new Error(`İçerik yüklenemedi: ${response.status}`);
  const data = await response.json();
  const sectionHead = (section) =>
    `<div class="section-head reveal"><span class="section-number">/${esc(section.index)}</span><div class="section-title"><div class="eyebrow">${esc(section.kicker)}</div><h2>${esc(section.title)}</h2></div></div>`;
  $("#app").innerHTML = `
    <header class="header"><div class="header-inner wrap"><a class="brand" href="#top"><img src="assets/logo-mark.svg" alt=""><span><b>${esc(data.brand.shortName)}</b><small>İNŞAAT</small></span></a><nav class="nav" id="nav" aria-label="Ana menü">${data.navigation.map((item) => `<a href="${esc(item.href)}">${esc(item.label)}</a>`).join("")}</nav><a class="header-call" href="${esc(data.brand.phoneHref)}"><span>PROJENİZİ KONUŞALIM</span><strong>${esc(data.brand.phone)}</strong></a><button class="menu-button" aria-controls="nav" aria-expanded="false">Menü</button></div></header>
    <main id="main"><section class="hero" id="top"><div class="hero-grid wrap"><div class="hero-copy"><div class="eyebrow">${esc(data.hero.kicker)}</div><div class="hero-brand-lockup"><img src="assets/logo-mark.svg" alt=""><h1>${formatHero(data.hero.title)}</h1></div><p class="hero-slogan">${esc(data.brand.slogan)}</p><p class="hero-description">${esc(data.hero.description)}</p><div class="hero-actions"><a class="button" href="${esc(data.brand.whatsapp)}" target="_blank" rel="noopener noreferrer">${esc(data.hero.primaryCta)} ${arrow}</a><a class="text-link" href="#hizmetler">${esc(data.hero.secondaryCta)} ↓</a></div><nav class="hero-socials" aria-label="Sosyal medya ve konum"><a href="${esc(data.brand.whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp ${arrow}</a></nav><div class="proof-row">${data.hero.proof.map((item) => `<span class="proof">${esc(item)}</span>`).join("")}</div></div><div class="build-visual" aria-hidden="true"><div class="building"><div class="floor floor-1"><span></span></div><div class="floor floor-2"><span></span></div><div class="floor floor-3"><span></span></div><div class="floor floor-4"></div></div><div class="crane"></div><span class="visual-label">${esc(data.hero.visualLabel)}</span></div></div><span class="scroll-cue">AŞAĞI KAYDIR</span></section>
    <section class="section wrap">${sectionHead(data.intro)}<div class="intro-grid reveal"><p>${esc(data.intro.body)}</p><div class="intro-note">${esc(data.intro.note)}<br><strong>${esc(data.brand.slogan)}</strong></div></div></section>
    <section class="section services" id="hizmetler"><div class="wrap">${sectionHead(data.services)}<div class="service-list">${data.services.items.map((item) => `<article class="service-row reveal"><small>${esc(item.number)}</small><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><span class="service-icon" aria-hidden="true">↗</span></article>`).join("")}</div></div></section>
    ${data.projects.media.length ? `${renderFeatureShowcase(data.projects.media)}<section class="section media-archive-wrap" id="projeler"><div class="wrap">${renderMedia(data.projects.media)}</div></section>` : '<section class="section"><div class="wrap"><p class="empty-media">Fotoğraf ve video klasörleri hazır. Gerçek medya eklendiğinde arşiv burada otomatik gösterilecek.</p></div></section>'}
    <section class="section wrap" id="surec">${sectionHead(data.process)}<div class="process-grid">${data.process.steps.map((step, index) => `<article class="process-step reveal"><span>0${index + 1}</span><h3>${esc(step.title)}</h3><p>${esc(step.description)}</p></article>`).join("")}</div><div class="faq"><h2>${esc(data.faq.title)}</h2><div>${data.faq.items.map((item, index) => `<details ${index === 0 ? "open" : ""}><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join("")}</div></div></section>
    <section class="contact" id="iletisim"><div class="wrap"><div class="contact-grid"><div><div class="eyebrow">${esc(data.contact.kicker)}</div><h2>${esc(data.contact.title)}</h2><p>${esc(data.contact.description)}</p></div><div class="contact-actions"><a class="button button-light" href="${esc(data.brand.whatsapp)}" target="_blank" rel="noopener noreferrer">${esc(data.contact.primaryCta)} ${arrow}</a><span>${esc(data.contact.phoneLabel)}</span><a class="contact-phone" href="${esc(data.brand.phoneHref)}">${esc(data.brand.phone)}</a></div></div><div class="contact-meta"><span>${esc(data.contact.address)}</span><span>${esc(data.contact.hours)}</span></div><footer class="footer"><span>${esc(data.contact.copyright)}</span><a href="#top">Başa dön ↑</a></footer><div class="developer-credit"><span>${esc(data.contact.developer.label)} <a href="${esc(data.contact.developer.website)}" target="_blank" rel="noopener noreferrer"><strong>${esc(data.contact.developer.name)}</strong></a></span><div><a href="${esc(data.contact.developer.phoneHref)}">${esc(data.contact.developer.phone)}</a><a href="${esc(data.contact.developer.instagram)}" target="_blank" rel="noopener noreferrer">${esc(data.contact.developer.instagramLabel)} ↗</a></div></div></div></section></main>${renderLightbox()}`;
  initMenu();
  initRoute();
  initMedia();
  initLightbox(data.projects.media);
  initReveals();
  initConstruction(data.hero.construction);
}

function initConstruction(copy) {
  const hero = $(".hero");
  const grid = $(".hero-grid");
  const track = document.createElement("div");
  track.className = "construction-track";
  grid.before(track);
  track.append(grid);
  hero.classList.add("construction-hero");
  const visual = $(".build-visual");
  const mobileTrack = document.createElement("div");
  mobileTrack.className = "construction-mobile-track";
  visual.before(mobileTrack);
  mobileTrack.append(visual);
  visual.removeAttribute("aria-hidden");
  visual.innerHTML = `<div class="construction-heading"><span>${esc(copy.title)}</span><span class="construction-count" aria-hidden="true">01 / 09</span></div><div class="construction-view"><img class="construction-fallback" src="assets/construction-fallback.svg" alt="${esc(copy.fallback)}"><canvas class="construction-canvas" aria-hidden="true"></canvas></div><div class="construction-caption"><span class="construction-stage" role="status" aria-live="polite">${esc(copy.stages[0])}</span><button class="construction-control" hidden>${esc(copy.pause)}</button></div><div class="construction-progress" aria-hidden="true"><span></span></div><p class="construction-hint">${esc(copy.desktopHint)}</p>`;
  import("./construction.js")
    .then((module) =>
      module.initConstructionScene({ hero, grid, track, visual, copy }),
    )
    .catch((error) => {
      console.warn("Construction scene unavailable:", error);
      hero.classList.add("construction-unavailable");
      visual.classList.add("construction-failed");
      $(".construction-stage").textContent = copy.title;
      $(".construction-hint").textContent = copy.fallback;
      $(".construction-control").hidden = true;
    });
}

function formatHero(title) {
  const words = esc(title).split(" ");
  const key = words.splice(-2).join(" ");
  return `${words.join(" ")} <em>${key}</em>`;
}
function projectCard(item, index) {
  const color = ["#bb5a2b", "#d68b51", "#927357", "#cf6b35"][index % 4];
  return `<figure class="project-card"><div class="route-stop"></div><div class="project-visual ${item.image ? "has-image" : ""}" style="--card:${color}">${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy">` : ""}<span class="project-tag">${esc(item.category)}</span></div><figcaption><div><h3>${esc(item.title)}</h3><small>${esc(item.location)}</small></div><time>${esc(item.year)}</time></figcaption></figure>`;
}
function renderFeatureShowcase(items) {
  const photos = items.filter((item) => item.type !== "video");
  const picks = [8, 39, 72, 94]
    .map((index) => photos[index])
    .filter(Boolean);
  const captions = [
    ["İnce işçilik, güçlü sonuç", "İÇ MEKÂN UYGULAMALARI"],
    ["Detaylarda bütünlük", "TADİLAT & DEKORASYON"],
    ["Gücün görünür hâli", "ÇELİK KONSTRÜKSİYON"],
    ["Her aşamada özen", "UYGULAMA & TESLİM"],
  ];
  const figures = picks.map((item, index) => {
    const mediaIndex = items.indexOf(item);
    return `<figure class="work-feature reveal"><button class="work-feature-open" type="button" data-lightbox-index="${mediaIndex}" aria-label="${esc(captions[index][0])} görselini büyüt"><img src="${esc(item.src)}" alt="${esc(captions[index][0])}" loading="lazy" decoding="async"><span aria-hidden="true">↗</span></button><figcaption><strong>${esc(captions[index][0])}</strong><small>${esc(captions[index][1])}</small><em>/ 0${index + 1}</em></figcaption></figure>`;
  }).join("");
  return `<section class="section work-showcase" aria-labelledby="work-showcase-title"><div class="wrap"><header class="work-showcase-head"><h2 id="work-showcase-title">İşimiz,<br>kendini anlatır.</h2><p>Çizgilerimiz mekâna dönüştüğü anlar.<br>Uygulamalarımızdan detaylara ve tamamlanan yaşam alanlarına bir bakış.</p></header><div class="work-showcase-grid">${figures}</div></div></section>`;
}

function renderLightbox() {
  return `<dialog class="lightbox" aria-labelledby="lightbox-title"><div class="lightbox-shell"><header class="lightbox-head"><p id="lightbox-title">Proje uygulaması</p><button class="lightbox-close" type="button" aria-label="Modalı kapat">×</button></header><div class="lightbox-stage"></div><footer class="lightbox-foot"><button class="lightbox-arrow" type="button" data-lightbox-direction="prev" aria-label="Önceki medya">←</button><span class="lightbox-counter" aria-live="polite"></span><button class="lightbox-arrow" type="button" data-lightbox-direction="next" aria-label="Sonraki medya">→</button></footer></div></dialog>`;
}

function renderMedia(items) {
  const photos = items.filter((item) => item.type !== "video");
  const videos = items.filter((item) => item.type === "video");
  const cards = items.map((item, index) => {
    const kind = item.type === "video" ? "videos" : "photos";
    if (kind === "videos") {
      return `<button class="media-item media-video" type="button" data-media-kind="videos" data-lightbox-index="${index}" aria-label="${esc(item.title || "Proje videosu")} videosunu aç"${index >= 8 ? " hidden" : ""}><img src="${esc(item.poster || "assets/construction-fallback.svg")}" alt="" loading="lazy"><span class="media-play" aria-hidden="true">▶</span></button>`;
    }
    return `<button class="media-item media-photo" type="button" data-media-kind="photos" data-lightbox-index="${index}" aria-label="${esc(item.title || "Proje fotoğrafı")} görselini büyüt"${index >= 8 ? " hidden" : ""}><img src="${esc(item.src)}" alt="${esc(item.title || "Proje fotoğrafı")}" loading="lazy" decoding="async"></button>`;
  }).join("");

  return `<div class="media-archive wrap" data-media-filter="all"><div class="media-toolbar"><div class="media-tabs" role="group" aria-label="Arşiv filtreleri"><button type="button" class="media-tab active" aria-pressed="true" data-media-tab="all">Tüm arşiv</button>${photos.length ? '<button type="button" class="media-tab" aria-pressed="false" data-media-tab="photos">Fotoğraflar</button>' : ""}${videos.length ? '<button type="button" class="media-tab" aria-pressed="false" data-media-tab="videos">Videolar</button>' : ""}</div><p class="media-count" role="status" aria-live="polite">${Math.min(8, items.length)} / ${items.length} uygulama karesi</p></div><div class="media-grid" id="media-grid">${cards}</div><div class="media-more-wrap">${items.length > 8 ? '<button type="button" class="button media-more" aria-controls="media-grid">Daha Fazla Göster</button>' : ""}</div></div>`;
}
function initMedia() {
  document.querySelectorAll("video").forEach((video) => {
    video.defaultMuted = true;
    const silence = () => {
      if (!video.muted) video.muted = true;
      if (video.volume !== 0) video.volume = 0;
    };
    silence();
    video.addEventListener("volumechange", silence);
    video.addEventListener("play", silence);
  });

  const archive = $(".media-archive");
  if (!archive) return;

  const cards = [...archive.querySelectorAll(".media-item")];
  const moreButton = $(".media-more", archive);
  const count = $(".media-count", archive);
  let filter = "all";
  let visibleLimit = 8;

  const update = () => {
    const filtered = cards.filter((card) => filter === "all" || card.dataset.mediaKind === filter);
    cards.forEach((card) => {
      const position = filtered.indexOf(card);
      card.hidden = position < 0 || position >= visibleLimit;
    });
    const visible = Math.min(visibleLimit, filtered.length);
    if (count) count.textContent = `${visible} / ${filtered.length} uygulama karesi`;
    if (moreButton) moreButton.hidden = visible >= filtered.length;
  };

  archive.querySelectorAll(".media-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      filter = tab.dataset.mediaTab;
      visibleLimit = 8;
      archive.dataset.mediaFilter = filter;
      archive.querySelectorAll(".media-tab").forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      update();
    });
  });

  if (moreButton) {
    moreButton.addEventListener("click", () => {
      visibleLimit += 8;
      update();
    });
  }

  update();
}
function initLightbox(items) {
  const dialog = $(".lightbox");
  if (!dialog || !items.length) return;

  const stage = $(".lightbox-stage", dialog);
  const title = $("#lightbox-title", dialog);
  const counter = $(".lightbox-counter", dialog);
  let currentIndex = 0;
  let returnFocus = null;

  const render = () => {
    const item = items[currentIndex];
    const label = item.title || (item.type === "video" ? "Proje videosu" : "Proje fotoğrafı");
    title.textContent = label;
    counter.textContent = `${currentIndex + 1} / ${items.length}`;
    stage.innerHTML = item.type === "video"
      ? `<video src="${esc(item.src)}"${item.poster ? ` poster="${esc(item.poster)}"` : ""} aria-label="${esc(label)}" controls autoplay playsinline></video>`
      : `<img src="${esc(item.src)}" alt="${esc(label)}">`;
  };

  const move = (direction) => {
    currentIndex = (currentIndex + direction + items.length) % items.length;
    render();
  };

  const close = () => dialog.close();

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox-index]");
    if (!trigger) return;
    returnFocus = trigger;
    currentIndex = Number(trigger.dataset.lightboxIndex);
    render();
    dialog.showModal();
    document.body.classList.add("modal-open");
  });

  $(".lightbox-close", dialog).addEventListener("click", close);
  dialog.querySelector('[data-lightbox-direction="prev"]').addEventListener("click", () => move(-1));
  dialog.querySelector('[data-lightbox-direction="next"]').addEventListener("click", () => move(1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("close", () => {
    stage.innerHTML = "";
    document.body.classList.remove("modal-open");
    returnFocus?.focus({ preventScroll: true });
  });
  document.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
}
function initMenu() {
  const button = $(".menu-button"),
    nav = $(".nav");
  button.onclick = () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "Kapat" : "Menü";
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  };
  nav.onclick = () => {
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Menü";
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  };
}
function initRoute() {
  const route = $(".project-route");
  if (!route) return;

  const line = $(".route-line");
  const prevButton = $('[data-route="prev"]');
  const nextButton = $('[data-route="next"]');

  const move = (direction) =>
    route.scrollBy({
      left: direction * route.clientWidth * 0.72,
      behavior: "smooth",
    });

  prevButton && (prevButton.onclick = () => move(-1));
  nextButton && (nextButton.onclick = () => move(1));

  const update = () => {
    const max = route.scrollWidth - route.clientWidth;
    if (line) {
      line.style.setProperty(
        "--route-progress",
        max ? route.scrollLeft / max : 1,
      );
    }
  };

  route.addEventListener("scroll", update, { passive: true });
  update();
}
function initReveals() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.14, rootMargin: "0px 0px -7%" },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

start().catch((error) => {
  console.error(error);
  $("#app").innerHTML =
    '<div class="loading"><h1>Diler İnşaat</h1><p>İçerik yüklenemedi. Yerel önizleme için projeyi bir HTTP sunucusu üzerinden açın.</p><a href="tel:+905354024773">+90 535 402 47 73</a></div>';
});
