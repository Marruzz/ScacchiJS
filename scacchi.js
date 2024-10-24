const alphabet = 'abcdefghijklmnopqrstuvwxyz';

let turno =true;

let pedine = [];



function init(){
    inizializzaScacchiera();
    generateBoard();

    posizionaPedine();

    
}


function inizializzaScacchiera(){

    for(let i=0;i<8;i++){
        scacchiera[i]=[]
        for(let j=0;j<8;j++){
            scacchiera[i][j]=null;
        }
    }
}

function generateBoard(){

    let tableScacchiera = document.getElementById("scacchiera");
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
                td.id= "cella"+riga+""+colonna;
                
                td.addEventListener('dragover', allowDrop);
                td.addEventListener('drop', drop);
                scacchiera[riga-1][colonna-1] = td;
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
    let img = document.createElement("img");
    img.src = imgSrc;
    img.classList.add("pedina");
    img.draggable = true;
    img.addEventListener('dragstart', drag);
    img.id = tipo + posizione.x + posizione.y;
    img.addEventListener('dragover', allowDrop);
    img.addEventListener('drop', drop);

    let cella = document.getElementById("cella" + posizione.x + posizione.y);
    cella.appendChild(img);

    let pedina = null;
    switch (tipo) {
        case 'PedoneBianco':
            pedina = new PedoneBianco(img, posizione);
            break;
        case 'PedoneNero':
            pedina = new PedoneNero(img, posizione);
            break;
        case 'TorreBianca':
            pedina = new Torre(img, posizione, color);
            break;
        case 'TorreNera':
            pedina = new Torre(img, posizione, color);
            break;
        case 'CavalloBianco':
            pedina = new Cavallo(img, posizione, color);
            break;
        case 'CavalloNero':
            pedina = new Cavallo(img, posizione, color);
            break;
        case 'AlfiereBianco':
            pedina = new Alfiere(img, posizione, color);
            break;
        case 'AlfiereNero':
            pedina = new Alfiere(img, posizione, color);
            break;
        case 'ReginaBianca':
            pedina = new Regina(img, posizione, color);
            break;
        case 'ReginaNera':
            pedina = new Regina(img, posizione, color);
            break;
        case 'ReBianco':
            pedina = new Re(img, posizione, color);
            break;
        case 'ReNero':
            pedina = new Re(img, posizione, color);
            break;
    }

    pedine.push(pedina);
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

        nuovaPosizione={x:riga, y:colonna};

        if (pedina.checkMove(nuovaPosizione)&&checkOccupato(nuovaPosizione)){
            let cella = document.getElementById(target.id);
            cella.appendChild(pedina.oggetto);
        
            // Aggiorna la posizione della pedina nell'array delle pedine
        
            pedina.posizione.x=riga;
            pedina.posizione.y=colonna;
            turno=!turno;
        }else if(pedina.checkMove(nuovaPosizione)&&!checkOccupato(nuovaPosizione)){

            pieceAtPos=getPieceAtPosition(nuovaPosizione);

            if(pieceAtPos.color!=pedina.color){
        
                let index = pedine.indexOf(pieceAtPos);
                if (index !== -1) {
                    pedine.splice(index, 1);
                }

                let cella = document.getElementById(target.id);
                cella.innerHTML="";
                cella.appendChild(pedina.oggetto);

                console.log("Mangiato");


            
                pedina.posizione.x=riga;
                pedina.posizione.y=colonna;
                turno=!turno;
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