(function () {
  function initGallery(gallery) {
    var slides = gallery.querySelectorAll(".gallery-slide");
    var dots = gallery.querySelectorAll(".gallery-dot");
    var prevBtn = gallery.querySelector(".gallery-arrow.prev");
    var nextBtn = gallery.querySelector(".gallery-arrow.next");

    if (slides.length <= 1) return;

    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { show(i); });
    });
  }

  document.querySelectorAll(".product-gallery").forEach(initGallery);
})();
