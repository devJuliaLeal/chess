const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")

const width = 8
let playerGo = 'white'
playerDisplay.textContent = 'white'

const startPieces = [

rook, knight, bishop, queen, king, bishop, knight, rook, 
pawn,pawn, pawn, pawn, pawn, pawn,pawn, pawn, 
 '', '', '', '', '', '', '', '',
 '', '', '', '', '', '', '', '',
 '', '', '', '', '', '', '', '',
 '', '', '', '', '', '', '', '',
pawn,pawn, pawn, pawn, pawn, pawn,pawn, pawn, 
rook, knight, bishop, queen, king, bishop, knight, rook, 


]


function createBoard(){
    startPieces.forEach((startPiece, i ) =>
        {
            const square = document.createElement('div')
            square.classList.add('square')
            square.innerHTML = startPiece 
           square.firstChild?.setAttribute('draggable', 'true')
            

            square.setAttribute('square-id', i)
           
           const row = Math.floor((63-i)/8)+1 
                if(row %2 == 0){
                    square.classList.add(i % 2 === 0? "red":"blue")
                }
                else{ square.classList.add(i % 2 === 0 ? "blue":"red")}
               
                if (i >= 48) {
                    const svgElement = square.querySelector('svg'); 
                    if (svgElement) {
                        svgElement.classList.add('white');
                    }
                }
                if (i <= 15) {
                    const svgElement = square.querySelector('svg'); 
                    if (svgElement) {
                        svgElement.classList.add('black');
                    }
                }

            gameBoard.append(square)
        }
           



    )
}

createBoard()

const allsquares = document.querySelectorAll(".square")

allsquares.forEach(square=>{

square.addEventListener('dragstart', dragStart)
square.addEventListener('dragover', dragOver)
square.addEventListener('drop', dragDrop)
})

let startPositionId 
let draggedElement

function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver(e){
    e.preventDefault()

}

function dragDrop(e) {
    e.stopPropagation();

    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const opponentGo = playerGo === 'black' ? 'white' : 'black';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

    if (correctGo) {
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            changePlayer();
            return;
        }
        if (taken) {
            infoDisplay.textContent = "Movimento inválido";
            setTimeout(() => infoDisplay.textContent = "", 2000);
            return;
        }
        if (valid) {
            e.target.append(draggedElement);
            changePlayer();
            return;
        }
    }
}



  
  function checkIfValid(target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;
    const rowDiff = Math.floor(targetId / width) - Math.floor(startId / width);
    const colDiff = targetId % width - startId % width;
    const opponentGo = playerGo === 'black' ? 'white' : 'black';
  

    switch (piece) {
//=================================================PEAO============================================================ 
case 'pawn':
    const starterRow = [48, 49, 50, 51, 52, 53, 54, 55]; // Rows where pawns start at the bottom
    if (
        starterRow.includes(startId) && startId - width * 2 === targetId ||
        (startId - width === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild) ||
        (startId - width - 1 === targetId && document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild) ||
        (startId - width + 1 === targetId && document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild)
    ) {
        return true;
    }
    break;
 
//===============================================CAVALO========================================================================                   
        case 'knight': 
        if(
            startId+ width *2 + 1 === targetId ||
            startId+ width *2 - 1 === targetId ||

            startId+ width -2 === targetId ||
            startId+ width +2 === targetId ||

            startId- width *2 + 1 === targetId ||
            startId- width *2 - 1 === targetId ||

            startId - width -2 === targetId ||
            startId -width +2 === targetId 
        ) {
            return true
        }
      break;

 //===============================================BISPO========================================================================             
      case 'bishop':

        if (Math.abs(rowDiff) === Math.abs(colDiff)) {
            const rowDirection = rowDiff > 0 ? 1 : -1;
            const colDirection = colDiff > 0 ? 1 : -1;
            let currentRow = Math.floor(startId / width) + rowDirection;
            let currentCol = startId % width + colDirection;

            while (currentRow !== Math.floor(targetId / width)) {
                const cell = document.querySelector(`[square-id="${currentRow * width + currentCol}"]`);
                if (cell.firstChild) {
                    return false 
                }
                currentRow += rowDirection;
                currentCol += colDirection;
            }

            return true
        }
        break;
//=============================================TORRE=========================================================================
        case 'rook':

    if ((rowDiff === 0 && colDiff !== 0) || (colDiff === 0 && rowDiff !== 0)) {
        const step = rowDiff !== 0 ? (rowDiff > 0 ? width : -width) : (colDiff > 0 ? 1 : -1);
        let currentId = startId + step;

        while (currentId !== targetId) {
            const cell = document.querySelector(`[square-id="${currentId}"]`);
            if (cell.firstChild) {
                return false; 
            }
            currentId += step;
        }

        return true; 
    }
    break;
//=============================================RAINHA=========================================================================
case 'queen':
    if (
        // Movimento da torre (horizontal e vertical)
        ((rowDiff === 0 && colDiff !== 0) || (colDiff === 0 && rowDiff !== 0)) ||
        // Movimento do bispo (diagonais)
        (Math.abs(rowDiff) === Math.abs(colDiff))
    ) {
        const rowDirection = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1);
        const colDirection = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1);
        
        let currentRow = Math.floor(startId / width) + rowDirection;
        let currentCol = startId % width + colDirection;

        while (currentRow !== Math.floor(targetId / width) || currentCol !== targetId % width) {
            const cell = document.querySelector(`[square-id="${currentRow * width + currentCol}"]`);
            if (cell.firstChild) {
                return false; 
            }
            
            currentRow += rowDirection;
            currentCol += colDirection;
        }

        return true; 
    }
    break;
//=============================================REI========================================================================
case 'king':
    const isKingMoved = false; 
    if (
        startId + 1 === targetId ||
        startId - 1 === targetId ||
        startId + width === targetId ||
        startId - width === targetId ||
        startId + width + 1 === targetId ||
        startId + width - 1 === targetId ||
        startId - width - 1 === targetId ||
        startId - width + 1 === targetId
    ) {
        return true;
    }
    
    
    const kingRow = Math.floor(startId / width);
    const targetRow = Math.floor(targetId / width);
    const kingCol = startId % width;
    const targetCol = targetId % width;

    
    if (!isKingMoved && targetCol === kingCol + 2 && kingRow === targetRow) {
        
        if (
            !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
            !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
        ) {
            
            const rookSquare = document.querySelector(`[square-id="${startId + 3}"]`);
            const rookPiece = rookSquare.firstChild;
            rookSquare.removeChild(rookPiece);
            const targetRookSquare = document.querySelector(`[square-id="${startId + 1}"]`);
            targetRookSquare.appendChild(rookPiece);

            return true; 
        }
    }

   
    if (!isKingMoved && targetCol === kingCol - 2 && kingRow === targetRow) {
       
        if (
            !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
            !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
            !document.querySelector(`[square-id="${startId - 3}"]`).firstChild
        ) {
           
            const rookSquare = document.querySelector(`[square-id="${startId - 4}"]`);
            const rookPiece = rookSquare.firstChild;
            rookSquare.removeChild(rookPiece);
            const targetRookSquare = document.querySelector(`[square-id="${startId - 1}"]`);
            targetRookSquare.appendChild(rookPiece);

            return true; 
        }
    }
    break;

  }
  }
 function changePlayer(){
    if (playerGo === "white"){
        reverseIds()
        playerGo = "black"
        playerDisplay.textContent = 'black'
    }
    else{
        revertIds()
        playerGo = "white"
        playerDisplay.textContent = 'white'
    }
 } 

 function changePlayer(){
    if (playerGo === "white"){
        reverseIds()
        playerGo = "black"
        playerDisplay.textContent = 'black'
    }
    else{
        revertIds()
        playerGo = "white"
        playerDisplay.textContent = 'white'
    }
 } 

 function reverseIds(){
const allSquares =  document.querySelectorAll(".square")

allsquares.forEach((square, i)=> 

    square.setAttribute('square-id', (width*width -1)-i))

 }

 function revertIds(){
    const allSquares =  document.querySelectorAll(".square")
    allsquares.forEach((square, i)=> square.setAttribute('square-id', i))
 }