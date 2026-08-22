// ===============================
// Bole Music Shop - app.js
// ===============================

const STORAGE_KEY = "boleMusicCart";
const PHONE = /^(?:\+251|0)9\d{8}$/;

// ---------- STATE ----------

const state = {
  products: [], // loaded from products.json
  cart: [], // { id, name, price, qty }
  search: "", // current search text
  category: "all", // current category
};

// ---------- DOM ELEMENTS ----------

const productsEl = document.querySelector("#products-container");
const searchEl = document.querySelector("#search");
const categoryEl = document.querySelector("#category");

const form = document.querySelector("#checkout");
const nameEl = document.querySelector("#name");
const phoneEl = document.querySelector("#phone");
const areaEl = document.querySelector("#area");
const errEl = document.querySelector("#form-error");
const confirmationEl = document.querySelector("#confirmation");

const cartEl = document.querySelector("#cart-items");
const cartTotalEl = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");

function validate({ name, phone }) {
  if (!name.trim()) {
    return "Please enter your name.";
  }

  if (!PHONE.test(phone.trim())) {
    return "Enter a valid Ethiopian phone.";
  }

  if (state.cart.length === 0) {
    return "Your cart is empty.";
  }

  return "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: nameEl.value,
    phone: phoneEl.value,
    area: areaEl.value,
  };

  const msg = validate(data);

  errEl.textContent = msg;

  if (msg) {
    return;
  }

  placeOrder(data);
});

function placeOrder(data) {
  const order = {
    ...data,
    items: state.cart,
    total: cartTotal(),
    placedAt: new Date().toISOString(),
  };

  console.log("Order placed:", order);

  state.cart = [];

  save();

  render();

  showConfirmation(order);
}

function showConfirmation(order) {
  confirmationEl.textContent = `Order placed — ${order.total.toLocaleString()} ETB, delivering to ${order.area}.`;

  form.reset();

  errEl.textContent = "";
}

// ---------- LOAD PRODUCTS ----------

async function loadProducts() {
  productsEl.textContent = "Loading products...";

  try {
    const res = await fetch("data/products.json");

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    state.products = await res.json();

    render();
  } catch (error) {
    productsEl.textContent = "Could not load products.";

    console.error("Error loading products:", error);
  }
}

// ---------- RENDER PRODUCTS ----------

function render() {
  renderProducts();
  renderCart();
}

function renderProducts() {
  const term = state.search.toLowerCase();

  const shown = state.products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(term);

    const matchesCategory =
      state.category === "all" ||
      product.category?.toLowerCase() === state.category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Clear previous products

  productsEl.innerHTML = "";

  // Empty result

  if (shown.length === 0) {
    productsEl.innerHTML = `
            <p class="no-results">No products found.</p>
        `;

    return;
  }

  // Create product cards

  shown.forEach((product) => {
    const card = document.createElement("article");

    card.className = "product-card";

    card.dataset.id = product.id;

    card.innerHTML = `
    <img
        src="${product.image}"
        alt="${product.name}"
        class="product-image"
    >

    <h3 class="product-name">
        ${product.name}
    </h3>

    <p>
        ${product.description || ""}
    </p>

    <p class="product-price">
        ${Number(product.price).toLocaleString()} ETB
    </p>

    <button class="add-to-cart" type="button">
        Add to Cart
    </button>
`;
    productsEl.appendChild(card);
  });

  // Update cart too

  renderCart();
}

// ---------- SEARCH ----------

searchEl.addEventListener("input", (e) => {
  state.search = e.target.value.toLowerCase();
  renderProducts();
});

searchEl.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") {
    return;
  }

  const firstProduct = productsEl.querySelector(".product-card");

  if (firstProduct) {
    firstProduct.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
});

// ---------- CATEGORY FILTER ----------

categoryEl.addEventListener("change", (e) => {
  state.category = e.target.value;

  render();
});

// ---------- ADD TO CART ----------

productsEl.addEventListener("click", (e) => {
  if (!e.target.matches(".add-to-cart")) {
    return;
  }

  // Get product ID

  const card = e.target.closest(".product-card");

  const id = Number(card.dataset.id);

  // Find product

  const product = state.products.find((product) => Number(product.id) === id);

  if (!product) {
    return;
  }

  // Check if already in cart

  const line = state.cart.find((item) => Number(item.id) === id);

  if (line) {
    // Increase quantity

    line.qty++;
  } else {
    // Add new product

    state.cart.push({
      ...product,
      qty: 1,
    });
  }

  // Save and update screen

  save();

  render();
});

// ---------- RENDER CART ----------

function renderCart() {
  cartEl.innerHTML = "";

  // Empty cart
  if (state.cart.length === 0) {
    cartEl.innerHTML = `
      <p id="empty-cart">
        Your cart is empty.
      </p>
    `;

    cartTotalEl.textContent = "0 ETB";
    checkoutButton.disabled = true;

    return;
  }

  // Create cart items
  state.cart.forEach((item) => {
    const li = document.createElement("li");

    li.dataset.id = item.id;
    li.className = "cart-line";

    li.innerHTML = `
      <div class="cart-item">

        <div class="cart-item-info">
          <strong>${item.name}</strong>

          <span class="cart-price">
            ${Number(item.price).toLocaleString()} ETB each
          </span>

          <div class="cart-controls">

            <button
              class="qty-btn decrease"
              type="button"
            >
              −
            </button>

            <span class="cart-qty">
              ${item.qty}
            </span>

            <button
              class="qty-btn increase"
              type="button"
            >
              +
            </button>

          </div>

          <button
            class="rm"
            type="button"
          >
            Remove
          </button>

        </div>

        <strong class="cart-item-total">
          ${(Number(item.price) * item.qty).toLocaleString()} ETB
        </strong>

      </div>
    `;

    cartEl.appendChild(li);
  });

  // Show total
  cartTotalEl.textContent = `${cartTotal().toLocaleString()} ETB`;

  // Enable checkout
  checkoutButton.disabled = false;
}
// ---------- REMOVE FROM CART ----------

cartEl.addEventListener("click", (e) => {
  const li = e.target.closest("li");

  if (!li) {
    return;
  }

  const id = Number(li.dataset.id);
  const item = state.cart.find((item) => Number(item.id) === id);

  if (!item) {
    return;
  }

  // Increase quantity
  if (e.target.matches(".increase")) {
    item.qty++;
  }

  // Decrease quantity
  if (e.target.matches(".decrease")) {
    item.qty--;

    if (item.qty <= 0) {
      state.cart = state.cart.filter((item) => Number(item.id) !== id);
    }
  }

  // Remove completely
  if (e.target.matches(".rm")) {
    state.cart = state.cart.filter((item) => Number(item.id) !== id);
  }

  save();
  render();
});

// ---------- CART TOTAL ----------

function cartTotal() {
  return state.cart.reduce((sum, item) => {
    const price = Number(item?.price ?? 0);
    const quantity = Number(item?.qty ?? 0);

    return sum + price * quantity;
  }, 0);
}

// ---------- SAVE CART ----------

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
}

// ---------- LOAD CART ----------

function load() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return;
  }

  try {
    state.cart = JSON.parse(saved);
  } catch (error) {
    console.error("Could not load saved cart:", error);

    state.cart = [];
  }
}

// ---------- CHECKOUT ----------

checkoutButton.addEventListener("click", () => {
  if (state.cart.length === 0) {
    return;
  }

  const total = cartTotal();

  alert(
    `Order total: ${total.toLocaleString()} ETB\n\nThank you for shopping at Bole Music Shop!`,
  );
});

// ---------- INITIALIZE APP ----------

async function init() {
  // Restore cart first

  load();

  // Then load products

  await loadProducts();
}

// ---------- START APP ----------

init();
