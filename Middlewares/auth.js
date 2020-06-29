const dataUsers = require("../data_access/users");

verifyToken = async (req, res, next) => {
  console.log(req.headers);

  let authHeater = req.headers["authorization"];
  let token;
  if (authHeater) {
    console.log(authHeater);
    token = authHeater.toString().replace("Bearer ", "");
  } else {
    return res.status(401).json({ message: "Unauthorized!" });
  }
  let user = await dataUsers.getUserByToken(token);
  if (user) {
    console.log("valid user");
    console.log(user);
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

module.exports = { verifyToken };
