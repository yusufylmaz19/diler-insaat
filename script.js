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
    <main id="main"><section class="hero" id="top"><div class="hero-grid wrap"><div class="hero-copy"><div class="eyebrow">${esc(data.hero.kicker)}</div><div class="hero-brand-lockup"><img src="assets/logo-mark.svg" alt=""><h1>${formatHero(data.hero.title)}</h1></div><p class="hero-slogan">${esc(data.brand.slogan)}</p><p class="hero-description">${esc(data.hero.description)}</p><div class="hero-actions"><a class="button" href="${esc(data.brand.whatsapp)}" target="_blank" rel="noopener noreferrer">${esc(data.hero.primaryCta)} ${arrow}</a><a class="text-link" href="#hizmetler">${esc(data.hero.secondaryCta)} ↓</a></div><nav class="hero-socials" aria-label="Sosyal medya ve konum"><a href="${esc(data.brand.instagram)}" target="_blank" rel="noopener noreferrer">Instagram ${arrow}</a><a href="${esc(data.brand.whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp ${arrow}</a><a href="${esc(data.brand.maps)}" target="_blank" rel="noopener noreferrer">Google Haritalar ${arrow}</a></nav><div class="proof-row">${data.hero.proof.map((item) => `<span class="proof">${esc(item)}</span>`).join("")}</div></div><div class="build-visual" aria-hidden="true"><div class="building"><div class="floor floor-1"><span></span></div><div class="floor floor-2"><span></span></div><div class="floor floor-3"><span></span></div><div class="floor floor-4"></div></div><div class="crane"></div><span class="visual-label">${esc(data.hero.visualLabel)}</span></div></div><span class="scroll-cue">AŞAĞI KAYDIR</span></section>
    <section class="section wrap">${sectionHead(data.intro)}<div class="intro-grid reveal"><p>${esc(data.intro.body)}</p><div class="intro-note">${esc(data.intro.note)}<br><strong>${esc(data.brand.slogan)}</strong></div></div></section>
    <section class="section services" id="hizmetler"><div class="wrap">${sectionHead(data.services)}<div class="service-list">${data.services.items.map((item) => `<article class="service-row reveal"><small>${esc(item.number)}</small><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><span class="service-icon" aria-hidden="true">↗</span></article>`).join("")}</div></div></section>
    ${data.projects.media.length ? `<section class="section media-archive-wrap"><div class="wrap">${renderMedia(data.projects.media)}</div></section>` : '<section class="section"><div class="wrap"><p class="empty-media">Fotoğraf ve video klasörleri hazır. Gerçek medya eklendiğinde arşiv burada otomatik gösterilecek.</p></div></section>'}
    <section class="section wrap" id="surec">${sectionHead(data.process)}<div class="process-grid">${data.process.steps.map((step, index) => `<article class="process-step reveal"><span>0${index + 1}</span><h3>${esc(step.title)}</h3><p>${esc(step.description)}</p></article>`).join("")}</div><div class="faq"><h2>${esc(data.faq.title)}</h2><div>${data.faq.items.map((item, index) => `<details ${index === 0 ? "open" : ""}><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join("")}</div></div></section>
    <section class="contact" id="iletisim"><div class="wrap"><div class="contact-grid"><div><div class="eyebrow">${esc(data.contact.kicker)}</div><h2>${esc(data.contact.title)}</h2><p>${esc(data.contact.description)}</p></div><div class="contact-actions"><a class="button button-light" href="${esc(data.brand.whatsapp)}" target="_blank" rel="noopener noreferrer">${esc(data.contact.primaryCta)} ${arrow}</a><span>${esc(data.contact.phoneLabel)}</span><a class="contact-phone" href="${esc(data.brand.phoneHref)}">${esc(data.brand.phone)}</a></div></div><div class="contact-meta"><span>${esc(data.contact.address)}</span><span>${esc(data.contact.hours)}</span></div><footer class="footer"><span>${esc(data.contact.copyright)}</span><a href="#top">Başa dön ↑</a></footer><div class="developer-credit"><span>${esc(data.contact.developer.label)} <a href="${esc(data.contact.developer.website)}" target="_blank" rel="noopener noreferrer"><strong>${esc(data.contact.developer.name)}</strong></a></span><div><a href="${esc(data.contact.developer.phoneHref)}">${esc(data.contact.developer.phone)}</a><a href="${esc(data.contact.developer.instagram)}" target="_blank" rel="noopener noreferrer">${esc(data.contact.developer.instagramLabel)} ↗</a></div></div></div></section></main>`;
  initMenu();
  initRoute();
  initMedia();
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
function renderMedia(items) {
  const photos = items.filter((item) => item.type !== "video");
  const videos = items.filter((item) => item.type === "video");
  return `<div class="media-archive wrap">${photos.length ? `<section aria-labelledby="photos-title"><h3 id="photos-title">Fotoğraf arşivi <small>${photos.length} fotoğraf</small></h3><div class="media-grid" id="photo-grid">${photos.map((item, index) => `<a class="media-photo" href="${esc(item.src)}" target="_blank" rel="noopener noreferrer"${index >= 12 ? " hidden" : ""}><img src="${esc(item.src)}" alt="${esc(item.title || "Proje fotoğrafı")}" loading="lazy" decoding="async"></a>`).join("")}</div>${photos.length > 12 ? '<button class="button media-more" aria-controls="photo-grid">Daha fazla fotoğraf göster</button>' : ""}<p class="media-count" role="status">${Math.min(12, photos.length)} / ${photos.length} fotoğraf gösteriliyor</p></section>` : ""}${videos.length ? `<section aria-labelledby="videos-title"><h3 id="videos-title">Video arşivi <small>${videos.length} video</small></h3><div class="media-grid">${videos.map((item) => `<figure class="media-video"><video src="${esc(item.src)}"${item.poster ? ` poster="${esc(item.poster)}"` : ""} aria-label="${esc(item.title || "Proje videosu")}" preload="none" playsinline controls></video><figcaption>${esc(item.title || "Proje videosu")}</figcaption></figure>`).join("")}</div></section>` : ""}</div>`;
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
  const button = $(".media-more");
  if (!button) return;
  button.onclick = () => {
    const hidden = [...document.querySelectorAll(".media-photo[hidden]")];
    const batch = hidden.slice(0, 12);
    batch.forEach((photo) => {
      photo.hidden = false;
    });
    const total = document.querySelectorAll(".media-photo").length;
    $(".media-count").textContent =
      `${total - hidden.length + batch.length} / ${total} fotoğraf gösteriliyor`;
    batch[0]?.focus({ preventScroll: true });
    button.hidden = hidden.length <= 12;
  };
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
