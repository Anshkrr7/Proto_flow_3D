/*
  3D Printed Parts — storefront configuration
  Edit the WHATSAPP_NUMBER and PRODUCTS below before publishing.
  WhatsApp number format: country code + number, digits only (India: 91XXXXXXXXXX).
*/

const STORE_NAME = "3D Printed Parts";
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // TODO: Replace with your WhatsApp number, e.g. 919876543210.

const PRODUCTS = [
  {
    id: "tee-classic",
    name: "Classic Everyday Tee",
    category: "Clothing",
    price: 499,
    description: "An easy everyday essential.",
    symbol: "👕",
    background: "#dce5d8",
    tag: "Bestseller"
  },
  {
    id: "cap-minimal",
    name: "Minimal Cap",
    category: "Accessories",
    price: 349,
    description: "A simple finishing touch.",
    symbol: "🧢",
    background: "#f1dfce",
    tag: "New"
  },
  {
    id: "tote-canvas",
    name: "Everyday Tote",
    category: "Accessories",
    price: 299,
    description: "Room for the things you carry.",
    symbol: "👜",
    background: "#e7e0cf",
    tag: ""
  },
  {
    id: "hoodie-relaxed",
    name: "Relaxed Hoodie",
    category: "Clothing",
    price: 999,
    description: "A comfortable off-duty layer.",
    symbol: "🧥",
    background: "#d7dce5",
    tag: "Popular"
  },
  {
    id: "socks-set",
    name: "Everyday Socks — Set of 3",
    category: "Clothing",
    price: 249,
    description: "Comfort for every day.",
    symbol: "🧦",
    background: "#f3d7d0",
    tag: ""
  },
  {
    id: "watch-minimal",
    name: "Minimal Watch",
    category: "Accessories",
    price: 799,
    description: "A clean, understated look.",
    symbol: "⌚",
    background: "#d9e4e3",
    tag: ""
  },
  {
    id: "sunglasses",
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 599,
    description: "An easy accessory for sunny days.",
    symbol: "🕶️",
    background: "#e9dfec",
    tag: ""
  },
  {
    id: "shirt-oversized",
    name: "Oversized Shirt",
    category: "Clothing",
    price: 699,
    description: "A relaxed fit with a versatile feel.",
    symbol: "👔",
    background: "#f0e6c9",
    tag: "New"
  }
];

const cart = new Map();
let activeCategory = "All";
let searchTerm = "";

const productGrid = document.querySelector("#product-grid");
const filters = document.querySelector("#filters");
const searchInput = document.querySelector("#search");
const emptyState = document.querySelector("#empty-state");
const cartPanel = document.querySelector("#cart-panel");
const cartBackdrop = document.querySelector("#cart-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartCount = document.querySelector("#cart-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const toast = document.querySelector("#toast");
let toastTimer;

const money = amount => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(amount);

function getCategories() {
  return ["All", ...new Set(PRODUCTS.map(product => product.category))];
}

function renderFilters() {
  filters.innerHTML = getCategories().map(category => `
    <button class="filter-button ${category === activeCategory ? "active" : ""}"
      type="button" data-category="${escapeHTML(category)}"
      aria-pressed="${category === activeCategory}">${escapeHTML(category)}</button>
  `).join("");
}

function renderProducts() {
  const filtered = PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const searchable = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return matchesCategory && searchable.includes(searchTerm.toLowerCase());
  });

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image" style="background:${safeColor(product.background)}">
        ${product.tag ? `<span class="product-tag">${escapeHTML(product.tag)}</span>` : ""}
        <span class="product-symbol" aria-hidden="true">${escapeHTML(product.symbol)}</span>
        <button class="add-button" type="button" data-add="${escapeHTML(product.id)}"
          aria-label="Add ${escapeHTML(product.name)} to cart" title="Add to cart">+</button>
      </div>
      <div class="product-info">
        <div><h3>${escapeHTML(product.name)}</h3><p>${escapeHTML(product.description)}</p></div>
        <span class="product-price">${money(product.price)}</span>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filtered.length > 0;
}

function renderCart() {
  const entries = [...cart.entries()];
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = entries.reduce((sum, [id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return sum + (product ? product.price * quantity : 0);
  }, 0);

  cartCount.textContent = count;
  cartSubtotal.textContent = money(subtotal);
  cartEmpty.hidden = entries.length > 0;
  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    if (!product) return "";
    return `
      <div class="cart-row">
        <div class="cart-thumb" style="background:${safeColor(product.background)}" aria-hidden="true">${escapeHTML(product.symbol)}</div>
        <div>
          <div class="cart-product-name">${escapeHTML(product.name)}</div>
          <div class="cart-product-price">${money(product.price)} each</div>
          <div class="quantity">
            <button type="button" data-quantity="${escapeHTML(id)}" data-change="-1" aria-label="Remove one ${escapeHTML(product.name)}">−</button>
            <span>${quantity}</span>
            <button type="button" data-quantity="${escapeHTML(id)}" data-change="1" aria-label="Add one ${escapeHTML(product.name)}">+</button>
          </div>
        </div>
        <button type="button" class="remove-button" data-remove="${escapeHTML(id)}">Remove</button>
      </div>
    `;
  }).join("");
}

function addToCart(id) {
  if (!PRODUCTS.some(product => product.id === id)) return;
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  showToast("Added to your cart");
}

function changeQuantity(id, change) {
  const next = (cart.get(id) || 0) + change;
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  renderCart();
}

function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  cartBackdrop.hidden = false;
  document.body.classList.add("cart-open");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartBackdrop.hidden = true;
  document.body.classList.remove("cart-open");
  document.querySelector("#cart-toggle").focus();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function startWhatsAppCheckout() {
  const entries = [...cart.entries()];
  if (!entries.length) {
    showToast("Add a product before checking out");
    return;
  }

  if (!/^91\d{10}$/.test(WHATSAPP_NUMBER)) {
    alert("WhatsApp checkout is not configured yet. Open script.js and replace WHATSAPP_NUMBER with your WhatsApp number including India country code 91, using digits only.");
    return;
  }

  const lines = entries.map(([id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return `• ${product.name} × ${quantity} — ${money(product.price * quantity)}`;
  });
  const subtotal = entries.reduce((sum, [id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return sum + product.price * quantity;
  }, 0);

  const message = [
    `Hello ${STORE_NAME}! I'd like to place an order:`,
    "",
    ...lines,
    "",
    `Subtotal: ${money(subtotal)}`,
    "Please confirm availability, shipping cost, delivery time and payment options.",
    "",
    "My name and delivery address:",
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function safeColor(value) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : "#dce5d8";
}

filters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderProducts();
});

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.change));
  if (removeButton) {
    cart.delete(removeButton.dataset.remove);
    renderCart();
  }
});

document.querySelector("#cart-toggle").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
document.querySelector("#checkout-button").addEventListener("click", startWhatsAppCheckout);
document.querySelector("#clear-cart").addEventListener("click", () => {
  cart.clear();
  renderCart();
  showToast("Cart cleared");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartPanel.classList.contains("open")) closeCart();
});
document.querySelector("#year").textContent = new Date().getFullYear();

renderFilters();
renderProducts();
renderCart();
