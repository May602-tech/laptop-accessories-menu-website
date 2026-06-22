/* HAMBURGER MENU */
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("show");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("show");
    });
  });
}

/* SMOOTH ANCHOR LINKS */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", targetId);
    setTimeout(updateActiveNav, 450);
  });
});

/* ACTIVE NAVBAR */
const sections = document.querySelectorAll("section[id], footer[id]");

function updateActiveNav() {
  let currentSection = document.body.dataset.page || "home";
  const pageBottom = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (pageBottom >= documentHeight - 8) {
    currentSection = "contact";
  } else {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160;

      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });
  }

  navLinks.forEach((link) => {
    const linkTarget = link.getAttribute("href");

    link.classList.remove("active");

    if (
      linkTarget === `#${currentSection}` ||
      (currentSection === "accessories" && linkTarget === "accessories.html")
    ) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

/* CATALOG FILTER */
const catalogSearch = document.getElementById("catalogSearch");
const categoryButtons = document.querySelectorAll("[data-category].sidebar-link");
const catalogCards = document.querySelectorAll(".catalog-card[data-category]");
const catalogEmpty = document.getElementById("catalogEmpty");
let activeCategory = "all";

function setCatalogCategory(category) {
  activeCategory = category || "all";

  categoryButtons.forEach((item) => {
    item.classList.toggle("active", item.dataset.category === activeCategory);
  });

  filterCatalog();
}

function filterCatalog() {
  if (!catalogCards.length) return;

  const query = catalogSearch ? catalogSearch.value.trim().toLowerCase() : "";
  let visibleCount = 0;

  catalogCards.forEach((card) => {
    const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
    const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
    const isVisible = matchesCategory && matchesSearch;

    card.classList.toggle("hidden", !isVisible);
    if (isVisible) visibleCount += 1;
  });

  if (catalogEmpty) {
    catalogEmpty.classList.toggle("show", visibleCount === 0);
  }
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCatalogCategory(button.dataset.category);
  });
});

if (catalogSearch) {
  catalogSearch.addEventListener("input", filterCatalog);
}

if (catalogCards.length) {
  const initialCategory = window.location.hash.replace("#", "");
  const hasInitialCategory = Array.from(categoryButtons).some(
    (button) => button.dataset.category === initialCategory
  );

  setCatalogCategory(hasInitialCategory ? initialCategory : "all");
}

document.querySelectorAll(".details-link").forEach((link) => {
  link.addEventListener("click", () => {
    const card = link.closest(".catalog-card");
    if (!card) return;

    const image = card.querySelector("img");
    const title = card.querySelector("h3");
    const description = card.querySelector("p");
    const price = card.querySelector("strong");
    const category = card.querySelector(".catalog-badge");
    const url = new URL(link.href, window.location.href);

    if (image) url.searchParams.set("img", image.getAttribute("src"));
    if (title) url.searchParams.set("title", title.textContent.trim());
    if (description) url.searchParams.set("desc", description.textContent.trim());
    if (price) url.searchParams.set("price", price.textContent.trim());
    if (category) url.searchParams.set("category", category.textContent.trim());

    link.href = url.pathname.split("/").pop() + url.search;
  });
});

/* PRODUCT DETAIL */
const productData = {
  "laptop-battery": {
    title: "Laptop Battery",
    category: "Battery",
    price: "Ask Price",
    image: "assets/images/adapter.svg",
    subtitle: "Original and replacement laptop battery options for common models.",
    description: "A clean replacement option for laptops with weak backup time, charging issues, or aging battery performance. Message TechHub with your laptop model before ordering.",
    points: ["Model checking before order", "Original and compatible options", "Good for weak backup time", "Pickup available in Hlaing"],
    specs: ["Category: Laptop Battery", "Condition: Original / Replacement", "Support: Model checking required", "Order: Viber or phone call"]
  },
  "high-capacity-battery": {
    title: "High Capacity Battery",
    category: "Battery",
    price: "Ask Price",
    image: "assets/images/battery.png",
    subtitle: "Longer backup battery option for class, office, and travel.",
    description: "Suitable for users who need better backup time for daily laptop work. Availability depends on laptop brand and model.",
    points: ["Longer backup focus", "Brand/model checking", "Daily work friendly", "Quick reply on Viber"],
    specs: ["Category: Laptop Battery", "Type: High capacity", "Compatibility: Depends on model", "Warranty: Ask shop"]
  },
  "laptop-keypad": {
    title: "Laptop Keypad",
    category: "Keypad",
    price: "Ask Price",
    image: "assets/images/keyboard.svg",
    subtitle: "Laptop keyboard and keypad replacement support.",
    description: "For broken keys, typing issues, missing keys, or keyboard replacement needs. Send your laptop model and keyboard photo for checking.",
    points: ["Keyboard replacement support", "Model checking available", "Good for broken keys", "Clean setup service"],
    specs: ["Category: Laptop Keypad", "Support: Replacement", "Compatibility: Model based", "Order: Contact before pickup"]
  },
  "external-keyboard": {
    title: "External Keyboard",
    category: "Keypad",
    price: "25,000 MMK",
    image: "assets/images/keyboard.svg",
    subtitle: "Comfortable external keyboard for study and desk setups.",
    description: "A simple keyboard option for office work, gaming-light setups, study, and home desks.",
    points: ["Comfortable typing", "Desk setup friendly", "Easy plug and use", "Affordable price"],
    specs: ["Category: Keyboard", "Use: Office / Study", "Connection: USB or wireless option", "Color: Ask availability"]
  },
  "laptop-adapter": {
    title: "Laptop Adapter",
    category: "Adapter",
    price: "30,000 MMK",
    image: "assets/images/adapter.svg",
    subtitle: "Reliable charger and power adapter for daily laptop charging.",
    description: "Useful for replacing lost, damaged, or weak chargers. Send your laptop brand, voltage, ampere, and charging pin photo before ordering.",
    points: ["Brand/model checking", "Daily charging use", "Multiple watt options", "Quick order on Viber"],
    specs: ["Category: Laptop Adapter", "Power: Model based", "Compatibility: Brand and pin type", "Price: Starts from 30,000 MMK"]
  },
  "type-c-hub": {
    title: "Type-C Hub",
    category: "Adapter",
    price: "20,000 MMK",
    image: "assets/images/adapter.svg",
    subtitle: "Compact hub for USB, HDMI, and charging connection.",
    description: "A small hub for laptops that need extra ports. Good for presentations, external displays, flash drives, and desk setups.",
    points: ["Compact design", "USB and HDMI support", "Good for modern laptops", "Easy to carry"],
    specs: ["Category: Hub / Adapter", "Ports: USB / HDMI options", "Use: Laptop and tablet", "Price: 20,000 MMK"]
  },
  "laptop-lcd": {
    title: "Laptop LCD",
    category: "LCD",
    price: "Ask Price",
    image: "assets/images/keyboard.svg",
    subtitle: "Laptop display panel replacement and checking support.",
    description: "For cracked screens, lines on display, dim panels, or replacement needs. Price depends on size, resolution, and laptop model.",
    points: ["Screen model checking", "Panel replacement support", "For cracked or lined displays", "Ask price by model"],
    specs: ["Category: Laptop LCD", "Size: Model based", "Resolution: Depends on panel", "Service: Checking required"]
  },
  "display-cable": {
    title: "Display Cable",
    category: "LCD",
    price: "Ask Price",
    image: "assets/images/keyboard.svg",
    subtitle: "Laptop display cable checking and replacement support.",
    description: "Helpful for display flicker, loose screen connection, or no-display problems caused by cable issues.",
    points: ["Display cable checking", "Flicker issue support", "Model based parts", "Contact before order"],
    specs: ["Category: LCD Parts", "Use: Display connection", "Compatibility: Model based", "Price: Ask shop"]
  },
  "wireless-mouse": {
    title: "Wireless Mouse",
    category: "Others",
    price: "15,000 MMK",
    image: "assets/images/mouse.svg",
    subtitle: "Silent Bluetooth mouse for office, study, and daily work.",
    description: "A clean daily mouse for laptop users who want a simple, portable, and comfortable accessory.",
    points: ["Silent click feel", "Portable size", "Good for office and study", "Affordable daily accessory"],
    specs: ["Category: Mouse", "Connection: Wireless / Bluetooth option", "Use: Office / Study", "Price: 15,000 MMK"]
  },
  "laptop-stand": {
    title: "Laptop Stand",
    category: "Others",
    price: "18,000 MMK",
    image: "assets/images/adapter.svg",
    subtitle: "Adjustable laptop stand for a cleaner desk setup.",
    description: "Helps lift your laptop screen, improve desk posture, and keep the setup tidy for work or study.",
    points: ["Adjustable angle", "Desk setup friendly", "Portable design", "Good for daily laptop users"],
    specs: ["Category: Stand", "Use: Laptop desk setup", "Design: Adjustable", "Price: 18,000 MMK"]
  }
};

function populateProductDetail() {
  const detailTitle = document.getElementById("detailTitle");
  if (!detailTitle) return;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);

  const params = new URLSearchParams(window.location.search);
  const itemKey = params.get("item") || "laptop-adapter";
  const savedProduct = productData[itemKey] || {};
  const product = {
    title: params.get("title") || savedProduct.title || "TechHub Accessory",
    category: params.get("category") || savedProduct.category || "Accessories",
    price: params.get("price") || savedProduct.price || "Ask Price",
    image: params.get("img") || savedProduct.image || "assets/images/adapter.svg",
    subtitle: params.get("desc") || savedProduct.subtitle || "Quality laptop accessory from TechHub.",
    description: savedProduct.description || params.get("desc") || "Contact TechHub on Viber with your model or product photo for availability, price, and pickup details.",
    points: savedProduct.points || ["Model checking available", "Quick reply on Viber", "Hlaing pickup available", "Contact before order"],
    specs: savedProduct.specs || ["Category: Accessories", "Availability: Ask shop", "Order: Viber or phone call", "Location: Hlaing Township"]
  };

  document.title = `${product.title} | TechHub Accessories`;
  document.getElementById("detailBreadcrumb").textContent = product.title;
  document.getElementById("detailCategory").textContent = product.category;
  detailTitle.textContent = product.title;
  document.getElementById("detailSubtitle").textContent = product.subtitle;
  document.getElementById("detailPrice").textContent = product.price;
  document.getElementById("detailDescription").textContent = product.description;

  const detailImage = document.getElementById("detailImage");
  if (detailImage) {
    detailImage.src = product.image;
    detailImage.alt = product.title;
  }

  const points = document.getElementById("detailPoints");
  points.innerHTML = product.points.map((point) => `<li>${point}</li>`).join("");

  const specs = document.getElementById("detailSpecs");
  specs.innerHTML = product.specs.map((spec) => `<li>${spec}</li>`).join("");
}

populateProductDetail();

/* PAGE MOTION */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setupPageMotion() {
  document.documentElement.classList.add("motion-ready");

  const revealSelectors = [
    ".section-heading",
    ".most-slider-wrap",
    ".category-card",
    ".catalog-hero > *",
    ".catalog-sidebar",
    ".catalog-toolbar",
    ".catalog-card",
    ".breadcrumb",
    ".product-gallery",
    ".product-summary",
    ".detail-panel",
    ".related-card",
    ".footer-block",
    ".footer-bottom"
  ];
  const revealItems = document.querySelectorAll(revealSelectors.join(","));

  revealItems.forEach((item) => {
    item.classList.add("reveal-item");
    const siblings = Array.from(item.parentElement.children).filter((sibling) =>
      sibling.matches(revealSelectors.join(","))
    );
    const siblingIndex = siblings.indexOf(item);
    item.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 5) * 70}ms`);
  });

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -45px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

setupPageMotion();

/* MOST ORDERED AUTO SLIDER */
const mostSlider = document.getElementById("mostSlider");
let mostSliderPaused = false;

function autoSlideMost() {
  if (!mostSlider || mostSliderPaused || document.hidden) return;

  const firstCard = mostSlider.firstElementChild;
  if (!firstCard) return;

  const gap = 26;
  const cardWidth = firstCard.offsetWidth + gap;

  mostSlider.style.transition = "transform 0.8s ease";
  mostSlider.style.transform = `translateX(-${cardWidth}px)`;

  setTimeout(() => {
    mostSlider.style.transition = "none";
    mostSlider.appendChild(firstCard);
    mostSlider.style.transform = "translateX(0)";
  }, 800);
}

if (mostSlider && !prefersReducedMotion.matches) {
  mostSlider.addEventListener("mouseenter", () => { mostSliderPaused = true; });
  mostSlider.addEventListener("mouseleave", () => { mostSliderPaused = false; });
  mostSlider.addEventListener("focusin", () => { mostSliderPaused = true; });
  mostSlider.addEventListener("focusout", () => { mostSliderPaused = false; });
  setInterval(autoSlideMost, 3500);
}
