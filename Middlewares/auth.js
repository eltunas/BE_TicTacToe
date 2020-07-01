const dataUsers = require("../data_access/users");

verifyToken = async (req, res, next) => {
  let authHeater = req.headers["authorization"];
  let token;
  if (authHeater) {
    token = authHeater.toString().replace("Bearer ", "");
  } else {
    return res.status(401).json({ message: "Unauthorized!" });
  }
  let user = await dataUsers.getUserByToken(token);
  if (user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

module.exports = { verifyToken };
