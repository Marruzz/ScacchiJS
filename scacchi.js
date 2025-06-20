const alphabet = 'abcdefghijklmnopqrstuvwxyz';

let turno = true;
let pedine = [];
let scacchiera = [];

// Variabili per il tracking del gioco
let moveCount = 0;
let gameStartTime = null;
let gameTimer = null;
let moveHistory = [];
let capturedPieces = { white: [], black: [] };
let isGameActive = true;

// Riferimenti alle scacchiere
let scacchieraMobile = [];
let scacchieraDesktop = [];

// Mappa delle tabelle scacchiera
const chessboards = {
    mobile: 'scacchieraMobile',
    desktop: 'scacchieraDesktop'
};



function init(){
    console.log("Inizializzazione avviata...");
    inizializzaScacchiera();
    console.log("Scacchiera inizializzata");
    
    // Genera entrambe le scacchiere
    generateBoard('scacchieraDesktop');
    generateBoard('scacchieraMobile');
    
    // Usa la scacchiera desktop come riferimento principale
    scacchiera = scacchieraDesktop;
    
    console.log("Board generate");
    posizionaPedine();
    console.log("Pedine posizionate");    
    // Inizializza UI e timer
    setTimeout(() => {
        startGameTimer();
        updateCurrentPlayer();
        setupEventListeners();
    }, 1000);
}


function inizializzaScacchiera(){
    for(let i=0;i<8;i++){
        scacchiera[i]=[]
        for(let j=0;j<8;j++){
            scacchiera[i][j]=null;
        }
    }
}

function generateBoard(tableId = 'scacchieraDesktop'){
    console.log("Generazione board iniziata per:", tableId);
    let tableScacchiera = document.getElementById(tableId);
    console.log("Elemento scacchiera trovato:", tableScacchiera);
    
    if (!tableScacchiera) {
        console.error("Elemento scacchiera non trovato per ID:", tableId);
        return;
    }
    
    // Determina quale array di scacchiera usare
    let currentBoard = tableId === 'scacchieraMobile' ? scacchieraMobile : scacchieraDesktop;
    
    // Inizializza l'array se necessario
    if (currentBoard.length === 0) {
        for(let i = 0; i < 8; i++){
            currentBoard[i] = [];
            for(let j = 0; j < 8; j++){
                currentBoard[i][j] = null;
            }
        }
    }
    
    // Pulisco eventuali contenuti precedenti
    tableScacchiera.innerHTML = "";
    
    let tr = creaRiga(tableScacchiera);
    tr.id=0;
    for (let i=0;i<9;i++){
        let td = null
        if(i==0){
            td=creaCasella(tr,"");
        }else{
            td=creaCasella(tr,"info");
            td.innerHTML = alphabet[i-1];
        }
    }
    let count=0;
    let colonna=8;
    for(let i=1;i<9;i++){
        let tr = creaRiga(tableScacchiera);
        tr.id=i;
        let riga=1;
        for(let j=0;j<9;j++){
            if(j==0){
                td=creaCasella(tr,"info");
                td.innerHTML = ""+colonna;
            }else{
                if(count%2==1){
                    td=creaCasella(tr,"bianca");
                }else{
                    td=creaCasella(tr,"nera");
                }
                td.riga=riga;
                td.colonna=colonna;
                td.id= "cella"+riga+""+colonna+"_"+tableId;
                td.classList.add(tableId); // Aggiungi classe per identificare la scacchiera
                td.addEventListener('dragover', allowDrop);
                td.addEventListener('drop', drop);
                currentBoard[riga-1][colonna-1] = td;
                
                // Sincronizza con scacchiera principale se necessario
                if (scacchiera.length === 0) {
                    scacchiera = scacchieraDesktop.length > 0 ? scacchieraDesktop : scacchieraMobile;
                }
                
                riga++;
            }
            count++;
        }
        colonna--;
    }
}

function creaRiga(scacchiera){
    let tr = document.createElement("tr");
    scacchiera.appendChild(tr);
    return tr
}

function creaCasella(riga, tipo){
    let td = document.createElement("td");
    riga.appendChild(td);
    td.classList.add("casella");
    if(tipo=="info"){
        td.classList.add("casellaInfo");
    }else if(tipo=="nera"){
        td.classList.add("casellaNera");
    }else if(tipo=="bianca"){
        td.classList.add("casellaBianca");
    }
    return td;
}

/*
function posizionaPedine(){

    for(let i=0;i<8;i++){
        let imgPedoneBianco = document.createElement("img");
        imgPedoneBianco.src="./img/PedoneBianco.png";
        imgPedoneBianco.classList.add("pedina");
        x=1+i;
        let posizioneBianco=document.getElementById("cella"+x+"2");
        posizioneBianco.appendChild(imgPedoneBianco);
        pedine.push(new PedoneBianco({X:i,y:2}));

        let imgPedoneNero = document.createElement("img");
        imgPedoneNero.src="./img/PedoneNero.png";
        imgPedoneNero.classList.add("pedina");
        x=1+i;
        let posizioneNero=document.getElementById("cella"+x+"7");
        posizioneNero.appendChild(imgPedoneNero);

        pedine.push(new PedoneNero({X:i,y:2}));
    }
}*/

function creaEPiazzaPedina(tipo, posizione, imgSrc, color) {
    // Crea pedina per scacchiera desktop
    let imgDesktop = document.createElement("img");
    imgDesktop.src = imgSrc;
    imgDesktop.classList.add("pedina");
    imgDesktop.draggable = true;
    imgDesktop.addEventListener('dragstart', drag);
    imgDesktop.id = tipo + posizione.x + posizione.y + "_desktop";
    imgDesktop.addEventListener('dragover', allowDrop);
    imgDesktop.addEventListener('drop', drop);
    
    // Crea pedina per scacchiera mobile
    let imgMobile = document.createElement("img");
    imgMobile.src = imgSrc;
    imgMobile.classList.add("pedina");
    imgMobile.draggable = true;
    imgMobile.addEventListener('dragstart', drag);
    imgMobile.id = tipo + posizione.x + posizione.y + "_mobile";
    imgMobile.addEventListener('dragover', allowDrop);
    imgMobile.addEventListener('drop', drop);
    
    // Trova le celle in entrambe le scacchiere
    let cellaDesktop = document.getElementById("cella" + posizione.x + posizione.y + "_scacchieraDesktop");
    let cellaMobile = document.getElementById("cella" + posizione.x + posizione.y + "_scacchieraMobile");
    
    if (cellaDesktop) {
        cellaDesktop.appendChild(imgDesktop);
    }
    if (cellaMobile) {
        cellaMobile.appendChild(imgMobile);
    }

    // Crea l'oggetto pedina (una sola istanza per entrambe le rappresentazioni visive)
    let pedina = null;
    switch (tipo) {
        case 'PedoneBianco':
            pedina = new PedoneBianco(imgDesktop, posizione);
            break;
        case 'PedoneNero':
            pedina = new PedoneNero(imgDesktop, posizione);
            break;
        case 'TorreBianca':
            pedina = new Torre(imgDesktop, posizione, color);
            break;
        case 'TorreNera':
            pedina = new Torre(imgDesktop, posizione, color);
            break;
        case 'CavalloBianco':
            pedina = new Cavallo(imgDesktop, posizione, color);
            break;
        case 'CavalloNero':
            pedina = new Cavallo(imgDesktop, posizione, color);
            break;
        case 'AlfiereBianco':
            pedina = new Alfiere(imgDesktop, posizione, color);
            break;
        case 'AlfiereNero':
            pedina = new Alfiere(imgDesktop, posizione, color);
            break;
        case 'ReginaBianca':
            pedina = new Regina(imgDesktop, posizione, color);
            break;
        case 'ReginaNera':
            pedina = new Regina(imgDesktop, posizione, color);
            break;
        case 'ReBianco':
            pedina = new Re(imgDesktop, posizione, color);
            break;
        case 'ReNero':
            pedina = new Re(imgDesktop, posizione, color);
            break;
    }
    
    // Aggiungi riferimenti alle immagini mobile per sincronizzazione
    if (pedina) {
        pedina.imgMobile = imgMobile;
        pedine.push(pedina);
    }
}

function posizionaPedine() {
    // Posizionamento dei pedoni
    for (let i = 0; i < 8; i++) {
        creaEPiazzaPedina('PedoneBianco', { x: 1 + i, y: 2 }, "./img/PedoneBianco.png", 'bianco');
        creaEPiazzaPedina('PedoneNero', { x: 1 + i, y: 7 }, "./img/PedoneNero.png", 'nero');
    }

    // Posizionamento delle torri
    creaEPiazzaPedina('TorreBianca', { x: 1, y: 1 }, "./img/TorreBianca.png", 'bianco');
    creaEPiazzaPedina('TorreBianca', { x: 8, y: 1 }, "./img/TorreBianca.png", 'bianco');
    creaEPiazzaPedina('TorreNera', { x: 1, y: 8 }, "./img/TorreNera.png", 'nero');
    creaEPiazzaPedina('TorreNera', { x: 8, y: 8 }, "./img/TorreNera.png", 'nero');

    // Posizionamento dei cavalli
    creaEPiazzaPedina('CavalloBianco', { x: 2, y: 1 }, "./img/CavalloBianco.png", 'bianco');
    creaEPiazzaPedina('CavalloBianco', { x: 7, y: 1 }, "./img/CavalloBianco.png", 'bianco');
    creaEPiazzaPedina('CavalloNero', { x: 2, y: 8 }, "./img/CavalloNero.png", 'nero');
    creaEPiazzaPedina('CavalloNero', { x: 7, y: 8 }, "./img/CavalloNero.png", 'nero');

    // Posizionamento degli alfieri
    creaEPiazzaPedina('AlfiereBianco', { x: 3, y: 1 }, "./img/AlfiereBianco.png", 'bianco');
    creaEPiazzaPedina('AlfiereBianco', { x: 6, y: 1 }, "./img/AlfiereBianco.png", 'bianco');
    creaEPiazzaPedina('AlfiereNero', { x: 3, y: 8 }, "./img/AlfiereNero.png", 'nero');
    creaEPiazzaPedina('AlfiereNero', { x: 6, y: 8 }, "./img/AlfiereNero.png", 'nero');

    // Posizionamento delle regine
    creaEPiazzaPedina('ReginaBianca', { x: 4, y: 1 }, "./img/ReginaBianca.png", 'bianco');
    creaEPiazzaPedina('ReginaNera', { x: 4, y: 8 }, "./img/ReginaNera.png", 'nero');

    // Posizionamento dei re
    creaEPiazzaPedina('ReBianco', { x: 5, y: 1 }, "./img/ReBianco.png", 'bianco');
    creaEPiazzaPedina('ReNero', { x: 5, y: 8 }, "./img/ReNero.png", 'nero');
}



function drag(event) {
    event.dataTransfer.setData("id", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}


function drop(event) {
    event.preventDefault();
    
    if (!isGameActive) return; // Blocca se il gioco non è attivo
    
    let data = event.dataTransfer.getData("id");
    let target = event.target;
    if (target.tagName.toLowerCase() === 'img') {
        target = target.parentNode;
    }
    let pedinaOggetto = document.getElementById(data);
    let pedina = getPedinaByReference(pedinaOggetto);
    console.log((turno==true&&pedina.color=="bianco")||(turno==false&&pedina.color=="nero"));
    
    if((turno==true&&pedina.color=="bianco")||(turno==false&&pedina.color=="nero")){

        let riga = target.riga;
        let colonna = target.colonna;
        let oldPosition = {x: pedina.posizione.x, y: pedina.posizione.y};
        let nuovaPosizione = {x:riga, y:colonna};

        if (pedina.checkMove(nuovaPosizione)&&checkOccupato(nuovaPosizione)){
            // Mossa normale
            let cella = document.getElementById(target.id);
            cella.appendChild(pedina.oggetto);
            pedina.posizione.x=riga;
            pedina.posizione.y=colonna;
            
            // Traccia la mossa
            const moveNotation = getPieceName(pedina) + getChessNotation(oldPosition.x, oldPosition.y) + '-' + getChessNotation(riga, colonna);
            addMoveToHistory(moveNotation);
            mosseCount++;
            
            turno=!turno;
            updateCurrentPlayer();
            updateMoveCount();
            
        }else if(pedina.checkMove(nuovaPosizione)&&!checkOccupato(nuovaPosizione)){

            pieceAtPos=getPieceAtPosition(nuovaPosizione);

            if(pieceAtPos.color!=pedina.color){
                // Cattura pezzo
                let index = pedine.indexOf(pieceAtPos);
                if (index !== -1) {
                    // Aggiungi ai pezzi catturati
                    const capturedPiece = {
                        name: getPieceName(pieceAtPos),
                        imgSrc: pieceAtPos.oggetto.src,
                        color: pieceAtPos.color
                    };
                    
                    if (pieceAtPos.color === 'bianco') {
                        capturedPieces.white.push(capturedPiece);
                    } else {
                        capturedPieces.black.push(capturedPiece);
                    }
                    
                    pedine.splice(index, 1);
                }

                let cella = document.getElementById(target.id);
                cella.innerHTML="";
                cella.appendChild(pedina.oggetto);
                console.log("Mangiato");
                
                // Traccia la mossa con cattura
                const moveNotation = getPieceName(pedina) + getChessNotation(oldPosition.x, oldPosition.y) + 'x' + getChessNotation(riga, colonna);
                addMoveToHistory(moveNotation);
                mosseCount++;
                
                pedina.posizione.x=riga;
                pedina.posizione.y=colonna;
                turno=!turno;
                
                updateCurrentPlayer();
                updateMoveCount();
                updateCapturedPieces();
            }
        }
    }
}


function getPedinaByReference(oggetto){

    for(let i=0; i<pedine.length; i++){
        if(pedine[i].oggetto.id==oggetto.id){
            return pedine[i];
        }
    }
    return null;
}

function getPieceAtPosition(position){
    for(let i=0; i<pedine.length; i++){
        if(pedine[i].posizione.x==position.x && pedine[i].posizione.y==position.y){
            return pedine[i];
        }
    }
    return null;
}

function checkOccupato(posizione){
    for(let i=0;i<pedine.length;i++){
        if(posizione.x==pedine[i].posizione.x&&pedine[i].posizione.y==posizione.y){
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

// ========== FUNZIONI PER IL TRACKING DEL GIOCO ==========

function startGameTimer() {
    gameStartTime = Date.now();
    gameTimer = setInterval(updateGameTime, 1000);
}

function stopGameTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

function updateGameTime() {
    if (!gameStartTime) return;
    
    const elapsedTime = Date.now() - gameStartTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Aggiorna tutti gli elementi con data-game-time
    const timeElements = document.querySelectorAll('[data-game-time]');
    timeElements.forEach(el => el.textContent = timeString);
}

function updateMoveCount() {
    const moveElements = document.querySelectorAll('[data-move-count]');
    moveElements.forEach(el => el.textContent = moveCount.toString());
}

function updateCurrentPlayer() {
    const playerSymbol = turno ? '♔' : '♛';
    const playerName = turno ? 'Giocatore Bianco' : 'Giocatore Nero';
    const playerColor = turno ? '#ffffff' : '#333333';
    
    // Aggiorna simbolo del giocatore
    const playerElements = document.querySelectorAll('[data-current-player]');
    playerElements.forEach(el => {
        el.textContent = playerSymbol;
        el.style.color = playerColor;
    });
    
    // Aggiorna nome del giocatore
    const nameElements = document.querySelectorAll('[data-player-name]');
    nameElements.forEach(el => el.textContent = playerName);
}

function addToMoveHistory(from, to, piece, captured = null) {
    const moveNotation = `${piece.constructor.name} ${alphabet[from.x-1]}${from.y} → ${alphabet[to.x-1]}${to.y}`;
    moveHistory.push({
        move: moveCount,
        notation: moveNotation,
        from: from,
        to: to,
        piece: piece,
        captured: captured,
        player: turno ? 'Bianco' : 'Nero'
    });
    
    updateMoveHistoryDisplay();
}

function updateMoveHistoryDisplay() {
    const historyContainer = document.querySelector('.max-h-48.overflow-y-auto');
    if (!historyContainer) return;
    
    if (moveHistory.length === 0) {
        historyContainer.innerHTML = '<div class="text-gray-400 text-center py-6 text-sm"><p>Nessuna mossa ancora effettuata</p></div>';
        return;
    }
    
    const historyHTML = moveHistory.slice(-10).map(move => 
        `<div class="text-xs text-gray-300 py-1 border-b border-gray-700">
            <span class="text-blue-400">${move.move}.</span> 
            <span class="${move.player === 'Bianco' ? 'text-white' : 'text-gray-400'}">${move.notation}</span>
        </div>`
    ).join('');
    
    historyContainer.innerHTML = historyHTML;
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

function addCapturedPiece(piece) {
    const color = piece.color === 'bianco' ? 'white' : 'black';
    capturedPieces[color].push(piece);
    updateCapturedPiecesDisplay();
}

function updateCapturedPiecesDisplay() {
    // Aggiorna per mobile
    const whiteContainerMobile = document.querySelector('[data-captured-white]');
    const blackContainerMobile = document.querySelector('[data-captured-black]');
    
    if (whiteContainerMobile) {
        if (capturedPieces.white.length === 0) {
            whiteContainerMobile.innerHTML = '<span class="text-gray-500 text-xs">Nessuno</span>';
        } else {
            whiteContainerMobile.innerHTML = capturedPieces.white.map(piece => 
                `<span class="text-xs bg-gray-700 px-1 rounded">${getPieceSymbol(piece)}</span>`
            ).join('');
        }
    }
    
    if (blackContainerMobile) {
        if (capturedPieces.black.length === 0) {
            blackContainerMobile.innerHTML = '<span class="text-gray-500 text-xs">Nessuno</span>';
        } else {
            blackContainerMobile.innerHTML = capturedPieces.black.map(piece => 
                `<span class="text-xs bg-gray-700 px-1 rounded">${getPieceSymbol(piece)}</span>`
            ).join('');
        }
    }
}

function getPieceSymbol(piece) {
    const symbols = {
        'PedoneBianco': '♟', 'PedoneNero': '♟',
        'Torre': '♜', 'Cavallo': '♞', 'Alfiere': '♝',
        'Regina': '♛', 'Re': '♚'
    };
    return symbols[piece.constructor.name] || '?';
}

function setupEventListeners() {
    // Event listeners per i pulsanti
    document.querySelectorAll('[data-action="new-game"]').forEach(btn => {
        btn.addEventListener('click', startNewGame);
    });
    
    document.querySelectorAll('[data-action="restart"]').forEach(btn => {
        btn.addEventListener('click', startNewGame);
    });
    
    document.querySelectorAll('[data-action="undo"]').forEach(btn => {
        btn.addEventListener('click', undoLastMove);
    });
    
    document.querySelectorAll('[data-action="rules"]').forEach(btn => {
        btn.addEventListener('click', showRules);
    });
}

function startNewGame() {
    // Reset variabili
    moveCount = 0;
    turno = true;
    moveHistory = [];
    capturedPieces = { white: [], black: [] };
    pedine = [];
    
    // Stop timer esistente
    stopGameTimer();
    
    // Reinizializza gioco
    init();
}

function undoLastMove() {
    // Implementazione base - può essere espansa
    if (moveHistory.length > 0) {
        moveHistory.pop();
        moveCount = Math.max(0, moveCount - 1);
        updateMoveCount();
        updateMoveHistoryDisplay();
        alert('Funzione annulla mossa in sviluppo!');
    }
}

function showRules() {
    const rulesText = `
REGOLE DEGLI SCACCHI:

OBIETTIVO: Dare scacco matto al re avversario

MOVIMENTO DEI PEZZI:
• PEDONE: Avanza di 1 casella, prima mossa può avanzare di 2
• TORRE: Si muove orizzontalmente e verticalmente 
• ALFIERE: Si muove diagonalmente
• CAVALLO: Movimento a "L" (2+1 caselle)
• REGINA: Combina torre e alfiere
• RE: Si muove di 1 casella in qualsiasi direzione

REGOLE SPECIALI:
• Arrocco: Mossa speciale con re e torre
• En passant: Cattura speciale del pedone
• Promozione: Il pedone arriva all'ottava traversa

SCACCO: Il re è sotto attacco
SCACCO MATTO: Il re non può sfuggire all'attacco
    `;
    
    alert(rulesText);
}

// Funzioni per il timer di gioco
function startGameTimer() {
    if (!startTime) {
        startTime = new Date();
    }
    
    gameTimer = setInterval(function() {
        updateGameTime();
    }, 1000);
}

function updateGameTime() {
    if (!startTime) return;
    
    const now = new Date();
    const elapsed = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Aggiorna tutti gli elementi tempo
    const timeElements = document.querySelectorAll('[data-game-time]');
    timeElements.forEach(el => {
        el.textContent = timeString;
    });
}

function stopGameTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

// Funzioni per aggiornare l'UI
function updateMoveCount() {
    const moveElements = document.querySelectorAll('[data-move-count]');
    moveElements.forEach(el => {
        el.textContent = mosseCount;
    });
}

function updateCurrentPlayer() {
    const playerElements = document.querySelectorAll('[data-current-player]');
    const playerColorElements = document.querySelectorAll('[data-player-color]');
    const playerNameElements = document.querySelectorAll('[data-player-name]');
    
    const currentPlayer = turno ? 'Bianco' : 'Nero';
    const currentPlayerIcon = turno ? '♔' : '♚';
    
    playerElements.forEach(el => {
        el.textContent = currentPlayerIcon;
    });
    
    playerColorElements.forEach(el => {
        el.textContent = currentPlayer;
    });
    
    playerNameElements.forEach(el => {
        el.textContent = `Giocatore ${currentPlayer}`;
    });
}

function addMoveToHistory(move) {
    moveHistory.push(move);
    updateMoveHistory();
}

function updateMoveHistory() {
    const historyContainer = document.querySelector('[data-move-history]');
    if (!historyContainer) return;
    
    if (moveHistory.length === 0) {
        historyContainer.innerHTML = '<div class="text-gray-400 text-center py-6 text-sm"><p>Nessuna mossa ancora effettuata</p></div>';
        return;
    }
    
    let historyHTML = '';
    moveHistory.forEach((move, index) => {
        const moveNumber = Math.floor(index / 2) + 1;
        const isWhiteMove = index % 2 === 0;
        
        if (isWhiteMove) {
            historyHTML += `<div class="flex justify-between text-sm py-1 border-b border-gray-700 last:border-b-0">
                <span class="text-gray-400">${moveNumber}.</span>
                <span class="text-white">${move}</span>`;
        } else {
            historyHTML += `<span class="text-gray-300">${move}</span></div>`;
        }
    });
    
    historyContainer.innerHTML = historyHTML;
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

function updateCapturedPieces() {
    const whiteCapturedContainer = document.querySelector('[data-captured-white]');
    const blackCapturedContainer = document.querySelector('[data-captured-black]');
    
    if (whiteCapturedContainer) {
        whiteCapturedContainer.innerHTML = capturedPieces.white.map(piece => 
            `<img src="${piece.imgSrc}" class="w-6 h-6" title="${piece.name}">`
        ).join('');
        
        if (capturedPieces.white.length === 0) {
            whiteCapturedContainer.innerHTML = '<span class="text-gray-500 text-xs">Nessuno</span>';
        }
    }
    
    if (blackCapturedContainer) {
        blackCapturedContainer.innerHTML = capturedPieces.black.map(piece => 
            `<img src="${piece.imgSrc}" class="w-6 h-6" title="${piece.name}">`
        ).join('');
        
        if (capturedPieces.black.length === 0) {
            blackCapturedContainer.innerHTML = '<span class="text-gray-500 text-xs">Nessuno</span>';
        }
    }
}

// Funzioni per i controlli del gioco
function restartGame() {
    if (confirm('Sei sicuro di voler ricominciare la partita?')) {
        // Reset variabili
        mosseCount = 0;
        moveHistory = [];
        capturedPieces = { white: [], black: [] };
        turno = true;
        isGameActive = true;
        pedine = [];
        
        // Reset timer
        stopGameTimer();
        startTime = null;
        
        // Ricostruisci il gioco
        init();
        startGameTimer();
        
        // Aggiorna UI
        updateMoveCount();
        updateCurrentPlayer();
        updateMoveHistory();
        updateCapturedPieces();
        updateGameTime();
    }
}

function undoLastMove() {
    if (moveHistory.length === 0) {
        alert('Nessuna mossa da annullare!');
        return;
    }
    
    // Implementazione semplificata - riavvia il gioco
    alert('Funzione annulla mossa non ancora implementata completamente. Riavvia la partita per ricominciare.');
}

function surrenderGame() {
    if (confirm('Sei sicuro di voler abbandonare la partita?')) {
        isGameActive = false;
        stopGameTimer();
        
        const winner = turno ? 'Nero' : 'Bianco';
        alert(`Partita terminata! Il giocatore ${winner} vince per abbandono.`);
        
        // Disabilita la scacchiera
        const cells = document.querySelectorAll('.casella');
        cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
            cell.style.opacity = '0.5';
        });
    }
}

function showRules() {
    const rulesText = `
🏰 REGOLE DEGLI SCACCHI

🎯 OBIETTIVO: Catturare il Re avversario (Scacco Matto)

♟️ MOVIMENTO DEI PEZZI:
• Pedone: Avanza di 1 casella, cattura in diagonale
• Torre: Orizzontale e verticale
• Alfiere: Solo in diagonale
• Cavallo: A "L" (2+1 caselle)
• Regina: Come Torre + Alfiere
• Re: 1 casella in qualsiasi direzione

⚡ REGOLE SPECIALI:
• Arrocco: Re + Torre si scambiano posizione
• En passant: Cattura speciale del pedone
• Promozione: Pedone diventa Regina/Torre/Alfiere/Cavallo

🎮 COME GIOCARE:
• Trascina i pezzi per muoverli
• I bianchi giocano per primi
• Non puoi mettere il tuo Re in scacco

🏆 VITTORIA:
• Scacco Matto: Re in scacco senza vie di fuga
• Abbandono: L'avversario si arrende
    `;
    
    alert(rulesText);
}

// Setup event listeners per i pulsanti
function setupEventListeners() {
    // Pulsante Nuova Partita (header)
    const newGameBtns = document.querySelectorAll('[data-action="new-game"]');
    newGameBtns.forEach(btn => {
        btn.addEventListener('click', restartGame);
    });
    
    // Pulsante Regole (header)
    const rulesBtns = document.querySelectorAll('[data-action="rules"]');
    rulesBtns.forEach(btn => {
        btn.addEventListener('click', showRules);
    });
    
    // Pulsanti controlli gioco
    const restartBtns = document.querySelectorAll('[data-action="restart"]');
    restartBtns.forEach(btn => {
        btn.addEventListener('click', restartGame);
    });
    
    const undoBtns = document.querySelectorAll('[data-action="undo"]');
    undoBtns.forEach(btn => {
        btn.addEventListener('click', undoLastMove);
    });
    
    const surrenderBtns = document.querySelectorAll('[data-action="surrender"]');
    surrenderBtns.forEach(btn => {
        btn.addEventListener('click', surrenderGame);
    });
}

// Funzione per convertire coordinate in notazione scacchistica
function getChessNotation(x, y) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return files[x - 1] + y;
}

// Funzione per ottenere il nome del pezzo
function getPieceName(pedina) {
    const pieceNames = {
        'PedoneBianco': '♙', 'PedoneNero': '♟',
        'TorreBianca': '♖', 'TorreNera': '♜',
        'CavalloBianco': '♘', 'CavalloNero': '♞',
        'AlfiereBianco': '♗', 'AlfiereNero': '♝',
        'ReginaBianca': '♕', 'ReginaNera': '♛',
        'ReBianco': '♔', 'ReNero': '♚'
    };
    
    const pieceType = pedina.constructor.name;
    const color = pedina.color;
    
    if (pieceType === 'PedoneBianco') return '♙';
    if (pieceType === 'PedoneNero') return '♟';
    if (pieceType === 'Torre') return color === 'bianco' ? '♖' : '♜';
    if (pieceType === 'Cavallo') return color === 'bianco' ? '♘' : '♞';
    if (pieceType === 'Alfiere') return color === 'bianco' ? '♗' : '♝';
    if (pieceType === 'Regina') return color === 'bianco' ? '♕' : '♛';
    if (pieceType === 'Re') return color === 'bianco' ? '♔' : '♚';
    
    return '?';
}