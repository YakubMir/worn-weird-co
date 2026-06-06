(function () {
  function initSelector(selector) {
    var variants;
    try {
      variants = JSON.parse(selector.getAttribute("data-variants"));
    } catch (e) {
      return;
    }

    var groups = selector.querySelectorAll(".option-buttons");
    var hiddenInput = selector.querySelector("[data-variant-id]");
    var form = selector.closest("form");
    var addBtn = form ? form.querySelector(".add-to-bag") : null;
    var priceEl = document.querySelector(".product-price");

    function currentSelection() {
      var values = [];
      groups.forEach(function (group) {
        var checked = group.querySelector(".option-radio:checked");
        values.push(checked ? checked.value : null);
      });
      return values;
    }

    function matchVariant(values) {
      for (var i = 0; i < variants.length; i++) {
        var variant = variants[i];
        var matches = true;
        for (var j = 0; j < values.length; j++) {
          if (values[j] !== null && variant.options[j] !== values[j]) {
            matches = false;
            break;
          }
        }
        if (matches) return variant;
      }
      return null;
    }

    function applyVariant() {
      var variant = matchVariant(currentSelection());
      if (!variant || !hiddenInput) return;

      hiddenInput.value = variant.id;
      if (priceEl) priceEl.textContent = variant.price;
      if (addBtn) {
        addBtn.disabled = !variant.available;
        addBtn.textContent = variant.available ? "Add to Bag" : "Sold Out";
      }
    }

    groups.forEach(function (group) {
      group.querySelectorAll(".option-radio").forEach(function (radio) {
        radio.addEventListener("change", applyVariant);
      });
    });
  }

  document.querySelectorAll("[data-variant-select]").forEach(initSelector);
})();
