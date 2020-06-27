class User {
  constructor(googleId, name, createdDate) {
    this.googleId = googleId;
    this.name = name;
    this.createdDate = createdDate;
    this.wins = 0;
    this.ties = 0;
    this.losses = 0;
    this.token = "";
  }
}

//method for User entity data access

module.exports = { User };
