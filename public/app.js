/* Mile High Noise — star ring + Ring of Fame + hype board */
(function () {
  // image = Star Card Ring art; hypeImage = alternate full card for Hype Board (2 cards/player)
  const PLAYERS = [
    {
      id: "bo-nix",
      name: "Bo Nix",
      pos: "QB",
      number: "10",
      image: "players/bo-nix.jpg",
      hypeImage: "players/hype/bo-nix.jpg",
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
      hypeImage: "players/hype/courtland-sutton.jpg",
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
      hypeImage: "players/hype/patrick-surtain.jpg",
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
      hypeImage: "players/hype/nik-bonitto.jpg",
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
      hypeImage: "players/hype/marvin-mims.jpg",
      flavor: "Turbo orange. Catch. Cut. Vanish.",
      hype:
        "Jet fuel in orange. One cut and he’s gone — return lane or go-route, same story. The room changes when #19 touches the ball.",
    },
  ];

  // Franchise Ring of Fame (unofficial fan tribute; not the full 38)
  // image = RoF ring art; hypeImage = alternate full card for Legends Board (2 cards/legend)
  // Flavor + hype: Honey copy pack
  const ROF = [
    {
      id: "john-elway",
      name: "John Elway",
      pos: "QB",
      number: "7",
      year: "1999",
      image: "rof/john-elway.jpg",
      hypeImage: "rof/hype/john-elway.jpg",
      flavor: "Drive of a lifetime. Comeback king. Mile High forever.",
      hype:
        "The arm that built modern Mile High. Late-game ice in the veins, helicopter spins into legend. Two rings as a player, forever the face of Broncos football.",
    },
    {
      id: "peyton-manning",
      name: "Peyton Manning",
      pos: "QB",
      number: "18",
      year: "2021",
      image: "rof/peyton-manning.jpg",
      hypeImage: "rof/hype/peyton-manning.jpg",
      flavor: "Sheriff of the thin air. Reads defenses like open books.",
      hype:
        "The Sheriff brought a playbook and a parade. Cadence, timing, surgical strikes — Denver’s offense became a clinic with #18 under center.",
    },
    {
      id: "terrell-davis",
      name: "Terrell Davis",
      pos: "RB",
      number: "30",
      year: "2007",
      image: "rof/terrell-davis.jpg",
      hypeImage: "rof/hype/terrell-davis.jpg",
      flavor: "TD time. Bowls, bruises, unstoppable.",
      hype:
        "Between the tackles and into October lore. Power, vision, Super Bowl MVP energy. When TD had the rock, the whole mountain leaned forward.",
    },
    {
      id: "shannon-sharpe",
      name: "Shannon Sharpe",
      pos: "TE",
      number: "84",
      year: "2009",
      image: "rof/shannon-sharpe.jpg",
      hypeImage: "rof/hype/shannon-sharpe.jpg",
      flavor: "Tight end thunder. Hands of gold. Mouth of fire.",
      hype:
        "Mismatch nightmare with Hall of Fame hands. After the catch, chaos. After the game, the mic. Broncos swagger personified.",
    },
    {
      id: "champ-bailey",
      name: "Champ Bailey",
      pos: "CB",
      number: "24",
      year: "2019",
      image: "rof/champ-bailey.jpg",
      hypeImage: "rof/hype/champ-bailey.jpg",
      flavor: "Shutdown royalty. Elite cover. Zero freebies.",
      hype:
        "Prime-time lockdown with grace and grit. Receivers disappeared when Champ lined up. Corner play at its purest.",
    },
    {
      id: "demaryius-thomas",
      name: "Demaryius Thomas",
      pos: "WR",
      number: "88",
      year: "2025",
      image: "rof/demaryius-thomas.jpg",
      hypeImage: "rof/hype/demaryius-thomas.jpg",
      flavor: "DT deep threat. Go-ball gravity. Orange forever.",
      hype:
        "Big body, bigger moments. Contested catches, deep shots, and a smile that still lives in Broncos Country. #88 never really left.",
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
      const cards = trackEl.querySelectorAll(".sport-card");
      if (!cards.length) return;
      // Use layout width (not scaled) so centering stays stable for every card
      cardWidth = cards[0].offsetWidth;
      if (cards.length > 1) {
        const a = cards[0].getBoundingClientRect();
        const b = cards[1].getBoundingClientRect();
        // Distance between unscaled layout starts ≈ cardWidth + gap
        // Prefer offsetLeft (layout coords, ignores transform/scale)
        gap = Math.max(0, cards[1].offsetLeft - cards[0].offsetLeft - cardWidth);
        if (!Number.isFinite(gap) || gap < 0) {
          gap = Math.max(0, b.left - a.left - a.width);
        }
      } else {
        const styles = getComputedStyle(trackEl);
        const raw = styles.columnGap || styles.gap || "20px";
        gap = raw.endsWith("px") ? parseFloat(raw) : 16;
      }
    }

    /** Offset that centers card `i` fully inside the viewport (first → last). */
    function offsetFor(i) {
      measure();
      const vw = viewportEl.clientWidth;
      // Center of card i in track space, then shift so it lands in viewport center
      const cardCenter = i * (cardWidth + gap) + cardWidth / 2;
      return vw / 2 - cardCenter;
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
        el.style.setProperty("--tilt", `${(i - index) * -6}deg`);
      });
      dotsEl.querySelectorAll("button").forEach((btn, i) => {
        btn.setAttribute("aria-selected", String(i === index));
      });
      trackEl.style.transform = `translate3d(${offsetFor(index)}px, 0, 0)`;
    }

    function goTo(i) {
      // Clamp at ends so the last card can fully settle in frame (no wrap-skip)
      index = Math.max(0, Math.min(items.length - 1, i));
      updateActive();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function onPointerDown(e) {
      dragging = true;
      viewportEl.classList.add("is-dragging");
      startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      lastX = startX;
      startTransform = offsetFor(index);
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
      const threshold = Math.max(36, cardWidth * 0.14);
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
      if (!card || dragging) return;
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

    window.addEventListener("resize", () => {
      requestAnimationFrame(updateActive);
    });

    render();
    // Double rAF + image load: first paint / decode can shift widths on phone
    const settle = () => requestAnimationFrame(() => requestAnimationFrame(updateActive));
    settle();
    trackEl.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", settle, { once: true });
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

  function fillHypeGrid(el, items, { useAltCard = false } = {}) {
    if (!el) return;
    el.innerHTML = items
      .map((p) => {
        // Hype Board: alternate full foil card before text; ring art stays on top
        const src = useAltCard && p.hypeImage ? p.hypeImage : p.image;
        const alt = useAltCard
          ? `${p.name} #${p.number} alternate foil card`
          : `${p.name} #${p.number}`;
        return `
    <article class="hype-card">
      <div class="hype-foil">
        <img src="${src}" alt="${alt}" loading="lazy" width="832" height="1248" />
      </div>
      <div class="hype-body">
        <span class="pos">${p.pos} · #${p.number}</span>
        <h3>${p.name}</h3>
        <p>${p.hype}</p>
      </div>
    </article>`;
      })
      .join("");
  }

  fillHypeGrid(document.getElementById("hypeGrid"), PLAYERS, { useAltCard: true });
  fillHypeGrid(document.getElementById("legendsGrid"), ROF, { useAltCard: true });

  // Arrow keys target the star ring when focused in page
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") starRing.next();
    if (e.key === "ArrowLeft") starRing.prev();
  });
})();
