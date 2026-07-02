/* COLOR THEME */
const themeToggle = document.getElementById("themeToggle");

function updateThemeToggle(theme) {
  if (!themeToggle) return;
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  updateThemeToggle(theme);

  try {
    localStorage.setItem("techhub-theme", theme);
  } catch (error) {
    // The selected theme still works when storage is unavailable.
  }
}

if (themeToggle) {
  updateThemeToggle(document.documentElement.dataset.theme || "light");
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme || "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

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

   "dell-m5y1k": {
    title: "Dell M5Y1K",
    category: "Battery",
    price: "Ask Price",
    image: "assets/images/battery/m5y1k.png",
    subtitle: "Original 4-cell Dell laptop battery with reliable, long-lasting performance.",
    description: "A reliable replacement battery compatible with select Dell Inspiron and Vostro laptops, offering stable performance, long battery life, and built-in safety protection.",
    points: ["မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
    specs: [ "Category: Laptop Battery","Model: Dell M5Y1K","Condition: Original / Replacement","Warranty: 6months"]
  },
  
  "dell-mr90y": {
    title: "Dell MR90Y",
    category: "Battery",
    price: "Ask Price",
    image: "assets/images/battery/mr90y.png",
    subtitle: "Original and replacement Dell MR90Y laptop battery options.",
    description: "A dependable replacement battery for Dell laptops with poor backup time, charging issues, or battery wear. Message TechHub with your laptop model before ordering.",
    points: ["မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
    specs: ["Category: Laptop Battery", "Condition: Original / Replacement", "Support: Model checking required", "Warranty: 6months "]
  },
  "dell-wdx0r": {
    title: "Dell WDX0R",
    category: "Battery",
    price: "Ask Price",
    image: "assets/images/battery/wdx0r.png",
    subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
    description: "A reliable replacement battery compatible with select Dell laptops, offering stable performance, long battery life, and built-in safety protection.",
    points: ["မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
    specs: ["Category: Laptop Battery","Model: Dell WDX0R","Condition: Original / Replacement","Warranty: 6months"]
  },
  "dell-yrdd6": {
  title: "Dell YRDD6",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/yrdd6.png",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "A reliable replacement battery compatible with select Dell Inspiron and Vostro laptops, delivering stable performance, dependable backup time, and built-in safety protection.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: [
    "Category: Laptop Battery",
    "Model: Dell YRDD6",
    "Condition: Original / Replacement",
    "Warranty: 6months"
  ]
},
  "dell-xcmrd": {
  title: "Dell XCMRD",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/xcmrd.png",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "A reliable replacement battery compatible with select Dell Inspiron and Vostro laptops, delivering stable performance, dependable backup time, and built-in safety protection.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: ["Category: Laptop Battery","Model: Dell XCMRD","Condition: Original / Replacement","Warranty: 6months"]
  },

  "acer-al12a32": {
  title: "Acer AL12A32",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/al12a32.png",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "The Acer AL12A32 is a reliable Li-ion laptop battery designed to meet original equipment manufacturer standards and maintain safe long-term performance.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: [
    "Category: Laptop Battery",
    "Model: Acer AL12A32",
    "Condition: Original / Replacement",
    "Warranty: 6months"
  ]
},
"acer-al15a32": {
  title: "Acer AL12A32",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/al15a32.png",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "The Acer AL15A32 battery offers a reliable replacement option for compatible Acer laptops, providing up to 37Wh of energy, robust safety features, and an expected lifecycle of hundreds of charge-discharge cycles. Proper use, avoiding extreme temperatures, and periodic calibration can help maximize battery lifespan and efficiency.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: [
    "Category: Laptop Battery",
    "Model: Acer AL15A32",
    "Condition: Original / Replacement",
    "Warranty: 6months"
  ]
},

"acer-as16a5k": {
  title: "Acer AS16A5K",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/as16a5k.jpg",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "The AS16A5K battery is a reliable replacement battery for Acer laptops, offering a moderate 4-cell capacity, broad model compatibility, and enhanced safety features.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: [
    "Category: Laptop Battery",
    "Model: Acer AS16A5K",
    "Condition: Original / Replacement",
    "Warranty: 6months"
  ]
},

"acer-ap13b8k": {
  title: "Acer AP13B8K",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/ap13b8k.jpg",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "The Acer AP13B8K battery is a premium Li-ion replacement for a wide range of Acer Aspire laptops, offering a voltage range of 15–15.2V, capacity of 3560–3600 mAh (53–54.8 Wh), and 4-cell configuration.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: [
    "Category: Laptop Battery",
    "Model: Acer AP13B8K",
    "Condition: Original / Replacement",
    "Warranty: 6months"
  ]
},

"asus-b31n1912": {
  title: "Asus B31N1912",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/b31n1912.jpg",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "The B31N1912 battery is a reliable replacement for ASUS VivoBook 14 E410, L410, and similar models.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: [
    "Category: Laptop Battery",
    "Model: Asus B31N1912",
    "Condition: Original / Replacement",
    "Warranty: 6months"
  ]
},

"asus-b31n1822": {
  title: "Asus B31N1822",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/b31n1822.jpg",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "The Asus B31N1822 battery is specifically engineered for multiple ZenBook Flip 14 models, including Q406, Q406D, Q406DA, UM462, UX462, UX462D, and UM462DA.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: [
    "Category: Laptop Battery",
    "Model: Asus B31N1822",
    "Condition: Original / Replacement",
    "Warranty: 6months"
  ]
},

"asus-b31n1906": {
  title: "Asus B31N1906",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/b31n1906.jpg",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "The B31N1906 battery is a high-capacity, Li-ion rechargeable battery designed for ASUS gaming and ZenBook laptops, providing reliable power and multiple safety protections for extended use.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: [
    "Category: Laptop Battery",
    "Model: Asus B31N1906",
    "Condition: Original / Replacement",
    "Warranty: 6months"
  ]
},

"asus-a31-k56": {
  title: "Asus A31-K56",
  category: "Battery",
  price: "Ask Price",
  image: "assets/images/battery/a31-k56.jpg",
  subtitle: "Original Dell laptop battery with reliable, long-lasting performance.",
  description: "This battery provides reliable performance for supporting Asus notebooks, with various capacity options depending on the desired battery life and physical fit, ensuring compatibility with a broad range of Asus models.",
  points: [
    "မဝယ်ခင် modelစစ်ရန်","Hlaing မြို့နယ်သို့လာယူနိုင်ပါတယ်","Original and Warranty 6months"],
  specs: [
    "Category: Laptop Battery",
    "Model: Asus A31-K56",
    "Condition: Original / Replacement",
    "Warranty: 6months"
  ]
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
  setInterval(autoSlideMost, 1800);
}
