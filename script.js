/**
 * ============================================================================
 * WEDDING INVITATION INTERACTIVE SCRIPT
 * Main application logic for animations, sound control, RSVP, and UI popups.
 * ============================================================================
 */

/**
 * Handles opening the wedding invitation overlay and playing background music.
 */
function openInvitation() {
    const overlay = document.getElementById('invitation-overlay');
    if (!overlay) return;

    overlay.classList.add('closing');
    document.body.classList.remove('overlay-open');

    // Attempt autoplay background music upon user interaction (Browser compliance)
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle-btn');
    if (audio) {
        audio.play().then(() => {
            musicBtn?.classList.add('playing');
        }).catch(err => {
            console.warn("Autoplay prevented by browser:", err);
        });
    }

    // Force GSAP ScrollTrigger to recalculate coordinates after scrollbar unlock
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);

    // Remove overlay element from layout display after transition completes
    setTimeout(() => {
        overlay.style.display = 'none';
        ScrollTrigger.refresh();
    }, 850);
}

// Lock scroll while invitation overlay is visible
document.body.classList.add('overlay-open');

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Extracts guest name parameter from the URL (?to=Name or /to?=Name).
     * @returns {string|null} Parsed guest name or null if omitted.
     */
    const getGuestNameFromURL = () => {
        const searchParams = new URLSearchParams(window.location.search);
        let guest = searchParams.get('to');

        if (!guest) {
            const rawSearch = window.location.search;
            const rawPath = window.location.pathname;

            // Check query pattern e.g. ?to=GuestName or ?to?=GuestName
            const matchQuery = rawSearch.match(/[?&]to\??=([^&]+)/i);
            if (matchQuery && matchQuery[1]) {
                guest = decodeURIComponent(matchQuery[1]);
            } else {
                // Check pathname pattern e.g. /to?=GuestName
                const matchPath = rawPath.match(/\/to\??=([^/]+)/i);
                if (matchPath && matchPath[1]) {
                    guest = decodeURIComponent(matchPath[1]);
                }
            }
        }

        return guest ? guest.trim() : null;
    };

    // Populate personalized guest greeting if parameter exists
    const guestName = getGuestNameFromURL();
    if (guestName) {
        const guestBox = document.getElementById('overlay-guest-box');
        const guestNameEl = document.getElementById('guest-name');
        const rsvpNameInput = document.getElementById('rsvp-name');

        if (guestNameEl) {
            guestNameEl.textContent = guestName;
        }
        if (guestBox) {
            guestBox.style.display = 'block';
        }
        if (rsvpNameInput) {
            rsvpNameInput.value = guestName;
        }
    }

    const audioElement = document.getElementById("bg-music");
    const urlParams = new URLSearchParams(window.location.search);
    const musicTheme = urlParams.get("pack") ? urlParams.get("pack").toLowerCase() : "default";
    const rarePopup = document.getElementById("rare-popup");

    const multiPlaylists = {
        "anabel": [
          "https://mp3tourl.com/audio/1788680241482-917012b6-25f5-48b3-a453-302d35d1b884.mp3", //jalaring
          "https://mp3tourl.com/audio/1788682165070-a2867271-575b-4f13-bdb2-95fd03f35cfb.mp3", //negoro angin
          "https://mp3tourl.com/audio/1788682294865-a0eeaac3-2e81-4caf-a910-b8fbe0536e79.mp3", //angel 2
          "https://mp3tourl.com/audio/1788682436069-0c34c6bd-5d12-4c05-9913-d55ef5ef9131.mp3" //tanpo hubungan
        ],
        "charge": [
          "https://mp3tourl.com/audio/1788640216656-08296323-d796-4e04-9308-2a88eff1b805.mp3", //apocalipse
          "https://mp3tourl.com/audio/1788683443630-570d3043-1d99-4ab2-9c26-4753483577fa.mp3", //heavenly
          "https://mp3tourl.com/audio/1788683521282-15c65147-8fcb-49cb-a8b4-930584ba56af.mp3", //K
          "https://mp3tourl.com/audio/1788683656535-30bd3f88-aa64-49cd-abb2-0291684a05a7.mp3", //sweet
          "https://mp3tourl.com/audio/1788684098368-f824c322-4e04-42de-ab9f-bb6199482ca3.mp3", //sunsetz
          "https://mp3tourl.com/audio/1788685946606-eb5822fd-690d-4733-a13b-1049dbea5876.mp3" //cry
        ],
        "rand": [
          "https://mp3tourl.com/audio/1788684478435-d0ea43f4-3ea0-4795-a98b-b9a8933382c5.mp3", //multo
          "https://mp3tourl.com/audio/1788684578889-a6f3cd87-435a-450f-98c2-b20523fb0f06.mp3", //illit
          "https://mp3tourl.com/audio/1788684669869-6eda8253-f1c3-45c0-9ebf-07bd349e5521.mp3" //sailor song
        ],
        "bala-bala": [
          "https://mp3tourl.com/audio/1788684782490-904a7d51-4b82-475d-b7ee-b78cce26709e.mp3", //safe n sound
          "https://mp3tourl.com/audio/1788684823246-3a0c2f63-0c7a-4492-9f90-f5965a7eb98f.mp3", //final chapter
          "https://mp3tourl.com/audio/1788685779955-d4fd42cb-b1ba-420d-a45f-bcf0b57009ef.mp3", //boba date
          "https://mp3tourl.com/audio/1788685843284-a4e6bb91-06f7-42d4-965f-d88ae578f93a.mp3" //2 33
        ],
        "default": [
          "https://link-lagu-default-1.mp3",
          "https://link-lagu-default-2.mp3"
        ]
    };

    let selectedAudioSrc = "";
    const rareChance = 0.30; 
    const roll = Math.random();

    if (musicTheme !== "default" && multiPlaylists[musicTheme]) {
    
    if (roll < rareChance) {
      // RARE CONDITIONS: Pass small percentage rolls, pick up random songs from ALL other playlists
      const allOtherKeys = Object.keys(multiPlaylists).filter(k => k !== musicTheme && k !== "default");
      const randomOtherKey = allOtherKeys[Math.floor(Math.random() * allOtherKeys.length)];
      const otherPool = multiPlaylists[randomOtherKey];
      
      selectedAudioSrc = otherPool[Math.floor(Math.random() * otherPool.length)];

      if (rarePopup) {
        rarePopup.style.display = "block";
        
        // Sembunyikan otomatis setelah 5 detik
        setTimeout(() => {
          rarePopup.style.display = "none";
        }, 5000);
      }
      console.log(`✨ RARE DROP! [${musicTheme}] missed and got a surprise song from vibe: [${randomOtherKey}]`);
    
    } else {
      // NORMAL CONDITIONS: Take songs randomly from your own vibe playlist
      const currentPool = multiPlaylists[musicTheme];
      selectedAudioSrc = currentPool[Math.floor(Math.random() * currentPool.length)];
      console.log(`Active regular vibe: [${musicTheme}] plays songs from its own set.`);
    }

    } else {
        // DEFAULT CONDITIONS: If there is no vibe parameter or the contents are "default"
        const defaultPool = multiPlaylists["default"];
        selectedAudioSrc = defaultPool[Math.floor(Math.random() * defaultPool.length)];
        console.log("Playing default songs.");
    }

    // Enter the audio element
    audioElement.src = selectedAudioSrc;
    audioElement.load();

    const parallaxBg = document.getElementById('parallax-bg');
    const heroForeground = document.querySelector('.hero-foreground');
    const header = document.getElementById('main-header');
    const announcementBar = document.getElementById('announcement-bar');
    const eventGroup = document.getElementById('acara-group');

    // Register all required GSAP plugins
    if (typeof MorphSVGPlugin !== "undefined") {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer, MotionPathPlugin, MorphSVGPlugin);
    } else {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer, MotionPathPlugin);
    }

    /* ========================================================================
       GSAP HERO TYPOGRAPHY & FLAIR ANIMATIONS
       ======================================================================== */
    
    // 1. Reveal Hero Title Text smoothly on initial load
    const revealTimeline = gsap.timeline();
    
    revealTimeline.from(".flair-word-wrap > span", {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.08,
        ease: "power4.out"
    });

    // 2. Reveal & spin Windmill flair behind character 'e'
    revealTimeline.to(".home-hero__flair--windmill", {
        scale: 1,
        opacity: 0.85,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=0.6");

    // Continuous rotation loop for windmill flair
    gsap.to(".home-hero__flair--windmill", {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: "none"
    });

    // Interactive 3D flip animation for character 'e'
    gsap.to(".rotate-e", {
        rotationY: 360,
        duration: 2.5,
        repeat: -1,
        repeatDelay: 2.5,
        ease: "power2.inOut"
    });

    // 3. Reveal & wobble Circles flair behind character 'a'
    revealTimeline.to(".home-hero__flair--circles", {
        scale: 0.9,
        opacity: 0.7,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.4");

    // Ambient floating motion for circles flair
    gsap.to(".home-hero__flair--circles", {
        yPercent: "random([-10, 10])",
        xPercent: "random([-10, 10])",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 4. Periodic character 'i' to '!' toggle animation with Star flair pulse
    const charIElement = document.querySelector('.char-i');
    if (charIElement) {
        setInterval(() => {
            gsap.to(charIElement, {
                scaleY: 0.1,
                opacity: 0,
                duration: 0.3,
                ease: "power1.in",
                onComplete: () => {
                    charIElement.textContent = (charIElement.textContent === 'i') ? '!' : 'i';
                    charIElement.style.color = (charIElement.textContent === '!') ? 'var(--color-orange)' : '';

                    if (charIElement.textContent === '!') {
                        gsap.to(".home-hero__flair--star", {
                            scale: 1.1,
                            rotation: 45,
                            opacity: 0.9,
                            duration: 0.4,
                            ease: "back.out(2)"
                        });
                    } else {
                        gsap.to(".home-hero__flair--star", {
                            scale: 0,
                            rotation: 0,
                            opacity: 0,
                            duration: 0.3,
                            ease: "power2.in"
                        });
                    }

                    gsap.to(charIElement, {
                        scaleY: 1,
                        opacity: 1,
                        duration: 0.5,
                        ease: "elastic.out(1, 0.4)"
                    });
                }
            });
        }, 3000);
    }

    /* ========================================================================
       CONFETTI CANNON SYSTEM (Physics & Interactive Particles)
       ======================================================================== */
    class ConfettiCannon {
        constructor(heroElement) {
            this.hero = heroElement;
            this.explosionMap = {};
            this.explosionKeys = [];
        }

        init() {
            const preloadImages = this.hero.querySelectorAll(".explosion-preload img");

            preloadImages.forEach((img) => {
                const key = img.dataset.key || Math.random().toString();
                this.explosionMap[key] = img;
                this.explosionKeys.push(key);
            });

            this.initObserver();
        }

        initObserver() {
            const proxy = this.hero.querySelector(".pricing-hero__proxy");
            if (!proxy) return;

            const triggerExplosion = (clientX, clientY) => {
                const rect = this.hero.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;
                this.createExplosion(x, y, 400);
            };

            proxy.addEventListener("mousedown", (e) => {
                triggerExplosion(e.clientX, e.clientY);
            });

            proxy.addEventListener("touchstart", (e) => {
                const touch = e.touches[0];
                if (touch) {
                    triggerExplosion(touch.clientX, touch.clientY);
                }
            }, { passive: true });

            // Initial celebratory burst on page load
            setTimeout(() => {
                const rect = this.hero.getBoundingClientRect();
                this.createExplosion(rect.width / 2, rect.height / 2, 500);
            }, 1500);
        }

        createExplosion(x, y, distance = 300) {
            if (this.explosionKeys.length === 0) return;

            const count = Math.round(gsap.utils.clamp(12, 45, distance / 10));
            const particleMaxSize = 35;

            for (let i = 0; i < count; i++) {
                const randomKey = gsap.utils.random(this.explosionKeys);
                const originalImage = this.explosionMap[randomKey];
                if (!originalImage) continue;

                const particleImg = originalImage.cloneNode(true);
                particleImg.className = "explosion-img";
                particleImg.style.position = "absolute";
                particleImg.style.display = "block";
                particleImg.style.pointerEvents = "none";
                particleImg.style.height = `${gsap.utils.random(15, particleMaxSize)}px`;
                particleImg.style.width = "auto";
                particleImg.style.left = `${x}px`;
                particleImg.style.top = `${y}px`;
                particleImg.style.zIndex = "999";

                this.hero.appendChild(particleImg);

                const angle = Math.random() * Math.PI * 2;
                const speed = gsap.utils.random(150, 450);
                const targetX = Math.cos(angle) * speed;
                const targetY = Math.sin(angle) * speed + 300; // Gravity pull

                gsap.to(particleImg, {
                    x: targetX,
                    y: targetY,
                    rotation: gsap.utils.random(-360, 360),
                    duration: 1.2 + Math.random() * 0.6,
                    ease: "power2.out"
                });

                gsap.to(particleImg, {
                    opacity: 0,
                    scale: 0.2,
                    duration: 0.5,
                    delay: 0.7,
                    ease: "power1.in",
                    onComplete: () => particleImg.remove()
                });
            }
        }
    }

    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        const cannon = new ConfettiCannon(heroSection);
        cannon.init();
    }

    const scrollIndicator = document.getElementById('scroll-indicator');

    /* ========================================================================
       BRIDE & GROOM DROPDOWN (Desktop) & BOTTOM SHEET (Mobile)
       ======================================================================== */
    const dropdownWrap = document.getElementById('nav-dropdown-wrap');
    const dropdownTrigger = document.getElementById('nav-mempelai-trigger');
    const dropdownPanel = document.getElementById('nav-dropdown-panel');
    const mobileCoupleBtn = document.getElementById('mobile-mempelai-btn');
    const coupleSheet = document.getElementById('mempelai-sheet');
    const sheetBackdrop = document.getElementById('mempelai-sheet-backdrop');

    // Desktop hover handling
    if (dropdownWrap) {
        let hoverCloseTimer = null;

        const openDropdown = () => {
            if (window.innerWidth < 768) return;
            clearTimeout(hoverCloseTimer);
            dropdownWrap.classList.add('open');
            dropdownTrigger?.setAttribute('aria-expanded', 'true');
        };

        const closeDropdown = () => {
            hoverCloseTimer = setTimeout(() => {
                dropdownWrap.classList.remove('open');
                dropdownTrigger?.setAttribute('aria-expanded', 'false');
            }, 120);
        };

        dropdownWrap.addEventListener('mouseenter', openDropdown);
        dropdownWrap.addEventListener('mouseleave', closeDropdown);

        dropdownPanel?.querySelectorAll('.dropdown-card').forEach(card => {
            card.addEventListener('click', () => {
                dropdownWrap.classList.remove('open');
                dropdownTrigger?.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Mobile bottom sheet toggles
    const openSheet = () => {
        coupleSheet?.classList.add('open');
        sheetBackdrop?.classList.add('open');
        mobileCoupleBtn?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeSheet = () => {
        coupleSheet?.classList.remove('open');
        sheetBackdrop?.classList.remove('open');
        mobileCoupleBtn?.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileCoupleBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (coupleSheet?.classList.contains('open')) {
            closeSheet();
        } else {
            openSheet();
        }
    });

    sheetBackdrop?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSheet();
    });

    sheetBackdrop?.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSheet();
    }, { passive: false });

    coupleSheet?.querySelectorAll('.dropdown-card').forEach(card => {
        card.addEventListener('click', closeSheet);
    });

    document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
        if (item !== mobileCoupleBtn) {
            item.addEventListener('click', closeSheet);
        }
    });

    // Close overlays on Escape keypress
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdownWrap?.classList.remove('open');
            dropdownTrigger?.setAttribute('aria-expanded', 'false');
            closeSheet();
        }
    });

    /* ========================================================================
       SCROLL-LINKED EFFECTS & PARALLAX
       ======================================================================== */
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Fade out scroll indicator on scroll start
        if (scrollIndicator) {
            const fadeProgress = Math.min(1, scrollY / 180);
            scrollIndicator.style.opacity = `${1 - fadeProgress}`;
            scrollIndicator.style.transform = `translateY(${fadeProgress * 20}px)`;
            scrollIndicator.style.pointerEvents = fadeProgress > 0.9 ? 'none' : 'auto';
        }

        // Header sticky translation logic
        const pushStartThreshold = window.innerHeight - 70;
        const navbarTop = 70;
        const eventGroupBottom = eventGroup ? (eventGroup.offsetTop + eventGroup.offsetHeight) : 0;

        if (announcementBar) {
            if (scrollY < pushStartThreshold) {
                announcementBar.style.transform = 'translateY(0)';
            } else if (scrollY >= pushStartThreshold && scrollY <= window.innerHeight) {
                const pushOffset = scrollY - pushStartThreshold;
                announcementBar.style.transform = `translateY(${-pushOffset}px)`;
            } else if (scrollY > window.innerHeight && eventGroupBottom > 0 && scrollY < eventGroupBottom - 70) {
                announcementBar.style.transform = 'translateY(-70px)';
            } else if (eventGroupBottom > 0 && scrollY >= eventGroupBottom - 70 && scrollY <= eventGroupBottom) {
                const slideOffset = scrollY - (eventGroupBottom - 70);
                announcementBar.style.transform = `translateY(${-70 + slideOffset}px)`;
            } else {
                announcementBar.style.transform = 'translateY(0)';
            }
        }

        if (header) {
            header.style.transform = `translateY(${navbarTop}px)`;
            if (scrollY > pushStartThreshold) {
                header.classList.add('shifted');
            } else {
                header.classList.remove('shifted');
            }
        }

        // Hero Parallax Effect
        if (scrollY < window.innerHeight && parallaxBg && heroForeground) {
            parallaxBg.style.transform = `translateY(${scrollY * 0.4}px)`;
            heroForeground.style.transform = `translateY(${scrollY * -0.1}px)`;
            heroForeground.style.opacity = `${1 - (scrollY / (window.innerHeight * 0.8))}`;
        }

        // Back to top button visibility toggle
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    // Smooth Back-to-Top scrolling
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth Anchor Navigation with ScrollTrigger recalculation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Land target banner exactly at top of viewport (top: 0)
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset;

                    window.scrollTo({
                        top: Math.max(0, offsetPosition),
                        behavior: 'smooth'
                    });

                    const refreshAndSnap = () => {
                        ScrollTrigger.getAll().forEach(st => st.update());
                        ScrollTrigger.refresh();
                    };
                    setTimeout(refreshAndSnap, 500);
                    setTimeout(refreshAndSnap, 1000);
                }
            }
        });
    });

    // Background Audio Controller
    const musicBtn = document.getElementById('music-toggle-btn');
    const audioEl = document.getElementById('bg-music');
    if (musicBtn && audioEl) {
        musicBtn.addEventListener('click', () => {
            if (audioEl.paused) {
                audioEl.play();
                musicBtn.classList.add('playing');
            } else {
                audioEl.pause();
                musicBtn.classList.remove('playing');
            }
        });
    }

    /* ========================================================================
       RSVP FORM & GUESTBOOK FEED MANAGEMENT
       ======================================================================== */
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccessMessage = document.getElementById('rsvpSuccessMessage');
    const API_BASE = 'https://script.google.com/macros/s/AKfycbx1w_z_KsBTTQuM1zN8ZCOF9K6LT6-9_RlI4EvvdlOGhiTygSzPpOL1fr97CcaDEB8uWA/exec';
    const API_URL = API_BASE ? API_BASE : null;

    /**
     * Renders array of guestbook entries to DOM.
     * @param {Array} entries Guest entries list.
     */
    function renderGuestbook(entries) {
        const feed = document.getElementById('guestbook-feed');
        const emptyState = document.getElementById('guestbook-empty');
        if (!feed) return;

        feed.querySelectorAll('.guestbook-card').forEach(card => card.remove());

        if (!entries || entries.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            [...entries].reverse().forEach((entry, i) => {
                addGuestbookCard(feed, entry, i);
            });
        }
    }

    /**
     * Creates and appends a guestbook card to the feed.
     */
    function addGuestbookCard(feed, entry, delayIndex) {
        const initials = entry.name ? entry.name.trim().charAt(0).toUpperCase() : '?';
        const isAttending = entry.attendance === 'hadir';
        const attendLabel = isAttending
            ? '<i class="fa-solid fa-circle-check"></i> hadir'
            : '<i class="fa-solid fa-circle-xmark"></i> tidak hadir';
        const attendClass = isAttending ? 'hadir' : 'tidak-hadir';
        const wishesHTML = entry.wishes ? `<p class="guestbook-wishes">"${entry.wishes}"</p>` : '';

        const card = document.createElement('div');
        card.className = 'guestbook-card';
        card.style.animationDelay = `${delayIndex * 0.07}s`;
        card.innerHTML = `
            <div class="guestbook-card-header">
                <div class="guestbook-avatar">${initials}</div>
                <div class="guestbook-meta">
                    <span class="guestbook-name">${entry.name}</span>
                    <span class="guestbook-attendance ${attendClass}">${attendLabel}</span>
                </div>
            </div>
            ${wishesHTML}
            <span class="guestbook-time">${entry.time || ''}</span>
        `;
        feed.appendChild(card);
    }

    /**
     * Fetches guestbook entries from API or local storage fallback.
     */
    async function loadGuestbook() {
        if (API_URL) {
            try {
                const res = await fetch(API_URL);
                const json = await res.json();
                if (json) {
                    renderGuestbook(json);
                    return;
                }
            } catch (err) {
                console.warn("Failed fetching server guestbook, using offline storage fallback:", err);
            }
        }
        const localEntries = JSON.parse(localStorage.getItem('rsvp_entries') || '[]');
        renderGuestbook(localEntries);
    }

    /**
     * Animates submission success response UI.
     */
    function showSuccessMessage() {
        if (!rsvpForm || !rsvpSuccessMessage) return;

        rsvpForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        rsvpForm.style.opacity = '0';
        rsvpForm.style.transform = 'scale(0.95)';

        setTimeout(() => {
            rsvpForm.style.display = 'none';
            rsvpSuccessMessage.style.opacity = '0';
            rsvpSuccessMessage.style.display = 'block';
            rsvpSuccessMessage.style.transform = 'scale(0.95)';
            rsvpSuccessMessage.offsetHeight; // force reflow
            rsvpSuccessMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            rsvpSuccessMessage.style.opacity = '1';
            rsvpSuccessMessage.style.transform = 'scale(1)';

            setTimeout(() => {
                document.getElementById('guestbook')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 2000);
        }, 2000);
    }

    // Initial guestbook fetch
    loadGuestbook();

    // Form submission listener
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = rsvpForm.querySelector('[type="submit"]');
            if (!submitBtn) return;

            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> menyimpan...';

            const payload = {
                name: document.getElementById('rsvp-name').value.trim(),
                attendance: document.getElementById('rsvp-attendance').value,
                guests: document.getElementById('rsvp-guests').value,
                wishes: document.getElementById('rsvp-wishes').value.trim(),
            };

            let savedSuccessfully = false;

            if (API_URL) {
                try {
                    const res = await fetch(API_URL, {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    const json = await res.json();
                    if (json) {
                        savedSuccessfully = true;
                        await loadGuestbook();
                    }
                } catch (err) {
                    console.warn("Failed sending RSVP to server, using local fallback:", err);
                }
            }

            if (!savedSuccessfully) {
                const entries = JSON.parse(localStorage.getItem('rsvp_entries') || '[]');
                const now = new Date();
                entries.push({
                    ...payload,
                    id: Date.now(),
                    time: now.toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    }),
                });
                localStorage.setItem('rsvp_entries', JSON.stringify(entries));
                loadGuestbook();
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            showSuccessMessage();
        });
    }

    /* ========================================================================
       FOOTER REVEAL & BOUNCY WAVE ANIMATION
       ======================================================================== */
    const footerElement = document.getElementById('main-footer');
    const giantApipiText = document.getElementById('footer-giant-apipi');

    if (footerElement && giantApipiText) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    giantApipiText.classList.add('reveal-active');
                } else {
                    giantApipiText.classList.remove('reveal-active');
                }
            });
        }, { threshold: 0.15 });

        observer.observe(footerElement);
    }

    const bouncyPath = document.getElementById('bouncy-path');
    const footerBouncyWrapper = document.getElementById('footer-bouncy-wrapper');

    if (bouncyPath && footerBouncyWrapper) {
        const pathDown = 'M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z';
        const pathCenter = 'M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z';

        let idleTween = null;

        const startIdleWaveLoop = () => {
            if (idleTween) idleTween.kill();

            if (typeof MorphSVGPlugin !== "undefined") {
                idleTween = gsap.to(bouncyPath, {
                    duration: 3,
                    morphSVG: pathDown,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            } else {
                idleTween = gsap.to(bouncyPath, {
                    duration: 3,
                    attr: { d: pathDown },
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        };

        startIdleWaveLoop();

        ScrollTrigger.create({
            trigger: footerBouncyWrapper,
            start: 'top 95%',
            onEnter: self => {
                const velocity = self.getVelocity();
                const variation = gsap.utils.clamp(-0.8, 0.8, velocity / 10000);
                if (idleTween) idleTween.kill();

                const onBounceComplete = () => {
                    startIdleWaveLoop();
                };

                if (typeof MorphSVGPlugin !== "undefined") {
                    gsap.fromTo(bouncyPath, {
                        morphSVG: pathDown
                    }, {
                        duration: 1.8,
                        morphSVG: pathCenter,
                        ease: `elastic.out(${1 + Math.abs(variation)}, ${0.4 + Math.abs(variation) * 0.3})`,
                        onComplete: onBounceComplete
                    });
                } else {
                    gsap.fromTo(bouncyPath, {
                        attr: { d: pathDown }
                    }, {
                        duration: 2,
                        attr: { d: pathCenter },
                        ease: `elastic.out(${1 + Math.abs(variation)}, ${0.4 + Math.abs(variation) * 0.3})`,
                        overwrite: 'auto'
                    });
                }
            }
        });
    }

});

/* ============================================================================
   GIFT POPUP MODAL & CLIPBOARD UTILITIES
   ============================================================================ */

/**
 * Opens the digital gift modal and displays the relevant bank account card.
 * @param {'wanita'|'pria'|undefined} target Selected groom or bride account card.
 */
function openGiftModal(target) {
    const modal = document.getElementById('gift-modal');
    const backdrop = document.getElementById('gift-modal-backdrop');
    const cardBride = document.getElementById('card-wanita');
    const cardGroom = document.getElementById('card-pria');

    if (cardBride && cardGroom) {
        if (target === 'wanita') {
            cardBride.style.display = 'block';
            cardGroom.style.display = 'none';
        } else if (target === 'pria') {
            cardBride.style.display = 'none';
            cardGroom.style.display = 'block';
        } else {
            cardBride.style.display = 'block';
            cardGroom.style.display = 'block';
        }
    }

    if (modal && backdrop) {
        backdrop.classList.add('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Closes the digital gift popup modal.
 */
function closeGiftModal() {
    const modal = document.getElementById('gift-modal');
    const backdrop = document.getElementById('gift-modal-backdrop');
    if (modal && backdrop) {
        backdrop.classList.remove('active');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Copies the bank account number to user's clipboard.
 * @param {string} elementId ID of the element containing text to copy.
 * @param {Event} event Click event reference.
 */
function copyBankAccount(elementId, event) {
    const accountElement = document.getElementById(elementId);
    if (!accountElement) return;

    const textToCopy = accountElement.innerText.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = event?.currentTarget || event?.target;
        if (!copyBtn) return;

        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> tersalin!';

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error("Failed copying bank account number:", err);
    });
}
