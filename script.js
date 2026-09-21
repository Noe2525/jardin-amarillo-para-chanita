const welcome = document.querySelector('#welcome');
const garden = document.querySelector('#garden');
const finale = document.querySelector('#finale');
const slider = document.querySelector('#slider');
const handle = document.querySelector('#sliderHandle');
const fill = document.querySelector('#sliderFill');
const card = document.querySelector('#messageCard');
const flowers = [...document.querySelectorAll('.flower')];
const dots = [...document.querySelectorAll('#progressDots span')];
const progressText = document.querySelector('#progressText');

const messages = [
  {
    flower: '🌹',
    title: 'Tu sonrisa',
    text: 'Hay sonrisas que alegran un momento, pero la tuya tiene esa forma especial de hacer que todo alrededor se sienta más bonito.'
  },
  {
    flower: '🌷',
    title: 'Tu manera de cuidar',
    text: 'Tienes una forma muy tuya de estar, de escuchar y de cuidar. Es uno de esos detalles que el corazón aprende a valorar de verdad.'
  },
  {
    flower: '🌹',
    title: 'Nuestros recuerdos',
    text: 'Los momentos bonitos contigo se quedan guardados como flores: pasa el tiempo, pero siguen teniendo el mismo color.'
  },
  {
    flower: '🌷',
    title: 'Lo que admiro de ti',
    text: 'Admiro la persona que eres, tu manera de seguir adelante y toda esa luz que quizá tú no siempre ves, pero que los demás sí sentimos.'
  },
  {
    flower: '🌹',
    title: 'Lo que aún deseo vivir',
    text: 'Deseo que todavía nos queden muchas risas, conversaciones, aventuras y días sencillos que terminen convirtiéndose en recuerdos inolvidables.'
  }
];

const opened = new Set();
let dragging = false;
let sliderProgress = 0;

function updateSlider(clientX) {
  const box = slider.getBoundingClientRect();
  const max = box.width - handle.offsetWidth - 12;
  sliderProgress = Math.max(0, Math.min(max, clientX - box.left - handle.offsetWidth / 2));
  handle.style.left = `${sliderProgress + 6}px`;
  fill.style.width = `${sliderProgress + handle.offsetWidth}px`;
  if (sliderProgress >= max * .91) enterGarden();
}

function enterGarden() {
  dragging = false;
  welcome.classList.add('opening');
  setTimeout(() => {
    welcome.hidden = true;
    garden.classList.add('visible');
    garden.setAttribute('aria-hidden', 'false');
  }, 780);
}

handle.addEventListener('pointerdown', event => {
  dragging = true;
  handle.setPointerCapture(event.pointerId);
});

handle.addEventListener('pointermove', event => {
  if (dragging) updateSlider(event.clientX);
});

handle.addEventListener('pointerup', () => {
  if (sliderProgress < slider.clientWidth * .72) {
    handle.style.left = '6px';
    fill.style.width = '0';
    sliderProgress = 0;
  }
  dragging = false;
});

handle.addEventListener('click', () => {
  if (!dragging && sliderProgress === 0) enterGarden();
});

flowers.forEach(flower => {
  flower.addEventListener('click', () => {
    const index = Number(flower.dataset.index);
    const message = messages[index];
    document.querySelector('#cardNumber').textContent = `Flor ${index + 1} de 5`;
    document.querySelector('#cardFlower').textContent = message.flower;
    document.querySelector('#cardTitle').textContent = message.title;
    document.querySelector('#cardText').textContent = message.text;
    card.dataset.index = String(index);
    card.showModal();
  });
});

function closeAndSave() {
  const index = Number(card.dataset.index);
  opened.add(index);
  flowers[index].classList.add('opened');
  dots.forEach((dot, dotIndex) => dot.classList.toggle('on', opened.has(dotIndex)));
  progressText.textContent = `${opened.size} de 5 flores descubiertas`;
  card.close();

  if (opened.size === messages.length) {
    setTimeout(() => {
      garden.classList.remove('visible');
      garden.setAttribute('aria-hidden', 'true');
      finale.classList.add('visible');
      finale.setAttribute('aria-hidden', 'false');
      finale.scrollIntoView({ behavior: 'smooth' });
    }, 450);
  }
}

document.querySelector('#continueCard').addEventListener('click', closeAndSave);
document.querySelector('#closeCard').addEventListener('click', () => card.close());

document.querySelector('#restart').addEventListener('click', () => {
  opened.clear();
  flowers.forEach(flower => flower.classList.remove('opened'));
  dots.forEach(dot => dot.classList.remove('on'));
  progressText.textContent = '0 de 5 flores descubiertas';
  finale.classList.remove('visible');
  finale.setAttribute('aria-hidden', 'true');
  garden.classList.add('visible');
  garden.setAttribute('aria-hidden', 'false');
  garden.scrollIntoView({ behavior: 'smooth' });
});
