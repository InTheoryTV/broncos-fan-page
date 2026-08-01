/* Mile High Noise — star ring + Ring of Fame + hype board */
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

  // Franchise Ring of Fame highlights (unofficial fan tribute; not the full 38)
  const ROF = [
    {
      id: "john-elway",
      name: "John Elway",
      pos: "QB",
      number: "7",
      year: "1999",
      image: "rof/john-elway.jpg",
      flavor: "The Drive. The Dynasty. Forever #7.",
    },
    {
      id: "peyton-manning",
      name: "Peyton Manning",
      pos: "QB",
      number: "18",
      year: "2021",
      image: "rof/peyton-manning.jpg",
      flavor: "Omaha. Super Bowl 50. Perfect snap.",
    },
    {
      id: "terrell-davis",
      name: "Terrell Davis",
      pos: "RB",
      number: "30",
      year: "2007",
      image: "rof/terrell-davis.jpg",
      flavor: "2,008 yards. Mile High thunder.",
    },
    {
      id: "shannon-sharpe",
      name: "Shannon Sharpe",
      pos: "TE",
      number: "84",
      year: "2009",
      image: "rof/shannon-sharpe.jpg",
      flavor: "Talk it. Walk it. Hall of Fame TE.",
    },
    {
      id: "champ-bailey",
      name: "Champ Bailey",
      pos: "CB",
      number: "24",
      year: "2019",
      image: "rof/champ-bailey.jpg",
      flavor: "Shutdown royalty. Twelve Pro Bowls.",
    },
    {
      id: "demaryius-thomas",
      name: "Demaryius Thomas",
      pos: "WR",
      number: "88",
      year: "2025",
      image: "rof/demaryius-thomas.jpg",
      flavor: "DT88. First-ballot energy forever.",
    },
  ];

  function createRing(config) {
    const {
      trackEl,
      viewportEl,
      dotsEl,
      prevBtn,
      nextBtn,
      items,
      renderCard,
    } = config;

    let index = 0;
    let cardWidth = 280;
    let gap = 20;
    let dragging = false;
    let startX = 0;
    let startTransform = 0;
    let lastX = 0;

    function measure() {
      const card = trackEl.querySelector(".sport-card");
      if (!card) return;
      const styles = getComputedStyle(trackEl);
      gap = parseFloat(styles.gap) || 20;
      cardWidth = card.getBoundingClientRect().width;
    }

    function render() {
      trackEl.innerHTML = items
        .map((item, i) => renderCard(item, i, index))
        .join("");
      dotsEl.innerHTML = items
        .map(
          (_, i) =>
            `<button type="button" role="tab" aria-label="Show card ${i + 1}" aria-selected="${i === index}" data-index="${i}"></button>`
        )
        .join("");
    }

    function updateActive() {
      trackEl.querySelectorAll(".sport-card").forEach((el, i) => {
        el.classList.toggle("is-active", i === index);
        el.style.setProperty("--tilt", `${(i - index) * -8}deg`);
      });
      dotsEl.querySelectorAll("button").forEach((btn, i) => {
        btn.setAttribute("aria-selected", String(i === index));
      });
      measure();
      trackEl.style.transform = `translate3d(${-(index * (cardWidth + gap))}px, 0, 0)`;
    }

    function goTo(i) {
      index = (i + items.length) % items.length;
      updateActive();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function getTrackX() {
      measure();
      return -(index * (cardWidth + gap));
    }

    function onPointerDown(e) {
      dragging = true;
      viewportEl.classList.add("is-dragging");
      startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      lastX = startX;
      startTransform = getTrackX();
      trackEl.style.transition = "none";
      if (e.pointerId != null && viewportEl.setPointerCapture) {
        try {
          viewportEl.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? lastX;
      lastX = x;
      trackEl.style.transform = `translate3d(${startTransform + (x - startX)}px, 0, 0)`;
    }

    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      viewportEl.classList.remove("is-dragging");
      trackEl.style.transition = "";
      const dx = lastX - startX;
      const threshold = cardWidth * 0.18;
      if (dx < -threshold) next();
      else if (dx > threshold) prev();
      else updateActive();
    }

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
    dotsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-index]");
      if (!btn) return;
      goTo(Number(btn.dataset.index));
    });
    trackEl.addEventListener("click", (e) => {
      const card = e.target.closest(".sport-card");
      if (!card) return;
      goTo(Number(card.dataset.index));
    });

    viewportEl.addEventListener("pointerdown", onPointerDown);
    viewportEl.addEventListener("pointermove", onPointerMove);
    viewportEl.addEventListener("pointerup", onPointerUp);
    viewportEl.addEventListener("pointercancel", onPointerUp);
    viewportEl.addEventListener("pointerleave", onPointerUp);
    viewportEl.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches[0]) onPointerDown(e.touches[0]);
      },
      { passive: true }
    );
    viewportEl.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches[0]) onPointerMove(e.touches[0]);
      },
      { passive: true }
    );
    viewportEl.addEventListener("touchend", onPointerUp);

    window.addEventListener("resize", updateActive);

    render();
    requestAnimationFrame(() => {
      measure();
      updateActive();
    });

    return { next, prev, goTo };
  }

  function starCard(p, i, activeIndex) {
    return `
      <article class="sport-card${i === activeIndex ? " is-active" : ""}" role="listitem" data-index="${i}" aria-label="${p.name}">
        <div class="sport-card-inner">
          <div class="card-art">
            <img src="${p.image}" alt="${p.name} #${p.number} sports card art" loading="${i === 0 ? "eager" : "lazy"}" />
          </div>
          <span class="card-badge">Foil · ${p.pos}</span>
          <span class="card-num">#${p.number}</span>
          <div class="card-meta">
            <h3>${p.name}</h3>
            <span class="pos">${p.pos} · #${p.number}</span>
            <p class="card-flavor">${p.flavor}</p>
          </div>
        </div>
      </article>`;
  }

  function rofCard(p, i, activeIndex) {
    return `
      <article class="sport-card sport-card--legend${i === activeIndex ? " is-active" : ""}" role="listitem" data-index="${i}" aria-label="${p.name}">
        <div class="sport-card-inner">
          <div class="card-art">
            <img src="${p.image}" alt="${p.name} Ring of Fame card" loading="${i === 0 ? "eager" : "lazy"}" />
          </div>
          <span class="card-badge card-badge--gold">RoF · ${p.year}</span>
          <span class="card-num">#${p.number}</span>
          <div class="card-meta">
            <h3>${p.name}</h3>
            <span class="pos">${p.pos} · inducted ${p.year}</span>
            <p class="card-flavor">${p.flavor}</p>
          </div>
        </div>
      </article>`;
  }

  const starRing = createRing({
    trackEl: document.getElementById("ringTrack"),
    viewportEl: document.getElementById("ringViewport"),
    dotsEl: document.getElementById("ringDots"),
    prevBtn: document.querySelector(".ring-btn.prev"),
    nextBtn: document.querySelector(".ring-btn.next"),
    items: PLAYERS,
    renderCard: starCard,
  });

  createRing({
    trackEl: document.getElementById("rofTrack"),
    viewportEl: document.getElementById("rofViewport"),
    dotsEl: document.getElementById("rofDots"),
    prevBtn: document.querySelector(".rof-btn.prev"),
    nextBtn: document.querySelector(".rof-btn.next"),
    items: ROF,
    renderCard: rofCard,
  });

  const hypeGrid = document.getElementById("hypeGrid");
  hypeGrid.innerHTML = PLAYERS.map(
    (p) => `
    <article class="hype-card">
      <div class="hype-photo">
        <img src="${p.image}" alt="${p.name} #${p.number}" loading="lazy" />
      </div>
      <div class="hype-body">
        <span class="pos">${p.pos} · #${p.number}</span>
        <h3>${p.name}</h3>
        <p>${p.hype}</p>
      </div>
    </article>`
  ).join("");

  // Arrow keys target the star ring when focused in page
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") starRing.next();
    if (e.key === "ArrowLeft") starRing.prev();
  });
})();
