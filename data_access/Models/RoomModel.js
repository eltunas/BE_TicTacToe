//prettier-ignore
class Room {
    constructor(roomId, player1, player2) {  
        this.id = roomId.toString(),
        this.boardState= Array(9).fill(null);
        this.nextToMove = "X".toString(),
        this.player1Id = player1.id.toString(),
        this.player2Id = player2.id.toString(),
        this.moves = 0;
    }
}

//method for User entity data access

module.exports = { Room };
