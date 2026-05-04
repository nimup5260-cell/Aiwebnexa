// Welcome Banner Animation Handler
const welcomeBanner = document.querySelector(".welcome-banner");
if (welcomeBanner) {
  // Remove banner from DOM after animation completes (3.5s total: 0.5s delay + 3s animation)
  setTimeout(() => {
    welcomeBanner.style.display = "none";
  }, 3500);

  // Allow click to close banner early
  welcomeBanner.addEventListener("click", () => {
    welcomeBanner.style.animation = "none";
    welcomeBanner.style.opacity = "0";
    welcomeBanner.style.display = "none";
  });
}

const navLinks = document.querySelector(".nav-links");
const menuToggle = document.querySelector(".menu-toggle");
const navAnchors = [...document.querySelectorAll(".nav-links a")];
const tabs = [...document.querySelectorAll(".tab")];
const cards = [...document.querySelectorAll(".service-card")];
const reveals = document.querySelectorAll("[data-reveal]");
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;
    tabs.forEach((item) => item.classList.toggle("active", item === tab));

    cards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !matches);
    });
  });
});

// Project Filter Functionality
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-showcase-card");
const noResults = document.getElementById("noResults");

function filterProjects(filter, clickedBtn) {
  // Update active button
  filterBtns.forEach((item) => item.classList.remove("active"));
  if (clickedBtn) clickedBtn.classList.add("active");

  // Filter project cards with smooth transition
  let visibleCount = 0;
  projectCards.forEach((card, index) => {
    const matches = filter === "all" || card.dataset.category === filter;
    
    if (matches) {
      card.classList.remove("hidden");
      card.style.transitionDelay = `${index * 0.05}s`;
      visibleCount++;
    } else {
      card.classList.add("hidden");
      card.style.transitionDelay = "0s";
    }
  });

  // Toggle no results message
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterProjects(btn.dataset.filter, btn);
  });
});

// No results "View All" button
const noResultsBtn = noResults?.querySelector(".filter-btn");
if (noResultsBtn) {
  noResultsBtn.addEventListener("click", () => {
    filterProjects("all", document.querySelector('.filter-btn[data-filter="all"]'));
  });
}

// Update filter counts dynamically
function updateFilterCounts() {
  filterBtns.forEach((btn) => {
    const filter = btn.dataset.filter;
    const countSpan = btn.querySelector(".filter-count");
    if (!countSpan) return;
    
    if (filter === "all") {
      countSpan.textContent = projectCards.length;
    } else {
      const count = [...projectCards].filter((card) => card.dataset.category === filter).length;
      countSpan.textContent = count;
    }
  });
}

updateFilterCounts();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  reveals.forEach((item) => revealObserver.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("visible"));
}

// Counter Animation for Project Stats
const counters = document.querySelectorAll(".counter");
const statsSection = document.querySelector(".project-stats-section");

if (counters.length > 0 && statsSection && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        counters.forEach((counter) => {
          const target = parseInt(counter.parentElement.dataset.count);
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          
          const updateCounter = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target + (target === 100 ? "%" : "+");
            }
          };
          
          updateCounter();
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counterObserver.observe(statsSection);
} else if (counters.length > 0) {
  counters.forEach((counter) => {
    const target = parseInt(counter.parentElement.dataset.count);
    counter.textContent = target + (target === 100 ? "%" : "+");
  });
}

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    status.className = "status";

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const service = String(data.get("service") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !phone || !email || !service || !message) {
      status.textContent = "Please fill in all required fields before sending your inquiry.";
      status.classList.add("error");
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneValid = /^[0-9+\-\s()]{8,}$/.test(phone);

    if (!emailValid) {
      status.textContent = "Please enter a valid email address.";
      status.classList.add("error");
      return;
    }

    if (!phoneValid) {
      status.textContent = "Please enter a valid phone number.";
      status.classList.add("error");
      return;
    }

    status.textContent = `Thanks ${name}, your inquiry for ${service} is ready. This demo page is not connected to a backend yet, but the form is working with validation.`;
    status.classList.add("success");
    form.reset();
  });
}

// Carousel Navigation
const posterTrack = document.getElementById("posterTrack");
const logoTrack = document.getElementById("logoTrack");
const websiteTrack = document.getElementById("websiteTrack");

// Setup carousel navigation for a track
function setupCarouselNavigation(track, scrollAmount) {
  if (!track) return;
  
  const carousel = track.closest(".poster-carousel");
  if (!carousel) return;
  
  const leftBtn = carousel.querySelector(".nav-left");
  const rightBtn = carousel.querySelector(".nav-right");
  
  if (!leftBtn || !rightBtn) return;
  
  leftBtn.addEventListener("click", () => {
    track.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

  rightBtn.addEventListener("click", () => {
    track.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });

  const updateNavButtons = () => {
    leftBtn.style.opacity = track.scrollLeft <= 0 ? "0.4" : "1";
    leftBtn.style.pointerEvents = track.scrollLeft <= 0 ? "none" : "auto";
    
    const maxScroll = track.scrollWidth - track.clientWidth;
    rightBtn.style.opacity = track.scrollLeft >= maxScroll - 10 ? "0.4" : "1";
    rightBtn.style.pointerEvents = track.scrollLeft >= maxScroll - 10 ? "none" : "auto";
  };

  track.addEventListener("scroll", updateNavButtons);
  updateNavButtons();
}

// Setup all carousels
if (posterTrack) setupCarouselNavigation(posterTrack, 308);
if (logoTrack) setupCarouselNavigation(logoTrack, 268);
if (websiteTrack) setupCarouselNavigation(websiteTrack, 398);

// All Gallery Lightbox Functionality
const lightbox = document.getElementById("posterLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const posterItems = document.querySelectorAll(".poster-item");
const logoItems = document.querySelectorAll(".logo-item");
const websiteItems = document.querySelectorAll(".website-item");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
let currentPosterIndex = 0;

// Combine all gallery items for lightbox
const allGalleryItems = [...posterItems, ...logoItems, ...websiteItems];

if (lightbox && allGalleryItems.length > 0) {
  const allItems = [...allGalleryItems];

  // Open lightbox on poster/logo click
  allItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  // Close lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navigation
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => navigateLightbox(1));
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      navigateLightbox(-1);
    } else if (e.key === "ArrowRight") {
      navigateLightbox(1);
    }
  });

  function openLightbox(index) {
    currentPosterIndex = index;
    const img = allItems[index].querySelector("img");
    const caption = allItems[index].querySelector(".poster-overlay span");

    if (img && lightboxImage) {
      const freshSrc = img.src + (img.src.includes('?') ? '&' : '?') + 't=' + Date.now();
      lightboxImage.src = freshSrc;
      lightboxImage.alt = img.alt;
      lightboxImage.style.opacity = "0";
      
      lightboxImage.onload = function() {
        lightboxImage.style.opacity = "1";
        lightboxImage.style.transition = "opacity 0.3s ease";
      };
    }

    if (caption && lightboxCaption) {
      lightboxCaption.textContent = caption.textContent;
    }

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function navigateLightbox(direction) {
    currentPosterIndex += direction;

    if (currentPosterIndex < 0) {
      currentPosterIndex = allItems.length - 1;
    } else if (currentPosterIndex >= allItems.length) {
      currentPosterIndex = 0;
    }

    openLightbox(currentPosterIndex);
  }
}

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.querySelector('[name="name"]').value;
  let phone = document.querySelector('[name="phone"]').value;
  let email = document.querySelector('[name="email"]').value;
  let service = document.querySelector('[name="service"]').value;
  let message = document.querySelector('[name="message"]').value;

  let text = `New Inquiry:%0A
Name: ${name}%0A
Phone: ${phone}%0A
Email: ${email}%0A
Service: ${service}%0A
Message: ${message}`;

  let url = `https://wa.me/917984319140?text=${text}`;

  window.open(url, "_blank");
});
