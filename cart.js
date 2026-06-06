(function () {
  var STORAGE_KEY = "wornWeirdCart";

  function getCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  function formatPrice(amount) {
    var rounded = Math.round(amount * 100) / 100;
    return rounded % 1 === 0 ? "$" + rounded : "$" + rounded.toFixed(2);
  }

  function addToCart(item) {
    var cart = getCart();
    var existing = cart.find(function (entry) { return entry.id === item.id; });
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
    }
    saveCart(cart);
    render();
  }

  function changeQuantity(id, delta) {
    var cart = getCart();
    var entry = cart.find(function (item) { return item.id === id; });
    if (!entry) return;
    entry.quantity += delta;
    if (entry.quantity <= 0) {
      cart = cart.filter(function (item) { return item.id !== id; });
    }
    saveCart(cart);
    render();
  }

  function removeFromCart(id) {
    var cart = getCart().filter(function (item) { return item.id !== id; });
    saveCart(cart);
    render();
  }

  var bagButton = document.getElementById("bagButton");
  var bagCount = document.getElementById("bagCount");
  var cartPanel = document.getElementById("cartPanel");
  var cartOverlay = document.getElementById("cartOverlay");
  var cartClose = document.getElementById("cartClose");
  var cartItemsEl = document.getElementById("cartItems");
  var cartEmptyEl = document.getElementById("cartEmpty");
  var cartSummaryEl = document.getElementById("cartSummary");
  var cartSubtotalEl = document.getElementById("cartSubtotal");
  var checkoutBtn = document.getElementById("checkoutBtn");

  function openPanel() {
    if (!cartPanel) return;
    cartPanel.classList.add("open");
    if (cartOverlay) cartOverlay.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
  }

  function closePanel() {
    if (!cartPanel) return;
    cartPanel.classList.remove("open");
    if (cartOverlay) cartOverlay.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
  }

  function buildItemRow(item) {
    var row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML =
      '<div class="cart-item-image"><img src="' + item.image + '" alt="' + item.name + '" /></div>' +
      '<div class="cart-item-info">' +
        "<h3>" + item.name + "</h3>" +
        '<span class="cart-item-price">' + formatPrice(item.price) + "</span>" +
        '<div class="cart-item-qty">' +
          '<button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">−</button>' +
          '<span class="qty-value">' + item.quantity + "</span>" +
          '<button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>' +
        "</div>" +
      "</div>" +
      '<button type="button" class="cart-item-remove" aria-label="Remove ' + item.name + '">' +
        '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      "</button>";

    row.querySelector(".qty-minus").addEventListener("click", function () { changeQuantity(item.id, -1); });
    row.querySelector(".qty-plus").addEventListener("click", function () { changeQuantity(item.id, 1); });
    row.querySelector(".cart-item-remove").addEventListener("click", function () { removeFromCart(item.id); });

    return row;
  }

  function render() {
    var cart = getCart();
    var count = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);

    if (bagCount) {
      bagCount.textContent = count;
      bagCount.hidden = count === 0;
    }

    if (!cartItemsEl) return;

    cartItemsEl.innerHTML = "";

    var hasItems = cart.length > 0;
    if (cartEmptyEl) cartEmptyEl.hidden = hasItems;
    if (cartSummaryEl) cartSummaryEl.hidden = !hasItems;

    var subtotal = 0;
    cart.forEach(function (item) {
      subtotal += item.price * item.quantity;
      cartItemsEl.appendChild(buildItemRow(item));
    });

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);
  }

  if (bagButton) bagButton.addEventListener("click", openPanel);
  if (cartClose) cartClose.addEventListener("click", closePanel);
  if (cartOverlay) cartOverlay.addEventListener("click", closePanel);

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      var original = checkoutBtn.textContent;
      checkoutBtn.textContent = "Checkout coming soon";
      checkoutBtn.disabled = true;
      setTimeout(function () {
        checkoutBtn.textContent = original;
        checkoutBtn.disabled = false;
      }, 2200);
    });
  }

  document.querySelectorAll(".add-to-bag[data-product-id]").forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      addToCart({
        id: btn.getAttribute("data-product-id"),
        name: btn.getAttribute("data-product-name"),
        price: parseFloat(btn.getAttribute("data-product-price")),
        image: btn.getAttribute("data-product-image"),
      });
      openPanel();
    });
  });

  render();
})();
