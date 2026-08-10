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
  returningClients: 0,
  rank: 'Asesor',
  rankLevel: 0,
  reputation: 3.5,
  history: [],
  event: null,
  lastClient: null
};

const events = [
  {name:'Sábado de mucho movimiento', text:'La tienda está llena. Hay más clientes de lo normal.', stress:12, sales:1.12},
  {name:'Llegó mercancía nueva', text:'Los nuevos productos llaman la atención de los clientes.', stress:3, sales:1.08},
  {name:'Visita de influencer', text:'Una creadora de contenido está recorriendo la tienda.', stress:8, sales:1.15},
  {name:'Tarde tranquila', text:'Hay menos clientes y tienes tiempo para atender con calma.', stress:-10, sales:0.95}
];

const clients = [
  {
    name: 'Sofía', mood: '🙂 Curiosa', intro: 'Hola. Quiero empezar a correr y no sé muy bien qué tenis me convienen.', answers: [
      {text:'Claro, te enseño los modelos más vendidos y vemos cuál te gusta.', exp:8, sale:2400, happy:0, stress:5, reaction:'Sofía agradece la ayuda, aunque todavía no sabe si ese modelo es para ella.'},
      {text:'¿Para qué tipo de carreras los quieres y con qué frecuencia piensas usarlos?', exp:16, sale:2800, happy:1, stress:3, reaction:'Sofía siente que de verdad intentas entender lo que necesita.'},
      {text:'Tenemos una promoción en estos. Si quieres te los aparto.', exp:5, sale:2200, happy:0, stress:7, reaction:'La promoción llama su atención, pero siente que todavía no la escuchaste.'}
    ]
  },
  {
    name: 'Rodrigo', mood: '🤔 Indeciso', intro: 'Necesito ropa para entrenar, pero tengo un presupuesto medio limitado.', answers: [
      {text:'Podemos ver opciones dentro de tu presupuesto y comparar qué te conviene más.', exp:15, sale:1800, happy:1, stress:4, reaction:'Rodrigo siente que respetaste su presupuesto y le diste opciones.'},
      {text:'Tenemos conjuntos muy completos; el que más se vende está por aquí.', exp:9, sale:2100, happy:0, stress:6, reaction:'Le muestras buenas opciones, aunque todavía no sabes exactamente qué busca.'},
      {text:'Si buscas ahorrar, quizá te convenga llevar solo una playera por ahora.', exp:12, sale:950, happy:1, stress:3, reaction:'La recomendación es honesta y Rodrigo aprecia que no intentaras venderle de más.'}
    ]
  },
  {
    name: 'Karen', mood: '😠 Molesta', intro: 'Compré estos tenis hace poco y siento que se están despegando.', answers: [
      {text:'Déjame revisar tu ticket y lo vemos juntos para encontrar una solución.', exp:18, sale:1200, happy:1, stress:6, reaction:'Karen baja la guardia: siente que escuchaste el problema antes de defender la tienda.'},
      {text:'¿Traes el ticket? Si no, tendría que revisar qué podemos hacer.', exp:10, sale:0, happy:0, stress:12, reaction:'La respuesta es correcta, pero suena un poco fría mientras está molesta.'},
      {text:'Podría enseñarte otro modelo por si quieres aprovechar y cambiarlo.', exp:4, sale:0, happy:0, stress:15, reaction:'Karen se molesta más porque intentaste vender antes de resolver su problema.'}
    ]
  },
  {
    name: 'Luis', mood: '🎁 Buscando regalo', intro: 'Quiero regalarle unos tenis a mi hermano, pero no sé exactamente cuál elegir.', answers: [
      {text:'¿Qué deporte practica o para qué los usa normalmente?', exp:16, sale:2600, happy:1, stress:3, reaction:'Con esa información puedes recomendar algo mucho más personal.'},
      {text:'¿Sabes qué talla usa? Con eso podemos empezar a reducir opciones.', exp:10, sale:2300, happy:0, stress:4, reaction:'Es una buena pregunta, aunque todavía falta conocer el uso que tendrá el regalo.'},
      {text:'Te puedo enseñar los modelos que más regala la gente.', exp:8, sale:2200, happy:0, stress:6, reaction:'Es práctico, pero la recomendación todavía es bastante general.'}
    ]
  },
  {
    name: 'Doña Lupita', mood: '😊 Tranquila', intro: 'Buenas tardes, mijo. Quiero algo cómodo para caminar, pero no sé mucho de tenis.', answers: [
      {text:'Claro. ¿Los usarías para caminar diario o principalmente los fines de semana?', exp:17, sale:2100, happy:1, stress:2, reaction:'Doña Lupita se siente escuchada y la conversación se vuelve muy cómoda.'},
      {text:'Tengo unos muy cómodos que están gustando mucho.', exp:10, sale:1900, happy:0, stress:4, reaction:'La recomendación funciona, aunque faltó entender un poco más sus hábitos.'},
      {text:'Si buscas algo cómodo, estos están bastante bien.', exp:7, sale:1700, happy:0, stress:7, reaction:'La atención es amable, pero la recomendación pudo ser más personalizada.'}
    ]
  },
  {
    name: 'Mateo', mood: '🔥 Entusiasmado', intro: 'Quiero unos tenis para jugar basket, pero también quiero que se vean cool.', answers: [
      {text:'¿Qué es más importante para ti: agarre, comodidad o el diseño?', exp:17, sale:3000, happy:1, stress:3, reaction:'Mateo siente que entendiste que rendimiento y estilo también pueden convivir.'},
      {text:'Tengo unos de basket que están muy de moda.', exp:8, sale:2800, happy:0, stress:5, reaction:'El modelo le gusta, aunque todavía no sabes qué busca en rendimiento.'},
      {text:'Si quieres que se vean cool, yo me iría por este color.', exp:7, sale:2500, happy:0, stress:7, reaction:'Te enfocaste en estética antes de conocer sus necesidades deportivas.'}
    ]
  },
  {
    name: 'Mariana', mood: '💸 Cuida su presupuesto', intro: 'Me gustó este conjunto, pero siento que está un poco caro.', answers: [
      {text:'¿Qué presupuesto querías mantener? Busquemos algo que sí tenga sentido para ti.', exp:16, sale:1600, happy:1, stress:2, reaction:'Mariana nota que respetaste su presupuesto y no intentaste presionarla.'},
      {text:'Podemos aprovechar una promoción que tenemos esta semana.', exp:10, sale:1800, happy:0, stress:5, reaction:'La promoción ayuda, pero todavía no sabes cuánto quería gastar.'},
      {text:'Este conjunto vale la pena por la calidad.', exp:7, sale:1900, happy:0, stress:8, reaction:'Le das argumentos, pero no respondes directamente a su preocupación.'}
    ]
  },
  {
    name: 'Andrés', mood: '😐 Solo viendo', intro: 'Gracias, solo estoy viendo por ahora.', answers: [
      {text:'Perfecto. Tómate tu tiempo. Si necesitas talla, producto o una opinión, aquí estoy.', exp:15, sale:0, happy:1, stress:0, reaction:'Andrés siente que puede explorar sin presión.'},
      {text:'Claro. ¿Buscas tenis o ropa?', exp:7, sale:0, happy:0, stress:3, reaction:'La pregunta es amable, pero todavía lo interrumpes un poco.'},
      {text:'Tenemos descuento en varios modelos por si quieres aprovechar.', exp:4, sale:0, happy:0, stress:6, reaction:'Andrés se siente presionado y decide seguir viendo por su cuenta.'}
    ]
  },
  {
    name: 'Gabriela', mood: '🧠 Muy informada', intro: 'Ya investigué tres modelos y quiero decidir cuál me conviene más.', answers: [
      {text:'¿Qué diferencias viste entre ellos y qué te importa más al usarlos?', exp:18, sale:3200, happy:1, stress:3, reaction:'Gabriela disfruta comparar y siente que estás tomando en serio su investigación.'},
      {text:'El más vendido de esos es este.', exp:8, sale:2900, happy:0, stress:5, reaction:'La popularidad ayuda, pero ella buscaba una comparación más personalizada.'},
      {text:'Yo personalmente elegiría este porque se ve mejor.', exp:5, sale:2700, happy:0, stress:8, reaction:'Tu opinión no responde a sus criterios de uso.'}
    ]
  },
  {
    name: 'Jorge', mood: '⏱️ Tiene prisa', intro: 'Tengo cinco minutos. Necesito algo para correr mañana.', answers: [
      {text:'Vamos directo a lo importante: ¿corres en asfalto y cuántos kilómetros haces normalmente?', exp:16, sale:2900, happy:1, stress:4, reaction:'Jorge agradece que fueras directo sin perder la personalización.'},
      {text:'Te enseño rápidamente los tres modelos que más vendemos para correr.', exp:11, sale:2600, happy:0, stress:5, reaction:'Fuiste rápido, pero una pregunta más habría ayudado.'},
      {text:'Hay muchas opciones, pero podemos empezar viendo los más cómodos.', exp:6, sale:2100, happy:0, stress:10, reaction:'Jorge siente que estás tardando demasiado.'}
    ]
  }
];

const recurring = {
  'Sofía': {returnText:'¡Volví! La recomendación que me diste la vez pasada me encantó.'},
  'Rodrigo': {returnText:'Regresé porque sí me funcionó la ropa que me recomendaste.'},
  'Doña Lupita': {returnText:'Mijo, tus tenis me salieron muy cómodos. Quiero otros.'}
};

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

function getRank() {
  if (state.experience >= 90 && state.sales >= 22000) return 'Gerente';
  if (state.experience >= 65 && state.sales >= 14000) return 'Subgerente';
  if (state.experience >= 35) return 'Asesor Senior';
  return 'Asesor';
}

function applyEvent() {
  state.event = events[Math.floor(Math.random() * events.length)];
  state.stress = Math.max(0, Math.min(100, state.stress + state.event.stress));
  showEventBanner();
}

function showEventBanner() {
  const banner = document.createElement('div');
  banner.style.position = 'absolute';
  banner.style.top = '92px';
  banner.style.left = '50%';
  banner.style.transform = 'translateX(-50%)';
  banner.style.zIndex = '20';
  banner.style.background = '#fff8e8';
  banner.style.border = '5px solid #172019';
  banner.style.padding = '12px 20px';
  banner.style.maxWidth = '80%';
  banner.style.textAlign = 'center';
  banner.innerHTML = `<b style="font-family:monospace">📣 ${state.event.name}</b><br>${state.event.text}`;
  document.getElementById('game').appendChild(banner);
  setTimeout(() => banner.remove(), 2800);
}

function openClient() {
  const client = clients[state.clientIndex];
  if (!client) return finishDay();

  state.clientsSeen += 1;
  state.lastClient = client.name;
  clientNameEl.textContent = client.name;
  clientMoodEl.textContent = client.mood;
  clientStarsEl.textContent = '★★★★★';

  const returner = state.history.some(h => h.client === client.name && h.happy);
  clientTextEl.textContent = returner && recurring[client.name] ? recurring[client.name].returnText : client.intro;
  customerBubble.textContent = returner ? '¡Qué gusto verte otra vez!' : '...';
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
  const eventFactor = state.event?.sales || 1;
  const finalSale = Math.round(answer.sale * eventFactor);
  const returning = state.history.some(h => h.client === state.lastClient && h.happy);

  state.experience = Math.min(100, state.experience + answer.exp + (returning ? 3 : 0));
  state.happy += answer.happy;
  state.sales += finalSale;
  state.commission += Math.round(finalSale * 0.03);
  state.money += Math.round(finalSale * 0.03);
  state.stress = Math.max(0, Math.min(100, state.stress + answer.stress - (answer.happy ? 2 : 0)));
  if (returning) state.returningClients += 1;
  state.reputation = Math.max(1, Math.min(5, state.reputation + (answer.happy ? 0.08 : -0.04)));

  state.history.push({
    client: state.lastClient,
    answer: answer.text,
    result: answer.reaction,
    happy: Boolean(answer.happy),
    sale: finalSale
  });

  updateHud();
  customerBubble.textContent = answer.reaction;
  customerBubble.classList.remove('hidden');
  guilleBubble.textContent = answer.happy ? 'Bien hecho. La experiencia viene antes de la venta.' : 'La venta importa, pero recuerda: ¿cómo se sintió el cliente?';
  guilleBubble.classList.remove('hidden');

  [...choicesEl.querySelectorAll('button')].forEach(b => b.disabled = true);

  setTimeout(() => {
    dialogPanel.classList.add('hidden');
    guilleBubble.classList.add('hidden');
    state.clientIndex += 1;

    if (state.clientIndex === 5 || state.clientIndex === 8) applyEvent();

    const previousRank = state.rank;
    state.rank = getRank();
    if (state.rank !== previousRank) {
      setTimeout(() => alert(`🎉 ¡ASCENSO!\n\nGuille ahora es ${state.rank}.\n\nSigue creando experiencias memorables.`), 100);
    }

    if (state.clientIndex < clients.length) openClient();
    else finishDay();
  }, 1700);
}

function finishDay() {
  document.getElementById('rClients').textContent = state.clientsSeen;
  document.getElementById('rHappy').textContent = state.happy;
  document.getElementById('rSales').textContent = `$${state.sales.toLocaleString('es-MX')}`;
  document.getElementById('rCommission').textContent = `$${state.commission.toLocaleString('es-MX')}`;
  document.getElementById('rExperience').textContent = `${state.experience}/100`;
  const rating = Math.min(5, Math.max(2.5, state.reputation));
  document.getElementById('rRating').textContent = `${rating.toFixed(1)}★`;

  let message;
  if (state.rank === 'Gerente') {
    message = '👑 ¡Gerente! Lograste combinar ventas con una experiencia memorable y fidelización.';
  } else if (state.rank === 'Subgerente') {
    message = '🏆 ¡Subgerente! Tus decisiones muestran una fuerte orientación al cliente.';
  } else if (state.experience >= 70) {
    message = '⭐ Excelente día. Escuchar, personalizar y resolver problemas convirtió la atención en una experiencia.';
  } else {
    message = '💡 Aprendizaje del día: vender no siempre significa atender bien. La experiencia influye en la satisfacción y en el deseo de regresar.';
  }
  document.getElementById('finalMessage').innerHTML = `${message}<br><br><small>Clientes recurrentes: ${state.returningClients} · Rango: ${state.rank}</small>`;
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
  state.returningClients = 0;
  state.rank = 'Asesor';
  state.reputation = 3.5;
  state.history = [];
  state.event = null;
  state.lastClient = null;
  updateHud();
  show(screens.game);
  openClient();
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('aboutBtn').addEventListener('click', () => {
  alert('Old Balance Experience\n\nSimulador de Mercadotecnia de Experiencias.\n\nAtiende, escucha, vende y construye clientes que quieran regresar.');
});

updateHud();