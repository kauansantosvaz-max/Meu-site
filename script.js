const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pontos = 0;
const cobra = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  raio: 12,
  cor: "#00ff88",
  corpo: [],
  tamanho: 20,
  velocidade: 3
};

const comidas = [];
for (let i = 0; i < 50; i++) {
  gerarComida();
}

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function gerarComida() {
  comidas.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    raio: Math.random() * 4 + 3,
    cor: `hsl(${Math.random() * 360}, 100%, 50%)`
  });
}

function atualizar() {
  // Movimentação em direção ao mouse
  const dx = mouse.x - cobra.x;
  const dy = mouse.y - cobra.y;
  const distancia = Math.hypot(dx, dy);

  if (distancia > 5) {
    cobra.x += (dx / distancia) * cobra.velocidade;
    cobra.y += (dy / distancia) * cobra.velocidade;
  }

  // Histórico de posições para formar o rastro (corpo)
  cobra.corpo.unshift({ x: cobra.x, y: cobra.y });
  if (cobra.corpo.length > cobra.tamanho) {
    cobra.corpo.pop();
  }

  // Colisão com comida
  comidas.forEach((comida, index) => {
    const distComida = Math.hypot(comida.x - cobra.x, comida.y - cobra.y);
    if (distComida < cobra.raio + comida.raio) {
      comidas.splice(index, 1);
      cobra.tamanho += 3;
      pontos += 10;
      document.getElementById("placar").innerText = "Pontos: " + pontos;
      gerarComida();
    }
  });
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha as comidas
  comidas.forEach((comida) => {
    ctx.beginPath();
    ctx.arc(comida.x, comida.y, comida.raio, 0, Math.PI * 2);
    ctx.fillStyle = comida.cor;
    ctx.fill();
    ctx.closePath();
  });

  // Desenha o corpo da cobra
  for (let i = cobra.corpo.length - 1; i >= 0; i--) {
    const parte = cobra.corpo[i];
    ctx.beginPath();
    ctx.arc(parte.x, parte.y, cobra.raio, 0, Math.PI * 2);
    ctx.fillStyle = cobra.cor;
    ctx.fill();
    ctx.closePath();
  }
}

function loop() {
  atualizar();
  desenhar();
  requestAnimationFrame(loop);
}

loop();