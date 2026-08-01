/* Mile High Noise — ring slider + hype board */
(function () {
  const PLAYERS = [
    {
      id: "bo-nix",
      name: "Bo Nix",
      pos: "QB",
      number: "10",
      image: "players/bo-nix.jpg",
      flavor: "Ice in the thin air. Pocket poet. Future on his arm.",
      hype:
        "The kid from Eugene who made the Rockies feel small. Quick release, cold eyes, chaos-friendly. When Bo’s in rhythm, Mile High gets loud — and the rest of the AFC starts checking the scoreboard twice.",
    },
    {
      id: "courtland-sutton",
      name: "Courtland Sutton",
      pos: "WR",
      number: "14",
      image: "players/courtland-sutton.jpg",
      flavor: "High-point royalty. Jump ball? Already claimed.",
      hype:
        "Six-five of “that’s my ball.” High-point king. Contested-catch problem for every corner unlucky enough to draw him. When the game needs a spark, you throw it up and trust Court.",
    },
    {
      id: "patrick-surtain",
      name: "Patrick Surtain II",
      pos: "CB",
      number: "2",
      image: "players/patrick-surtain.jpg",
      flavor: "Lockdown foil. See green, erase green.",
      hype:
        "Shutdown mode: activated. Elite feet, zero panic, the kind of cover that makes QBs pretend they never saw the read. Opposing offenses game-plan around PS2 — and still lose the matchup.",
    },
    {
      id: "nik-bonitto",
      name: "Nik Bonitto",
      pos: "EDGE",
      number: "15",
      image: "players/nik-bonitto.jpg",
      flavor: "Edge lightning. First step. Last sound.",
      hype:
        "Speed off the edge that feels illegal. Bend. Burst. Sack parties in the thin air. When Niko’s hunting, pocket time gets real personal.",
    },
    {
      id: "marvin-mims",
      name: "Marvin Mims Jr.",
      pos: "WR / PR",
      number: "19",
      image: "players/marvin-mims.jpg",
      flavor: "Turbo orange. Catch. Cut. Vanish.",
      hype:
        "Jet fuel in orange. One cut and he’s gone — return lane or go-route, same story. The room changes when #19 touches the ball.",
    },
  ];

  const track = document.getElementById("ringTrack");
  const viewport = document.getElementById("ringViewport");
  const dots = document.getElementById("ringDots");
  const hypeGrid = document.getElementById("hypeGrid");
  const prevBtn = document.querySelector(".ring-btn.prev");
  const nextBtn = document.querySelector(".ring-btn.next");

  let index = 0;
  let cardWidth = 280;
  let gap = 20;

  function measure() {
    const card = track.querySelector(".sport-card");
    if (!card) return;
    const styles = getComputedStyle(track);
    gap = parseFloat(styles.gap) || 20;
    cardWidth = card.getBoundingClientRect().width;
  }

  function renderCards() {
    track.innerHTML = PLAYERS.map(
      (p, i) => `
      <article class="sport-card${i === index ? " is-active" : ""}" role="listitem" data-index="${i}" aria-label="${p.name}">
        <div class="sport-card-inner">
          <div class="card-art">
            <img src="${p.image}" alt="${p.name} sports card art" loading="${i === 0 ? "eager" : "lazy"}" />
          </div>
          <span class="card-badge">Foil · ${p.pos}</span>
          <span class="card-num">#${p.number}</span>
          <div class="card-meta">
            <h3>${p.name}</h3>
            <span class="pos">${p.pos}</span>
            <p class="card-flavor">${p.flavor}</p>
          </div>
        </div>
      </article>`
    ).join("");

    dots.innerHTML = PLAYERS.map(
      (_, i) =>
        `<button type="button" role="tab" aria-label="Show card ${i + 1}" aria-selected="${i === index}" data-index="${i}"></button>`
    ).join("");

    hypeGrid.innerHTML = PLAYERS.map(
      (p) => `
      <article class="hype-card">
        <div class="hype-photo">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="hype-body">
          <span class="pos">${p.pos} · #${p.number}</span>
          <h3>${p.name}</h3>
          <p>${p.hype}</p>
        </div>
      </article>`
    ).join("");
  }

  function updateActive() {
    track.querySelectorAll(".sport-card").forEach((el, i) => {
      el.classList.toggle("is-active", i === index);
      const offset = i - index;
      el.style.setProperty("--tilt", `${offset * -8}deg`);
    });
    dots.querySelectorAll("button").forEach((btn, i) => {
      btn.setAttribute("aria-selected", String(i === index));
    });
    measure();
    const x = -(index * (cardWidth + gap));
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  function goTo(i) {
    index = (i + PLAYERS.length) % PLAYERS.length;
    updateActive();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  // Drag / swipe
  let dragging = false;
  let startX = 0;
  let startTransform = 0;
  let lastX = 0;

  function getTrackX() {
    measure();
    return -(index * (cardWidth + gap));
  }

  function onPointerDown(e) {
    dragging = true;
    viewport.classList.add("is-dragging");
    startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    lastX = startX;
    startTransform = getTrackX();
    track.style.transition = "none";
    if (e.pointerId != null && viewport.setPointerCapture) {
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? lastX;
    lastX = x;
    const dx = x - startX;
    track.style.transform = `translate3d(${startTransform + dx}px, 0, 0)`;
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    track.style.transition = "";
    const dx = lastX - startX;
    const threshold = cardWidth * 0.18;
    if (dx < -threshold) next();
    else if (dx > threshold) prev();
    else updateActive();
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  dots.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-index]");
    if (!btn) return;
    goTo(Number(btn.dataset.index));
  });

  track.addEventListener("click", (e) => {
    const card = e.target.closest(".sport-card");
    if (!card) return;
    goTo(Number(card.dataset.index));
  });

  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerUp);
  viewport.addEventListener("pointercancel", onPointerUp);
  viewport.addEventListener("pointerleave", onPointerUp);

  // Touch fallback
  viewport.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches[0]) onPointerDown(e.touches[0]);
    },
    { passive: true }
  );
  viewport.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches[0]) onPointerMove(e.touches[0]);
    },
    { passive: true }
  );
  viewport.addEventListener("touchend", onPointerUp);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  window.addEventListener("resize", () => {
    updateActive();
  });

  renderCards();
  requestAnimationFrame(() => {
    measure();
    updateActive();
  });
})();
