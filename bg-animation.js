(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const STRIPE   = 88;     // height of each white band (px)
  const AMP      = 26;     // wave amplitude (px)
  const WAVE_LEN = 750;    // horizontal wavelength (px)
  const SPEED    = 0.00018; // phase shift per ms — slow drift

  function draw(ts) {
    ctx.clearRect(0, 0, w, h);

    // Start above viewport so top edges never pop in
    const offset = -AMP * 2 - STRIPE;
    const count  = Math.ceil((h + AMP * 4 + STRIPE * 2) / STRIPE) + 2;

    for (let i = 0; i < count; i++) {
      if (i % 2 === 0) continue; // odd bands = white stripe; even = transparent gap

      const topBase = offset + (i - 1) * STRIPE;
      const botBase = offset + i       * STRIPE;
      const phase   = ts * SPEED;

      ctx.beginPath();

      // top wavy edge → left to right
      for (let x = 0; x <= w + 4; x += 4) {
        const y = topBase + Math.sin((x / WAVE_LEN) * Math.PI * 2 + phase) * AMP;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      // bottom wavy edge → right to left (same phase so band width stays constant)
      for (let x = w; x >= -4; x -= 4) {
        const y = botBase + Math.sin((x / WAVE_LEN) * Math.PI * 2 + phase) * AMP;
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.055)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
