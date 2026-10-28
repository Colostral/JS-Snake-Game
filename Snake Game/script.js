//linha e depois coluna
//start();
var direcao = [];
var ultimaDirecao = "d";
var intervalo = null;

var maxScore = 0;

var paredeLivre = false;
var movimentoLivre = false;

var botaoPlay = document.getElementById("botaoPlay");
var telaInicio = document.getElementById("telaInicio");
var areaCobra = document.getElementById("areaCobra");
var areaFruta = document.getElementById("areaFruta");

var velocidade = 200;

var animacao = null;

var inicioMovimento = 0;

var cobraAnterior = [];

botaoPlay.addEventListener("click", function () {
  telaInicio.style.display = "none";
  start();
});

botaoRestart.addEventListener("click", function () {
  telaInicio.style.display = "none";
  botaoRestart.style.display = "none";

  start();
});

addEventListener("keydown", function (event) {
  direcaoCobra(event.key);
});

function mover() {
  cobraAnterior = cobra.map(function (parte) {
    return [parte[0], parte[1]];
  });
  //guarda as cordenadas antigas da cobra

  moverCorpo();

  if (direcao.length > 0) {
    ultimaDirecao = direcao.shift();
  }

  switch (ultimaDirecao) {
    case "a":
      cobra[0][1] -= 1;
      break;

    case "s":
      cobra[0][0] += 1;
      break;

    case "d":
      cobra[0][1] += 1;
      break;

    case "w":
      cobra[0][0] -= 1;
      break;
  }

  if (eventos()) {
    return;
  }

  if (parede()) {
    return;
  }

  inicioMovimento = performance.now();

  if (!movimentoLivre) {
    intervalo = setTimeout(mover, velocidade);
  }
}

function direcaoCobra(clicado) {
  if (direcao.length >= 4) {
    return;
  }
  switch (clicado) {
    case "a":
      if (ultimaDirecao != "d") {
        direcao.push("a");
      }
      break;
    case "s":
      if (ultimaDirecao != "w") {
        direcao.push("s");
      }
      break;
    case "d":
      if (ultimaDirecao != "a") {
        direcao.push("d");
      }
      break;
    case "w":
      if (ultimaDirecao != "s") {
        direcao.push("w");
      }
      break;
  }

  if (movimentoLivre) {
    mover();
  }
}
function parede() {
  if (paredeLivre) {
    if (cobra[0][1] < 0) {
      cobra[0][1] = 8;
    }
    if (cobra[0][0] > 9) {
      cobra[0][0] = 1;
    }
    if (cobra[0][1] > 8) {
      cobra[0][1] = 0;
    }
    if (cobra[0][0] < 1) {
      cobra[0][0] = 9;
    }
  } else {
    if (cobra[0][1] < 0) {
      morrer();
      return true;
    }
    if (cobra[0][0] > 9) {
      morrer();
      return true;
    }
    if (cobra[0][1] > 8) {
      morrer();
      return true;
    }
    if (cobra[0][0] < 1) {
      morrer();
      return true;
    }
  }
}

function eventos() {
  var cabeca = cobra[0].toString();
  if (cobra.length === 81) {
    venceu();
    return;
  }
  if (cabeca === fruta.toString()) {
    comer();
  }

  for (i = cobra.length - 1; i >= 1; i--) {
    var corpo = cobra[i].toString();

    if (cabeca === corpo) {
      cabeca = 0;
      morrer();
      return true;
    }
  }

  return false;
}

function moverCorpo() {
  for (i = cobra.length - 1; i >= 1; i--) {
    cobra[i][1] = cobra[i - 1][1];
    cobra[i][0] = cobra[i - 1][0];
  }
}
function frutas() {
  var quantidade = 0;
  if (pontos == 0) {
    fruta = [5, 6];
  } else {
    do {
      var x = Math.floor(Math.random() * 9);
      var y = Math.floor(Math.random() * 8);
      if (x === 0) {
        x++;
      }
      fruta = [x, y];
      var existe = cobra.some((linha) =>
        linha.every((valor, index) => valor === fruta[index]),
      );
    } while (existe === true);
  }

  areaFruta.innerHTML = "";

  var frutaFisica = document.createElement("div");

  frutaFisica.classList.add("fruta");

  frutaFisica.style.top = (fruta[0] - 1) * 50 + "px";
  frutaFisica.style.left = fruta[1] * 50 + "px";

  areaFruta.appendChild(frutaFisica);

  return fruta;
}

function comer() {
  pontos++;
  if (pontos > maxScore) {
    maxScore = pontos;
  }
  document.getElementById("score").textContent = "Pontos: " + pontos;
  document.getElementById("maxScore").style.display = "flex";
  document.getElementById("maxScore").textContent =
    "Max: " + maxScore;
  let i = cobra.length - 1;
  cobra.push([cobra[i][0], cobra[i][1]]);
  frutas();
}

function morrer() {
  cancelAnimationFrame(animacao);
  telaInicio.style.display = "flex";

  botaoPlay.style.display = "none";
  botaoRestart.style.display = "flex";
  if (movimentoLivre) {
    desativarMovimento();
  }
}
function venceu() {
  alert("Parabéns, você zerou o jogo!");
  start();
}

function start() {
  clearTimeout(intervalo);

  direcao = [];
  pontos = 0;
  document.getElementById("score").textContent = "Pontos: " + pontos;
  ultimaDirecao = "d";

  cobra = [
    [5, 2],
    [5, 1],
    [5, 0],
  ];

  pontos = 0;

  for (let i = 1; i <= 9; i++) {
    for (let j = 0; j < 9; j++) {
      cell = document.getElementById("cell[" + i + "][" + j + "]");

      cell.style.backgroundColor = "rgb(20, 20, 20)";
    }
  }

  fruta = frutas();

  cobraAnterior = cobra.map(function (parte) {
    return [parte[0], parte[1]];
  });

  inicioMovimento = performance.now();

  desenharCobra(1);

  cancelAnimationFrame(animacao);

  animacao = requestAnimationFrame(animarCobra);

  if (!movimentoLivre) {
    intervalo = setTimeout(mover, velocidade);
  }
}
function desenharCobra(progresso) {
  var corpoCobra = document.getElementById("corpoCobra");

  var caminho = "";

  var ultimoX = null;
  var ultimoY = null;

  for (let i = cobra.length - 1; i >= 0; i--) {
    var atual = cobra[i];

    var anterior =
      cobraAnterior[i] || cobraAnterior[cobraAnterior.length - 1] || atual;

    var xAnterior = anterior[1] * 50 + 25;

    var yAnterior = (anterior[0] - 1) * 50 + 25;

    var xAtual = atual[1] * 50 + 25;

    var yAtual = (atual[0] - 1) * 50 + 25;

    var x = xAnterior + (xAtual - xAnterior) * progresso;

    var y = yAnterior + (yAtual - yAnterior) * progresso;

    if (caminho === "") {
      caminho = "M " + x + " " + y;
    } else {
      if (Math.abs(x - ultimoX) > 51 || Math.abs(y - ultimoY) > 51) {
        caminho += " M " + x + " " + y;
      } else {
        caminho += " L " + x + " " + y;
      }
    }

    ultimoX = x;
    ultimoY = y;
  }

  corpoCobra.setAttribute("d", caminho);
}

function animarCobra(tempo) {
  var progresso = (tempo - inicioMovimento) / velocidade;

  if (progresso > 1) {
    progresso = 1;
  }

  desenharCobra(progresso);

  animacao = requestAnimationFrame(animarCobra);
}
function desativarParede() {
  if (paredeLivre) {
    paredeLivre = false;
    document.getElementById("botaoParede").textContent = "Desativar parede";
  } else {
    paredeLivre = true;
    document.getElementById("botaoParede").textContent = "Ativar parede";
  }
}

function desativarMovimento() {
  if (movimentoLivre) {
    movimentoLivre = false;
    document.getElementById("botaoMovimento").textContent =
      "Ativar Movimento livre";
    intervalo = setTimeout(mover, 175);
  } else {
    movimentoLivre = true;
    document.getElementById("botaoMovimento").textContent =
      "Desativar Movimento livre";
  }
}
