/* ===========================
   Las Cruces HVAC — Main JS
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile nav toggle --- */
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      toggle.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        toggle.textContent = '☰';
      }
    });
  }

  /* --- Navbar scroll shadow --- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* --- Scroll fade-up animations --- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    fadeEls.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
      obs.observe(el);
    });
  }

  /* --- FAQ accordion --- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

});

/* ===========================
   HVAC CALCULATOR
   =========================== */

function calculateHVAC() {
  const sqftInput = document.getElementById('squareFootage');
  const insulationInput = document.querySelector('input[name="insulation"]:checked');
  const floorInput = document.querySelector('input[name="floors"]:checked');

  if (!sqftInput || !insulationInput || !floorInput) {
    alert('Please fill in all fields before calculating.');
    return;
  }

  const sqft = parseInt(sqftInput.value, 10);

  if (!sqft || sqft < 100 || sqft > 20000) {
    alert('Please enter a valid square footage between 100 and 20,000.');
    sqftInput.focus();
    return;
  }

  const insulation = insulationInput.value;
  const floors = floorInput.value;

  /* --- Sizing formula (BTU/hr) ---
     Base: 25 BTU per sq ft (industry standard for hot desert climate)
     Las Cruces design temp is ~104°F — we use a slightly elevated base.
  */
  let btuPerSqFt = 25;

  // Insulation adjustment
  if (insulation === 'poor')      btuPerSqFt += 5;
  else if (insulation === 'good') btuPerSqFt += 1;
  // 'excellent' — no adjustment (well-insulated = baseline)

  // Multi-story adjustment (upper floors absorb more heat)
  if (floors === 'two')  btuPerSqFt += 2;
  if (floors === 'three') btuPerSqFt += 3;

  const totalBTU = Math.round(sqft * btuPerSqFt);
  const tons = (totalBTU / 12000).toFixed(1);

  /* --- Cost estimation ---
     National averages for central AC + installation in 2024:
     - 2 ton:  $3,800 – $5,200
     - 3 ton:  $4,400 – $6,200
     - 4 ton:  $5,000 – $7,500
     - 5 ton:  $5,800 – $8,800
     Formula: base $3,400 + ($900/ton), range ±25%
  */
  const tonsNum = parseFloat(tons);
  const midCost = Math.round(3400 + tonsNum * 900);
  const lowCost = Math.round(midCost * 0.80 / 100) * 100;
  const highCost = Math.round(midCost * 1.25 / 100) * 100;

  // Populate results
  document.getElementById('res-sqft').textContent = sqft.toLocaleString() + ' sq ft';
  document.getElementById('res-btu').textContent = totalBTU.toLocaleString() + ' BTU/hr';
  document.getElementById('res-tons').textContent = tonsNum + ' tons';
  document.getElementById('res-cost').textContent =
    '$' + lowCost.toLocaleString() + ' – $' + highCost.toLocaleString();

  // Show results panel
  const placeholder = document.getElementById('result-placeholder');
  const display = document.getElementById('result-display');
  if (placeholder) placeholder.style.display = 'none';
  if (display) display.classList.add('visible');

  // Scroll to results on mobile
  if (window.innerWidth < 769) {
    document.getElementById('result-display')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ===========================
   CONTACT FORM
   =========================== */

function handleContactForm(event) {
  event.preventDefault();

  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');

  // Basic validation
  const name    = document.getElementById('contact-name')?.value?.trim();
  const phone   = document.getElementById('contact-phone')?.value?.trim();
  const email   = document.getElementById('contact-email')?.value?.trim();
  const city    = document.getElementById('contact-city')?.value;
  const service = document.getElementById('contact-service')?.value;

  if (!name || !phone || !email || !city || !service) {
    alert('Please fill in all required fields.');
    return;
  }

  // Disable button while "sending"
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  /*
   * EmailJS integration placeholder.
   * To activate: include the EmailJS SDK, call emailjs.init('YOUR_PUBLIC_KEY')
   * in a <script> tag, then replace the setTimeout below with:
   *
   *   emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
   *     .then(() => showSuccess(), () => showError());
   */
  setTimeout(() => {
    // Show success state
    const formEl = document.getElementById('contact-form-wrap');
    const successEl = document.getElementById('form-success');
    if (formEl) formEl.style.display = 'none';
    if (successEl) successEl.classList.add('visible');
  }, 800);
}
