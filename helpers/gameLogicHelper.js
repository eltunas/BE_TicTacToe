// function gameWon(board, moveToken){
//     return rowComplete(board, moveToken) || columnComplete(board, moveToken) || diagonalComplete(board, moveToken);
// }

// function rowComplete(board, moveToken){
//     return ((board[0] == moveToken && board[1] == moveToken && board[2] == moveToken) ||
//     (board[3] == moveToken && board[4] == moveToken && board[5] == moveToken) ||
//     (board[6] == moveToken && board[7] == moveToken && board[8] == moveToken))
// }

// function columnComplete(board, moveToken){
//     return ((board[0] == moveToken && board[3] == moveToken && board[6] == moveToken) ||
//     (board[1] == moveToken && board[4] == moveToken && board[7] == moveToken) ||
//     (board[2] == moveToken && board[5] == moveToken && board[8] == moveToken))
// }

// function diagonalComplete(board, moveToken){
//     return ((board[0] == moveToken && board[4] == moveToken && board[8] == moveToken) ||
//             (board[2] == moveToken && board[4] == moveToken && board[6] == moveToken))
// }
const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const gameWon = board => {
  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
};

module.exports = { gameWon };
