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

// Variabili per l'esperienza visiva migliorata
let selectedPiece = null;
let highlightedMoves = [];

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
    
    // Configura subito gli event listeners
    setupEventListeners();
    
    // Inizializza UI e timer
    setTimeout(() => {
        startGameTimer();
        updateCurrentPlayer();
        // Richiama setupEventListeners nel caso alcuni elementi non fossero pronti prima
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
    
    // Genera scacchiera senza coordinate esterne
    let count = 0;
    let colonna = 8;
    for(let i = 0; i < 8; i++){
        let tr = creaRiga(tableScacchiera);
        tr.id = i;
        let riga = 1;
        for(let j = 0; j < 8; j++){
            let td;
            if(count % 2 == 1){
                td = creaCasella(tr, "bianca");
            } else {
                td = creaCasella(tr, "nera");
            }
            td.riga = riga;
            td.colonna = colonna;
            td.id = "cella" + riga + "" + colonna + "_" + tableId;
            td.classList.add(tableId); // Aggiungi classe per identificare la scacchiera
            td.addEventListener('dragover', allowDrop);
            td.addEventListener('drop', drop);
            
            // Aggiungi click handler per pulire le evidenziazioni
            td.addEventListener('click', function(e) {
                if (e.target === this && !this.querySelector('.pedina')) {
                    clearHighlights();
                }
            });
            
            currentBoard[riga-1][colonna-1] = td;
            
            // Sincronizza con scacchiera principale se necessario
            if (scacchiera.length === 0) {
                scacchiera = scacchieraDesktop.length > 0 ? scacchieraDesktop : scacchieraMobile;
            }
            
            riga++;
            count++;
        }
        colonna--;
        count++;
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
        addPieceClickHandler(pedina);
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
    
    // Pulisci sempre le evidenziazioni
    clearHighlights();
    
    let data = event.dataTransfer.getData("id");
    let target = event.target;
    if (target.tagName.toLowerCase() === 'img') {
        target = target.parentNode;
    }
    let pedinaOggetto = document.getElementById(data);
    let pedina = getPedinaByReference(pedinaOggetto);
    console.log((turno==true&&pedina.color=="bianco")||(turno==false&&pedina.color=="nero"));
    
    if((turno==true&&pedina.color=="bianco")||(turno==false&&pedina.color=="nero")){        let riga = target.riga;
        let colonna = target.colonna;
        let oldPosition = {x: pedina.posizione.x, y: pedina.posizione.y};
        let nuovaPosizione = {x:riga, y:colonna};

        // Verifica se la mossa è valida secondo le regole del pezzo
        if (pedina.checkMove(nuovaPosizione)) {
            const isTargetOccupied = !checkOccupato(nuovaPosizione);
            
            if (!isTargetOccupied) {
                // Mossa normale (casella libera)
                let cella = document.getElementById(target.id);
                let cellaMobile = target.id.includes('Desktop') ? 
                    document.getElementById(target.id.replace('Desktop', 'Mobile')) : 
                    document.getElementById(target.id.replace('Mobile', 'Desktop'));
                
                // Animazione di movimento
                pedina.oggetto.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                cella.appendChild(pedina.oggetto);
                if (cellaMobile && pedina.imgMobile) {
                    cellaMobile.appendChild(pedina.imgMobile);
                }
                  pedina.posizione.x=riga;
                pedina.posizione.y=colonna;
                
                // Reset firstMove per i pedoni dopo la prima mossa
                if ((pedina.constructor.name === 'PedoneBianco' || pedina.constructor.name === 'PedoneNero') && pedina.firstMove) {
                    pedina.firstMove = false;
                }
                
                  // Traccia la mossa
                const moveNotation = getPieceName(pedina) + getChessNotation(oldPosition.x, oldPosition.y) + '-' + getChessNotation(riga, colonna);
                addMoveToHistory(moveNotation);
                moveCount++;
                
                turno=!turno;
                updateCurrentPlayer();
                updateMoveCount();
                
                // Reset transizione
                setTimeout(() => {
                    pedina.oggetto.style.transition = '';
                }, 300);
                
            } else {
                // Casella occupata - verifica se è una cattura valida
                const pieceAtPos = getPieceAtPosition(nuovaPosizione);                if (pieceAtPos && pieceAtPos.color != pedina.color) {
                    // Cattura pezzo con effetto visivo
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
                        
                        // Effetto di cattura
                        const capturedImg = pieceAtPos.oggetto;
                        capturedImg.style.transition = 'all 0.5s ease-out';
                        capturedImg.style.transform = 'scale(0.8) rotate(15deg)';
                        capturedImg.style.opacity = '0.5';
                        
                        setTimeout(() => {
                            pedine.splice(index, 1);
                        }, 250);
                    }

                    let cella = document.getElementById(target.id);
                    let cellaMobile = target.id.includes('Desktop') ? 
                        document.getElementById(target.id.replace('Desktop', 'Mobile')) : 
                        document.getElementById(target.id.replace('Mobile', 'Desktop'));
                    
                    // Animazione di cattura
                    pedina.oggetto.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    
                    setTimeout(() => {
                        cella.innerHTML="";
                        cella.appendChild(pedina.oggetto);
                        if (cellaMobile && pedina.imgMobile) {
                            cellaMobile.innerHTML="";
                            cellaMobile.appendChild(pedina.imgMobile);
                        }
                    }, 150);
                    
                    console.log("Mangiato");
                      // Traccia la mossa con cattura
                    const moveNotation = getPieceName(pedina) + getChessNotation(oldPosition.x, oldPosition.y) + 'x' + getChessNotation(riga, colonna);
                    addMoveToHistory(moveNotation);
                    moveCount++;
                      pedina.posizione.x=riga;
                    pedina.posizione.y=colonna;
                    
                    // Reset firstMove per i pedoni dopo la prima mossa
                    if ((pedina.constructor.name === 'PedoneBianco' || pedina.constructor.name === 'PedoneNero') && pedina.firstMove) {
                        pedina.firstMove = false;
                    }
                    
                    turno=!turno;
                    
                    updateCurrentPlayer();
                    updateMoveCount();
                    updateCapturedPieces();
                      // Reset transizione
                    setTimeout(() => {
                        pedina.oggetto.style.transition = '';
                    }, 300);
                }
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

// ========== FUNZIONI PER L'ESPERIENZA VISIVA MIGLIORATA ==========

function highlightValidMoves(pedina) {
    clearHighlights();
    selectedPiece = pedina;
    
    // Evidenzia la casella selezionata
    const currentCell = document.getElementById(`cella${pedina.posizione.x}${pedina.posizione.y}_scacchieraDesktop`);
    const currentCellMobile = document.getElementById(`cella${pedina.posizione.x}${pedina.posizione.y}_scacchieraMobile`);
    
    if (currentCell) {
        currentCell.classList.add('selected');
    }
    if (currentCellMobile) {
        currentCellMobile.classList.add('selected');
    }
    
    // Trova e evidenzia tutte le mosse valide
    for (let x = 1; x <= 8; x++) {
        for (let y = 1; y <= 8; y++) {
            const targetPosition = {x: x, y: y};
            
            if (pedina.checkMove(targetPosition)) {
                const isOccupied = !checkOccupato(targetPosition);
                const pieceAtPosition = isOccupied ? getPieceAtPosition(targetPosition) : null;
                
                // Verifica se la mossa è valida (casella libera o cattura nemica)
                if (!isOccupied || (isOccupied && pieceAtPosition && pieceAtPosition.color !== pedina.color)) {
                    const cellDesktop = document.getElementById(`cella${x}${y}_scacchieraDesktop`);
                    const cellMobile = document.getElementById(`cella${x}${y}_scacchieraMobile`);
                    
                    const isCapture = isOccupied && pieceAtPosition && pieceAtPosition.color !== pedina.color;
                    const moveClass = isCapture ? 'capture-move' : 'valid-move';
                    
                    if (cellDesktop) {
                        cellDesktop.classList.add(moveClass);
                        highlightedMoves.push(cellDesktop);
                    }
                    if (cellMobile) {
                        cellMobile.classList.add(moveClass);
                        highlightedMoves.push(cellMobile);
                    }
                }
            }
        }
    }
}

function clearHighlights() {
    // Rimuovi evidenziazione dalla casella selezionata
    if (selectedPiece) {
        const currentCell = document.getElementById(`cella${selectedPiece.posizione.x}${selectedPiece.posizione.y}_scacchieraDesktop`);
        const currentCellMobile = document.getElementById(`cella${selectedPiece.posizione.x}${selectedPiece.posizione.y}_scacchieraMobile`);
        
        if (currentCell) {
            currentCell.classList.remove('selected');
        }
        if (currentCellMobile) {
            currentCellMobile.classList.remove('selected');
        }
    }
    
    // Rimuovi evidenziazione dalle mosse valide
    highlightedMoves.forEach(cell => {
        cell.classList.remove('valid-move', 'capture-move');
    });
    highlightedMoves = [];
    selectedPiece = null;
}

function addPieceClickHandler(pedina) {
    // Aggiungi click handler per evidenziare le mosse
    pedina.oggetto.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (!isGameActive) return;
        
        // Verifica che sia il turno del giocatore giusto
        const isCorrectTurn = (turno && pedina.color === 'bianco') || (!turno && pedina.color === 'nero');
        
        if (isCorrectTurn) {
            if (selectedPiece === pedina) {
                clearHighlights();
            } else {
                highlightValidMoves(pedina);
            }
        }
    });
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
    console.log("Configurazione event listeners...");
    
    // Event listeners per tutti i pulsanti
    const newGameButtons = document.querySelectorAll('[data-action="new-game"]');
    console.log("Pulsanti new-game trovati:", newGameButtons.length);
    newGameButtons.forEach(btn => {
        btn.addEventListener('click', restartGame);
    });
    
    const restartButtons = document.querySelectorAll('[data-action="restart"]');
    console.log("Pulsanti restart trovati:", restartButtons.length);
    restartButtons.forEach(btn => {
        btn.addEventListener('click', restartGame);
    });
    
    const undoButtons = document.querySelectorAll('[data-action="undo"]');
    console.log("Pulsanti undo trovati:", undoButtons.length);
    undoButtons.forEach(btn => {
        btn.addEventListener('click', undoLastMove);
    });
    
    const rulesButtons = document.querySelectorAll('[data-action="rules"]');
    console.log("Pulsanti rules trovati:", rulesButtons.length);
    rulesButtons.forEach(btn => {
        btn.addEventListener('click', showRules);
    });
    
    const surrenderButtons = document.querySelectorAll('[data-action="surrender"]');
    console.log("Pulsanti surrender trovati:", surrenderButtons.length);
    surrenderButtons.forEach(btn => {
        btn.addEventListener('click', surrenderGame);
    });
    
    console.log("Event listeners configurati!");
}

function undoLastMove() {
    console.log("Funzione undoLastMove chiamata!");
    if (moveHistory.length === 0) {
        alert('Nessuna mossa da annullare!');
        return;
    }
    alert('Funzione annulla mossa non ancora implementata completamente. Riavvia la partita per ricominciare.');
}

function surrenderGame() {
    console.log("Funzione surrenderGame chiamata!");
    if (confirm('Sei sicuro di voler abbandonare la partita?')) {
        console.log("Utente ha confermato l'abbandono");
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
    const rulesText = `🏰 REGOLE DEGLI SCACCHI

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
• Clicca su un pezzo per vedere le mosse possibili
• Trascina i pezzi per muoverli
• I bianchi giocano per primi

🏆 VITTORIA:
• Scacco Matto: Re in scacco senza vie di fuga
• Abbandono: L'avversario si arrende`;
    
    alert(rulesText);
}

function startNewGame() {
    // Reset variabili
    moveCount = 0;
    turno = true;
    moveHistory = [];
    capturedPieces = { white: [], black: [] };
    pedine = [];
    isGameActive = true;
    
    // Pulisci evidenziazioni
    clearHighlights();
    
    // Stop timer esistente
    stopGameTimer();
    
    // Reinizializza gioco
    init();
}

function restartGame() {
    console.log("Funzione restartGame chiamata!");
    if (confirm('Sei sicuro di voler ricominciare la partita?')) {
        console.log("Utente ha confermato il restart");
        startNewGame();
    }
}

// Funzioni unificate per l'UI
function updateMoveCount() {
    const moveElements = document.querySelectorAll('[data-move-count]');
    moveElements.forEach(el => el.textContent = moveCount.toString());
}

function updateCurrentPlayer() {
    const playerSymbol = turno ? '♔' : '♚';
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

function addMoveToHistory(move) {
    moveHistory.push(move);
    updateMoveHistoryDisplay();
}

function updateMoveHistoryDisplay() {
    const historyContainer = document.querySelector('.max-h-48.overflow-y-auto');
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
        if (capturedPieces.white.length === 0) {
            whiteCapturedContainer.innerHTML = '<span class="text-gray-500 text-xs">Nessuno</span>';
        } else {
            whiteCapturedContainer.innerHTML = capturedPieces.white.map(piece => 
                `<img src="${piece.imgSrc}" class="w-6 h-6" title="${piece.name}">`
            ).join('');
        }
    }
    
    if (blackCapturedContainer) {
        if (capturedPieces.black.length === 0) {
            blackCapturedContainer.innerHTML = '<span class="text-gray-500 text-xs">Nessuno</span>';
        } else {
            blackCapturedContainer.innerHTML = capturedPieces.black.map(piece => 
                `<img src="${piece.imgSrc}" class="w-6 h-6" title="${piece.name}">`
            ).join('');
        }
    }
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