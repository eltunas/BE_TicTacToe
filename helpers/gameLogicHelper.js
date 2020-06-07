function gameWon(board, moveToken){
    return rowComplete(board, moveToken) || columnComplete(board, moveToken) || diagonalComplete(board, moveToken);
}

function rowComplete(board, moveToken){
    return ((board[0] == moveToken && board[1] == moveToken && board[2] == moveToken) ||
    (board[3] == moveToken && board[4] == moveToken && board[5] == moveToken) ||
    (board[6] == moveToken && board[7] == moveToken && board[8] == moveToken))
}

function columnComplete(board, moveToken){
    return ((board[0] == moveToken && board[3] == moveToken && board[6] == moveToken) ||
    (board[1] == moveToken && board[4] == moveToken && board[7] == moveToken) ||
    (board[2] == moveToken && board[5] == moveToken && board[8] == moveToken))
}

function diagonalComplete(board, moveToken){
    return ((board[0] == moveToken && board[4] == moveToken && board[8] == moveToken) ||
            (board[2] == moveToken && board[4] == moveToken && board[6] == moveToken))
}

module.exports = {gameWon};