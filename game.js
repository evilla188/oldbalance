const screens = {
  menu: document.getElementById('menu'),
  game: document.getElementById('game'),
  report: document.getElementById('report')
};

const moneyEl = document.getElementById('money');
const happyEl = document.getElementById('happy');
const expEl = document.getElementById('experience');
const stressEl = document.getElementById('stress');
const dialogPanel = document.getElementById('dialogPanel');
const clientNameEl = document.getElementById('clientName');
const clientMoodEl = document.getElementById('clientMood');
const clientStarsEl = document.getElementById('clientStars');
const clientTextEl = document.getElementById('clientText');
const choicesEl = document.getElementById('choices');
const customerBubble = document.getElementById('customerBubble');
const guilleBubble = document.getElementById('guilleBubble');

const state = {
  money: 9000,
  happy: 0,
  experience: 0,
  stress: 10,
  sales: 0,
  commission: 0,
  clientIndex: 0,
  clientsSeen: 0,
  history: []
};

const clients = [
  {
    name: 'Sofía',
    mood: '🙂 Curiosa',
    intro: 'Hola. Quiero empezar a correr y no sé muy bien qué tenis me convienen.',
    answers: [
      { text: 'Claro, te enseño los modelos más vendidos y vemos cuál te gusta.', exp: 8, sale: 2400, happy: 0, stress: 5, reaction: 'Sofía agradece la ayuda, aunque todavía no sabe si ese modelo es para ella.' },
      { text: '¿Para qué tipo de carreras los quieres y con qué frecuencia piensas usarlos?', exp: 16, sale: 2800, happy: 1, stress: 3, reaction: 'Sofía siente que de verdad intentas entender lo que necesita.' },
      { text: 'Tenemos una promoción en estos. Si quieres te los aparto.', exp: 5, sale: 2200, happy: 0, stress: 7, reaction: 'La promoción llama su atención, pero siente que todavía no la escuchaste.' }
    ]
  },
  {
    name: 'Rodrigo',
    mood: '🤔 Indeciso',
    intro: 'Necesito ropa para entrenar, pero tengo un presupuesto medio limitado.',
    answers: [
      { text: 'Podemos ver opciones dentro de tu presupuesto y comparar qué te conviene más.', exp: 15, sale: 1800, happy: 1, stress: 4, reaction: 'Rodrigo siente que respetaste su presupuesto y le diste opciones.' },
      { text: 'Tenemos conjuntos muy completos; el que más se vende está por aquí.', exp: 9, sale: 2100, happy: 0, stress: 6, reaction: 'Le muestras buenas opciones, aunque todavía no sabes exactamente qué busca.' },
      { text: 'Si buscas ahorrar, quizá te convenga llevar solo una playera por ahora.', exp: 12, sale: 950, happy: 1, stress: 3, reaction: 'La recomendación es honesta y Rodrigo aprecia que no intentaras venderle de más.' }
    ]
  },
  {
    name: 'Karen',
    mood: '😠 Molesta',
    intro: 'Compré estos tenis hace poco y siento que se están despegando.',
    answers: [
      { text: 'Déjame revisar tu ticket y lo vemos juntos para encontrar una solución.', exp: 18, sale: 1200, happy: 1, stress: 6, reaction: 'Karen baja la guardia: siente que escuchaste el problema antes de defender la tienda.' },
      { text: '¿Traes el ticket? Si no, tendría que revisar qué podemos hacer.', exp: 10, sale: 0, happy: 0, stress: 12, reaction: 'La respuesta es correcta, pero suena un poco fría mientras está molesta.' },
      { text: 'Podría enseñarte otro modelo por si quieres aprovechar y cambiarlo.', exp: 4, sale: 0, happy: 0, stress: 15, reaction: 'Karen se molesta más porque intentaste vender antes de resolver su problema.' }
    ]
  },
  {
    name: 'Luis',
    mood: '🎁 Buscando regalo',
    intro: 'Quiero regalarle unos tenis a mi hermano, pero no sé exactamente cuál elegir.',
    answers: [
      { text: '¿Qué deporte practica o para qué los usa normalmente?', exp: 16, sale: 2600, happy: 1, stress: 3, reaction: 'Con esa información puedes recomendar algo mucho más personal.' },
      { text: '¿Sabes qué talla usa? Con eso podemos empezar a reducir opciones.', exp: 10, sale: 2300, happy: 0, stress: 4, reaction: 'Es una buena pregunta, aunque todavía falta conocer el uso que tendrá el regalo.' },
      { text: 'Te puedo enseñar los modelos que más regala la gente.', exp: 8, sale: 2200, happy: 0, stress: 6, reaction: 'Es práctico, pero la recomendación todavía es bastante general.' }
    ]
  },
  {
    name: 'Doña Lupita',
    mood: '😊 Tranquila',
    intro: 'Buenas tardes, mijo. Quiero algo cómodo para caminar, pero no sé mucho de tenis.',
    answers: [
      { text: 'Claro. ¿Los usarías para caminar diario o principalmente los fines de semana?', exp: 17, sale: 2100, happy: 1, stress: 2, reaction: 'Doña Lupita se siente escuchada y la conversación se vuelve muy cómoda.' },
      { text: 'Tengo unos muy cómodos que están gustando mucho.', exp: 10, sale: 1900, happy: 0, stress: 4, reaction: 'La recomendación funciona, aunque faltó entender un poco más sus hábitos.' },
      { text: 'Si buscas algo cómodo, estos están bastante bien.', exp: 7, sale: 1700, happy: 0, stress: 7, reaction: 'La atención es amable, pero la recomendación pudo ser más personalizada.' }
    ]
  }
];

function show(screen) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

function updateHud() {
  moneyEl.textContent = state.money.toLocaleString('es-MX');
  happyEl.textContent = state.happy;
  expEl.textContent = state.experience;
  stressEl.textContent = state.stress;
}

function openClient() {
  const client = clients[state.clientIndex];
  if (!client) {
    finishDay();
    return;
  }

  state.clientsSeen += 1;
  clientNameEl.textContent = client.name;
  clientMoodEl.textContent = client.mood;
  clientStarsEl.textContent = '★★★★★';
  clientTextEl.textContent = client.intro;
  customerBubble.textContent = '...';
  customerBubble.classList.remove('hidden');
  guilleBubble.classList.add('hidden');
  choicesEl.innerHTML = '';

  client.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.textContent = `${String.fromCharCode(65 + index)}) ${answer.text}`;
    button.addEventListener('click', () => chooseAnswer(answer));
    choicesEl.appendChild(button);
  });

  dialogPanel.classList.remove('hidden');
}

function chooseAnswer(answer) {
  state.experience = Math.min(100, state.experience + answer.exp);
  state.happy += answer.happy;
  state.sales += answer.sale;
  state.commission += Math.round(answer.sale * 0.03);
  state.money += Math.round(answer.sale * 0.03);
  state.stress = Math.max(0, Math.min(100, state.stress + answer.stress - (answer.happy ? 2 : 0)));
  state.history.push({ client: clients[state.clientIndex].name, answer: answer.text, result: answer.reaction });

  updateHud();
  customerBubble.textContent = answer.reaction;
  customerBubble.classList.remove('hidden');
  guilleBubble.textContent = answer.happy ? 'Bien hecho. Escuchar primero cambia toda la experiencia.' : 'Puede funcionar, pero la experiencia pudo ser más personalizada.';
  guilleBubble.classList.remove('hidden');

  const buttons = [...choicesEl.querySelectorAll('button')];
  buttons.forEach(b => b.disabled = true);

  setTimeout(() => {
    dialogPanel.classList.add('hidden');
    guilleBubble.classList.add('hidden');
    state.clientIndex += 1;
    if (state.clientIndex < clients.length) {
      openClient();
    } else {
      finishDay();
    }
  }, 1700);
}

function finishDay() {
  document.getElementById('rClients').textContent = state.clientsSeen;
  document.getElementById('rHappy').textContent = state.happy;
  document.getElementById('rSales').textContent = `$${state.sales.toLocaleString('es-MX')}`;
  document.getElementById('rCommission').textContent = `$${state.commission.toLocaleString('es-MX')}`;
  document.getElementById('rExperience').textContent = `${state.experience}/100`;
  const rating = Math.min(5, Math.max(2.5, 3.1 + state.experience / 100 * 1.9));
  document.getElementById('rRating').textContent = `${rating.toFixed(1)}★`;

  let message;
  if (state.experience >= 75) {
    message = '🏆 Excelente día. Tus decisiones mostraron que una buena experiencia puede generar satisfacción, confianza y ventas.';
  } else if (state.experience >= 50) {
    message = '⭐ Buen trabajo. Generaste experiencias positivas, aunque todavía puedes personalizar más la atención.';
  } else {
    message = '💡 Hoy aprendiste algo importante: vender no siempre significa atender bien. Escuchar al cliente cambia la experiencia.';
  }
  document.getElementById('finalMessage').textContent = message;
  show(screens.report);
}

function startGame() {
  state.money = 9000;
  state.happy = 0;
  state.experience = 0;
  state.stress = 10;
  state.sales = 0;
  state.commission = 0;
  state.clientIndex = 0;
  state.clientsSeen = 0;
  state.history = [];
  updateHud();
  show(screens.game);
  openClient();
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('aboutBtn').addEventListener('click', () => {
  alert('Old Balance Experience\n\nUn prototipo de Mercadotecnia de Experiencias: atender, comprender, vender y generar clientes que quieran regresar.');
});

updateHud();
