//prettier-ignore
class Room {
    constructor(roomId, player1, player2) {  
        this.id = roomId,
        this.boardState= Array(9).fill(null);
        this.nextToMove = "X",
        this.player1Id = player1.id,
        this.player2Id = player2.id
        this.moves = 0;
    }
}

//method for User entity data access

module.exports = { Room };
