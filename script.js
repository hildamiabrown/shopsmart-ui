const products = [
  {
    id: 1,
    name: "AeroPods Wireless Headphones",
    category: "electronics",
    price: 89,
    description: "Lightweight audio with active noise control and all-day comfort.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "LumaDesk LED Lamp",
    category: "home",
    price: 46,
    description: "Adjustable lighting modes for focused work and relaxed evenings.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Everyday Commuter Pack",
    category: "style",
    price: 72,
    description: "Water-resistant storage with a padded laptop pocket.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "HydraSmart Bottle",
    category: "wellness",
    price: 31,
    description: "Insulated stainless steel bottle with a clean flip-top design.",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Mini Bluetooth Speaker",
    category: "electronics",
    price: 58,
    description: "Compact speaker with rich bass and splash-resistant housing.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Soft Weave Throw Blanket",
    category: "home",
    price: 39,
    description: "Cozy textured throw that adds warmth to any room.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Canvas Weekend Tote",
    category: "style",
    price: 54,
    description: "Durable carryall for errands, travel, and gym runs.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "PulseFit Smart Scale",
    category: "wellness",
    price: 64,
    description: "Clean digital display with simple wellness tracking features.",
    image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=700&q=80"
  }
];

const productGrid = document.querySelector("[data-product-grid]");
const searchInput = document.querySelector("[data-search-input]");
const categoryFilter = document.querySelector("[data-category-filter]");
const cartCount = document.querySelector("[data-cart-count]");
const toast = document.querySelector("[data-toast]");
const checkoutButton = document.querySelector("[data-checkout-button]");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("[data-nav-menu]");

let cartItems = 0;
let toastTimer;

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

function getFilteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  return products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    const matchesQuery = searchableText.includes(query);

    return matchesCategory && matchesQuery;
  });
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-media">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <span class="product-tag">${product.category}</span>
    </div>
    <div class="product-info">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-footer">
        <span class="price">${formatPrice(product.price)}</span>
        <button class="add-button" type="button" data-product-id="${product.id}">Add</button>
      </div>
    </div>
  `;

  return card;
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  productGrid.replaceChildren();

  if (filteredProducts.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No products match your search. Try another keyword or category.";
    productGrid.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  filteredProducts.forEach((product) => fragment.append(createProductCard(product)));
  productGrid.append(fragment);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === Number(productId));

  if (!product) {
    return;
  }

  cartItems += 1;
  cartCount.textContent = cartItems;
  showToast(`${product.name} added to cart.`);
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");

  if (button) {
    addToCart(button.dataset.productId);
  }
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

checkoutButton.addEventListener("click", () => {
  const itemLabel = cartItems === 1 ? "item" : "items";
  showToast(cartItems ? `Your cart has ${cartItems} ${itemLabel}.` : "Your cart is empty.");
});

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navMenu.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  }
});

renderProducts();
