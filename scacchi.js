const alphabet = "abcdefghijklmnopqrstuvwxyz";

let turno = true;
let pedine = [];

// Cronologia delle mosse per l'annulla mossa
let cronologiaMosse = [];
let maxCronologia = 50; // Limite di mosse da ricordare

// Variabili per l'AI
let aiEnabled = false;
let aiColor = "nero"; // L'AI gioca sempre con i pezzi neri
let aiDifficulty = "medium"; // easy, medium, hard
let aiThinking = false;

function init() {
  inizializzaScacchiera();
  generateBoard();
  posizionaPedine();
  updateGameStatus();
  updateUndoButton();
}

function inizializzaScacchiera() {
  for (let i = 0; i < 8; i++) {
    scacchiera[i] = [];
    for (let j = 0; j < 8; j++) {
      scacchiera[i][j] = null;
    }
  }
}

function generateBoard() {
  let tableScacchiera = document.getElementById("scacchiera");
  let tr = creaRiga(tableScacchiera);
  tr.id = 0;
  for (let i = 0; i < 9; i++) {
    let td = null;
    if (i == 0) {
      td = creaCasella(tr, "");
    } else {
      td = creaCasella(tr, "info");
      td.innerHTML = alphabet[i - 1];
    }
  }
  let count = 0;
  let colonna = 8;
  for (let i = 1; i < 9; i++) {
    let tr = creaRiga(tableScacchiera);
    tr.id = i;
    let riga = 1;
    for (let j = 0; j < 9; j++) {
      if (j == 0) {
        td = creaCasella(tr, "info");
        td.innerHTML = "" + colonna;
      } else {
        if (count % 2 == 1) {
          td = creaCasella(tr, "bianca");
        } else {
          td = creaCasella(tr, "nera");
        }
        td.riga = riga;
        td.colonna = colonna;
        td.id = "cella" + riga + "" + colonna;
        td.addEventListener("dragover", allowDrop);
        td.addEventListener("drop", drop);
        scacchiera[riga - 1][colonna - 1] = td;
        riga++;
      }
      count++;
    }
    colonna--;
  }
}

function creaRiga(scacchiera) {
  let tr = document.createElement("tr");
  scacchiera.appendChild(tr);
  return tr;
}

function creaCasella(riga, tipo) {
  let td = document.createElement("td");
  riga.appendChild(td);
  td.classList.add("casella");
  if (tipo == "info") {
    td.classList.add("casellaInfo");
  } else if (tipo == "nera") {
    td.classList.add("casellaNera");
  } else if (tipo == "bianca") {
    td.classList.add("casellaBianca");
  }
  return td;
}


function creaEPiazzaPedina(tipo, posizione, imgSrc, color) {
  let img = document.createElement("img");
  img.src = imgSrc;
  img.classList.add("pedina");
  img.draggable = true;
  img.addEventListener("dragstart", drag);
  img.id = tipo + posizione.x + posizione.y;
  img.addEventListener("dragover", allowDrop);
  img.addEventListener("drop", drop);
  let cella = document.getElementById("cella" + posizione.x + posizione.y);
  cella.appendChild(img);

  let pedina = null;
  switch (tipo) {
    case "PedoneBianco":
      pedina = new PedoneBianco(img, posizione);
      break;
    case "PedoneNero":
      pedina = new PedoneNero(img, posizione);
      break;
    case "TorreBianca":
      pedina = new Torre(img, posizione, color);
      break;
    case "TorreNera":
      pedina = new Torre(img, posizione, color);
      break;
    case "CavalloBianco":
      pedina = new Cavallo(img, posizione, color);
      break;
    case "CavalloNero":
      pedina = new Cavallo(img, posizione, color);
      break;
    case "AlfiereBianco":
      pedina = new Alfiere(img, posizione, color);
      break;
    case "AlfiereNero":
      pedina = new Alfiere(img, posizione, color);
      break;
    case "ReginaBianca":
      pedina = new Regina(img, posizione, color);
      break;
    case "ReginaNera":
      pedina = new Regina(img, posizione, color);
      break;
    case "ReBianco":
      pedina = new Re(img, posizione, color);
      break;
    case "ReNero":
      pedina = new Re(img, posizione, color);
      break;
  }
  pedine.push(pedina);
}

function posizionaPedine() {

  for (let i = 0; i < 8; i++) {
    creaEPiazzaPedina(
      "PedoneBianco",
      { x: 1 + i, y: 2 },
      "./img/PedoneBianco.png",
      "bianco"
    );
    creaEPiazzaPedina(
      "PedoneNero",
      { x: 1 + i, y: 7 },
      "./img/PedoneNero.png",
      "nero"
    );
  }


  creaEPiazzaPedina(
    "TorreBianca",
    { x: 1, y: 1 },
    "./img/TorreBianca.png",
    "bianco"
  );
  creaEPiazzaPedina(
    "TorreBianca",
    { x: 8, y: 1 },
    "./img/TorreBianca.png",
    "bianco"
  );
  creaEPiazzaPedina("TorreNera", { x: 1, y: 8 }, "./img/TorreNera.png", "nero");
  creaEPiazzaPedina("TorreNera", { x: 8, y: 8 }, "./img/TorreNera.png", "nero");


  creaEPiazzaPedina(
    "CavalloBianco",
    { x: 2, y: 1 },
    "./img/CavalloBianco.png",
    "bianco"
  );
  creaEPiazzaPedina(
    "CavalloBianco",
    { x: 7, y: 1 },
    "./img/CavalloBianco.png",
    "bianco"
  );
  creaEPiazzaPedina(
    "CavalloNero",
    { x: 2, y: 8 },
    "./img/CavalloNero.png",
    "nero"
  );
  creaEPiazzaPedina(
    "CavalloNero",
    { x: 7, y: 8 },
    "./img/CavalloNero.png",
    "nero"
  );


  creaEPiazzaPedina(
    "AlfiereBianco",
    { x: 3, y: 1 },
    "./img/AlfiereBianco.png",
    "bianco"
  );
  creaEPiazzaPedina(
    "AlfiereBianco",
    { x: 6, y: 1 },
    "./img/AlfiereBianco.png",
    "bianco"
  );
  creaEPiazzaPedina(
    "AlfiereNero",
    { x: 3, y: 8 },
    "./img/AlfiereNero.png",
    "nero"
  );
  creaEPiazzaPedina(
    "AlfiereNero",
    { x: 6, y: 8 },
    "./img/AlfiereNero.png",
    "nero"
  );


  creaEPiazzaPedina(
    "ReginaBianca",
    { x: 4, y: 1 },
    "./img/ReginaBianca.png",
    "bianco"
  );
  creaEPiazzaPedina(
    "ReginaNera",
    { x: 4, y: 8 },
    "./img/ReginaNera.png",
    "nero"
  );

  creaEPiazzaPedina("ReBianco", { x: 5, y: 1 }, "./img/ReBianco.png", "bianco");
  creaEPiazzaPedina("ReNero", { x: 5, y: 8 }, "./img/ReNero.png", "nero");


  pedine.forEach(pedina => {
    if (pedina.constructor.name === "PedoneBianco" || pedina.constructor.name === "PedoneNero") {
      pedina.firstMove = true;
    }
  });


  setTimeout(() => {
    salvaStatoGioco();
  }, 100);
}

function drag(event) {
  event.dataTransfer.setData("id", event.target.id);
  

  const pedinaElement = event.target;
  const pedina = getPedinaByReference(pedinaElement);
  
  if (pedina) {

    const cella = pedinaElement.parentNode;
    cella.classList.add("selected");
    

    if ((turno && pedina.color === "bianco") || (!turno && pedina.color === "nero")) {
      highlightValidMoves(pedina);
    }
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  let data = event.dataTransfer.getData("id");
  let target = event.target;
  if (target.tagName.toLowerCase() === "img") {
    target = target.parentNode;
  }
  let pedinaOggetto = document.getElementById(data);
  let pedina = getPedinaByReference(pedinaOggetto);
  console.log(
    (turno == true && pedina.color == "bianco") ||
      (turno == false && pedina.color == "nero")
  );
  if (
    (turno == true && pedina.color == "bianco") ||
    (turno == false && pedina.color == "nero")
  ) {
    let riga = target.riga;
    let colonna = target.colonna;    nuovaPosizione = { x: riga, y: colonna };


    if (pedina.checkMove(nuovaPosizione)) {

      salvaStatoGioco();
      

      let pieceAtPos = getPieceAtPosition(nuovaPosizione);
      
      if (pieceAtPos != null) {

        let index = pedine.indexOf(pieceAtPos);
        if (index !== -1) {
          pedine.splice(index, 1);
        }
        showNotification("Pezzo catturato!", "success");
      } else {
        showNotification("Mossa eseguita!", "success");
      }


      let cella = document.getElementById(target.id);
      cella.innerHTML = "";
      cella.appendChild(pedina.oggetto);
      pedina.posizione.x = riga;
      pedina.posizione.y = colonna;
      turno = !turno;
      

      updateGameStatus();
      clearHighlights();
      
    } else {

      clearHighlights();
      showNotification("Mossa non valida!", "error");
    }
  } else {

    clearHighlights();
    showNotification("Non è il tuo turno!", "error");
  }
}

function getPedinaByReference(oggetto) {
  for (let i = 0; i < pedine.length; i++) {
    if (pedine[i].oggetto.id == oggetto.id) {
      return pedine[i];
    }
  }
  return null;
}

function getPieceAtPosition(position) {
  for (let i = 0; i < pedine.length; i++) {
    if (
      pedine[i].posizione.x == position.x &&
      pedine[i].posizione.y == position.y
    ) {
      return pedine[i];
    }
  }
  return null;
}

function checkOccupato(posizione) {
  for (let i = 0; i < pedine.length; i++) {
    if (
      posizione.x == pedine[i].posizione.x &&
      pedine[i].posizione.y == posizione.y
    ) {
      return false;
    }
  }
  return true;
}
function isPathClear(start, end) {
  let xDirection = Math.sign(end.x - start.x);
  let yDirection = Math.sign(end.y - start.y);
  let x = start.x + xDirection;
  let y = start.y + yDirection;
  while (x !== end.x || y !== end.y) {
    if (!checkOccupato({ x: x, y: y })) {
      return false;
    }
    x += xDirection;
    y += yDirection;
  }
  return true;
}


function updateGameStatus() {
  const statusElement = document.getElementById("currentPlayer");
  if (statusElement) {
    if (turno) {
      statusElement.textContent = "Turno del Bianco ♔";
      statusElement.className = "text-white";
    } else {
      statusElement.textContent = "Turno del Nero ♛";
      statusElement.className = "text-gray-300";
    }
  }
}

function resetGame() {

  const scacchiera = document.getElementById("scacchiera");
  scacchiera.innerHTML = "";


  turno = true;
  pedine = [];
  cronologiaMosse = []; // Pulisce la cronologia


  init();


  showNotification("Nuova partita iniziata!", "success");
}

function undoMove() {

  if (cronologiaMosse.length <= 1) {
    showNotification("Non ci sono mosse da annullare!", "error");
    return;
  }
  
  if (ripristinaStatoGioco()) {
    showNotification("Mossa annullata!", "success");
  }
}


function salvaStatoGioco() {

  const stato = {
    turno: turno,
    pedine: pedine.map(pedina => ({
      id: pedina.oggetto.id,
      tipo: pedina.constructor.name,
      posizione: { x: pedina.posizione.x, y: pedina.posizione.y },
      color: pedina.color,
      src: pedina.oggetto.src,
      firstMove: pedina.firstMove || false // Salva il flag firstMove se esiste
    }))
  };
  

  cronologiaMosse.push(stato);
  

  if (cronologiaMosse.length > maxCronologia) {
    cronologiaMosse.shift();
  }
  

  updateUndoButton();
}

function ripristinaStatoGioco() {
  if (cronologiaMosse.length === 0) {
    showNotification("Nessuna mossa da annullare!", "error");
    return false;
  }
  

  const statoToRestore = cronologiaMosse.pop();
  

  const scacchiera = document.getElementById("scacchiera");
  const caselle = scacchiera.querySelectorAll(".casella");
  caselle.forEach(casella => {

    if (!casella.classList.contains("casellaInfo")) {
      casella.innerHTML = "";
    }
  });
  

  turno = statoToRestore.turno;
  

  pedine = [];
  statoToRestore.pedine.forEach(pedinaData => {
    ricrePedina(pedinaData);
  });
  

  updateGameStatus();
  clearHighlights();
  updateUndoButton();
  
  return true;
}

function ricrePedina(pedinaData) {

  let img = document.createElement("img");
  img.src = pedinaData.src;
  img.classList.add("pedina");
  img.draggable = true;
  img.addEventListener("dragstart", drag);
  img.id = pedinaData.id;
  img.addEventListener("dragover", allowDrop);
  img.addEventListener("drop", drop);
  

  let cella = document.getElementById("cella" + pedinaData.posizione.x + pedinaData.posizione.y);
  cella.appendChild(img);

  let pedina = null;
  switch (pedinaData.tipo) {
    case "PedoneBianco":
      pedina = new PedoneBianco(img, pedinaData.posizione);
      if (pedinaData.firstMove !== undefined) pedina.firstMove = pedinaData.firstMove;
      break;
    case "PedoneNero":
      pedina = new PedoneNero(img, pedinaData.posizione);
      if (pedinaData.firstMove !== undefined) pedina.firstMove = pedinaData.firstMove;
      break;
    case "Torre":
      pedina = new Torre(img, pedinaData.posizione, pedinaData.color);
      break;
    case "Cavallo":
      pedina = new Cavallo(img, pedinaData.posizione, pedinaData.color);
      break;
    case "Alfiere":
      pedina = new Alfiere(img, pedinaData.posizione, pedinaData.color);
      break;
    case "Regina":
      pedina = new Regina(img, pedinaData.posizione, pedinaData.color);
      break;
    case "Re":
      pedina = new Re(img, pedinaData.posizione, pedinaData.color);
      break;
  }
  
  if (pedina) {
    pedine.push(pedina);
  }
}

function updateUndoButton() {
  const undoButton = document.getElementById("undoButton");
  const undoCount = document.getElementById("undoCount");
  
  if (undoButton && undoCount) {

    const mosseAnnullabili = Math.max(0, cronologiaMosse.length - 1);
    undoCount.textContent = mosseAnnullabili;
    
    if (cronologiaMosse.length <= 1) {
      undoButton.disabled = true;
      undoButton.classList.add("opacity-50", "cursor-not-allowed");
      undoButton.classList.remove("hover:from-orange-600", "hover:to-orange-800", "hover:shadow-xl", "transform", "hover:-translate-y-1");
    } else {
      undoButton.disabled = false;
      undoButton.classList.remove("opacity-50", "cursor-not-allowed");
      undoButton.classList.add("hover:from-orange-600", "hover:to-orange-800", "hover:shadow-xl", "transform", "hover:-translate-y-1");
    }
  }
}
function highlightValidMoves(pedina) {

  clearHighlights();
  

  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      const posizione = { x: i, y: j };
      if (pedina.checkMove(posizione)) {
        const cella = document.getElementById(`cella${i}${j}`);
        if (cella) {

          let pieceAtPos = getPieceAtPosition(posizione);
          if (pieceAtPos != null && pieceAtPos.color !== pedina.color) {
            cella.classList.add("valid-capture");
          } else if (pieceAtPos == null) {
            cella.classList.add("valid-move");
          }
        }
      }
    }
  }
}

function clearHighlights() {
  const caselle = document.querySelectorAll(".casella");
  caselle.forEach((casella) => {
    casella.classList.remove("valid-move", "valid-capture", "selected");
  });
}


function getCronologiaInfo() {
  return {
    totaleMosse: cronologiaMosse.length,
    ultimaMossa: cronologiaMosse.length > 0 ? cronologiaMosse[cronologiaMosse.length - 1] : null,
    puoAnnullare: cronologiaMosse.length > 1 // Mantiene almeno lo stato iniziale
  };
}


function mostraCronologia() {
  console.log("Cronologia mosse:", cronologiaMosse);
  console.log("Info cronologia:", getCronologiaInfo());
}


document.addEventListener("keydown", function(event) {

  if (event.ctrlKey && event.key === 'z') {
    event.preventDefault();
    if (cronologiaMosse.length > 1) { // Mantiene lo stato iniziale
      undoMove();
    }
  }
  

  if (event.ctrlKey && event.key === 'r') {
    event.preventDefault();
    resetGame();
  }
});


document.addEventListener("DOMContentLoaded", function () {
  updateGameStatus();
  

  setTimeout(() => {
    showNotification("💡 Suggerimento: Usa Ctrl+Z per annullare, Ctrl+R per reset", "info");
  }, 3000);
});
