const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const slidesContainer = document.getElementById('slidesContainer');

let currentSlide = 0;
let startX = 0;
let endX = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  currentSlide = index;
}

function nextSlide() {
  let newIndex = currentSlide + 1;
  if (newIndex >= slides.length) newIndex = 0;
  showSlide(newIndex);
}

function prevSlide() {
  let newIndex = currentSlide - 1;
  if (newIndex < 0) newIndex = slides.length - 1;
  showSlide(newIndex);
}

function handleSwipe() {
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}

if (prevBtn && nextBtn && slides.length && slidesContainer) {
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.slide));
    });
  });

  slidesContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  slidesContainer.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  slidesContainer.addEventListener('mousedown', (e) => {
    startX = e.clientX;
  });

  slidesContainer.addEventListener('mouseup', (e) => {
    endX = e.clientX;
    handleSwipe();
  });
}

/* FORMULARIO A WHATSAPP */
const whatsappForm = document.getElementById('whatsappForm');

if (whatsappForm) {
  whatsappForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const telefono = document.getElementById('telefono')?.value.trim() || '';
    const empresa = document.getElementById('empresa')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const mensaje = document.getElementById('mensaje')?.value.trim() || '';

    const numeroDestino = '595983957615'; 

    let texto = 'Hola, quiero más información sobre SPYComers.%0A%0A';
    texto += `*Nombre:* ${encodeURIComponent(nombre)}%0A`;
    texto += `*Teléfono:* ${encodeURIComponent(telefono)}%0A`;

    if (empresa) {
      texto += `*Empresa:* ${encodeURIComponent(empresa)}%0A`;
    }

    if (email) {
      texto += `*Email:* ${encodeURIComponent(email)}%0A`;
    }

    if (mensaje) {
      texto += `*Mensaje:* ${encodeURIComponent(mensaje)}%0A`;
    }

    const url = `https://wa.me/${numeroDestino}?text=${texto}`;
    window.open(url, '_blank');
  });
}