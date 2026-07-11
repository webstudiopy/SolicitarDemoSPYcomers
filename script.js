// ==========================
// SPYComers - script.js
// ==========================

// --- Menú móvil ---
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });
}

// --- Slider de capturas ---
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
let currentSlide = 0;

function showSlide(index) {
  if (!slides.length) return;
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

// Auto-play del slider cada 3 segundos
if (slides.length > 1) {
  setInterval(() => showSlide(currentSlide + 1), 3000);
}

// --- Formulario de suscripción / demo por WhatsApp ---
// ⚠️ IMPORTANTE: reemplazá este número por el número de WhatsApp real del negocio
// Formato: código de país + número, sin espacios ni signos (ej: Paraguay = 595981123456)
const WHATSAPP_NUMBER = "595981123456";

const whatsappForm = document.getElementById('whatsappForm');

if (whatsappForm) {
  whatsappForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    if (!nombre || !telefono) {
      alert('Por favor completá tu nombre y teléfono.');
      return;
    }

    const mensaje =
      `Hola, quiero suscribirme y pedir una demo de SPYComers.\n` +
      `Nombre: ${nombre}\n` +
      `Teléfono: ${telefono}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');

    whatsappForm.reset();
  });
}

// --- Sistema de reseñas (conectado a reviews.php) ---
const REVIEWS_API = 'reviews.php';
let selectedStars = 0;

const starPicker = document.getElementById('starPicker');
const stars = starPicker ? starPicker.querySelectorAll('.star') : [];

stars.forEach(star => {
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.value);
    stars.forEach(s => s.classList.toggle('hover', parseInt(s.dataset.value) <= val));
  });
  star.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('hover'));
  });
  star.addEventListener('click', () => {
    selectedStars = parseInt(star.dataset.value);
    stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= selectedStars));
  });
});

function renderStars(n) {
  const full = '★'.repeat(n);
  const empty = '☆'.repeat(5 - n);
  return full + empty;
}

async function loadReviews() {
  const listEl = document.getElementById('reviewsList');
  if (!listEl) return;

  try {
    const res = await fetch(REVIEWS_API, { cache: 'no-store' });
    const reviews = await res.json();

    if (!Array.isArray(reviews) || reviews.length === 0) {
      listEl.innerHTML = '<p class="reviews-empty">Todavía no hay reseñas. ¡Sé el primero en dejar la tuya!</p>';
      document.getElementById('reviewsAvg').textContent = '–';
      document.getElementById('reviewsAvgStars').textContent = renderStars(0);
      document.getElementById('reviewsCount').textContent = 'Sin reseñas todavía';
      return;
    }

    const avg = reviews.reduce((sum, r) => sum + (r.estrellas || 0), 0) / reviews.length;
    document.getElementById('reviewsAvg').textContent = avg.toFixed(1);
    document.getElementById('reviewsAvgStars').textContent = renderStars(Math.round(avg));
    document.getElementById('reviewsCount').textContent =
      `${reviews.length} reseña${reviews.length === 1 ? '' : 's'}`;

    listEl.innerHTML = reviews.map(r => `
      <div class="review-item">
        <div class="review-item-head">
          <span class="review-item-name">${escapeHtml(r.nombre)}</span>
          <span class="review-item-date">${escapeHtml(r.fecha || '')}</span>
        </div>
        <div class="review-item-stars">${renderStars(r.estrellas || 0)}</div>
        <p class="review-item-text">${escapeHtml(r.comentario)}</p>
      </div>
    `).join('');
  } catch (err) {
    listEl.innerHTML = '<p class="reviews-empty">No se pudieron cargar las reseñas. Probá recargar la página.</p>';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const statusEl = document.getElementById('reviewStatus');
    const nombre = document.getElementById('reviewNombre').value.trim();
    const comentario = document.getElementById('reviewComentario').value.trim();

    if (!nombre || !comentario || selectedStars < 1) {
      statusEl.textContent = 'Completá tu nombre, comentario y elegí una puntuación.';
      statusEl.className = 'review-status error';
      return;
    }

    statusEl.textContent = 'Publicando...';
    statusEl.className = 'review-status';

    try {
      const res = await fetch(REVIEWS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, comentario, estrellas: selectedStars })
      });

      if (!res.ok) throw new Error('Error al publicar');

      statusEl.textContent = '¡Gracias por tu reseña!';
      statusEl.className = 'review-status ok';
      reviewForm.reset();
      selectedStars = 0;
      stars.forEach(s => s.classList.remove('active'));
      loadReviews();
    } catch (err) {
      statusEl.textContent = 'No se pudo publicar tu reseña. Intentá de nuevo.';
      statusEl.className = 'review-status error';
    }
  });
}

loadReviews();