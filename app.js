const gameBoard = document.querySelector("#gameboard")
const payerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")

const width = 8

const startPieces = [

rook, knight, bishop, queen, king, bishop, knight, rook, 
pawn,pawn, pawn, pawn, pawn, pawn,pawn, pawn, 
, '', '', '', '', '', '', '', '',
, '', '', '', '', '', '', '', '',
, '', '', '', '', '', '', '', '',
, '', '', '', '', '', '', '', '',
pawn,pawn, pawn, pawn, pawn, pawn,pawn, pawn, 
rook, knight, bishop, queen, king, bishop, knight, rook, 


]


function createBoard(){
    startPieces.forEach((startPiece) =>
        {
            const square = document.createElement('div')
            square.classList.add('square')
            square.classList.add('beige')
            gameBoard.append(square)
        }
    )
}

createBoard()