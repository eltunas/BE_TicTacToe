const dataUsers = require("../data_access/users");

async function getUser(req, res, next) {
  let user;
  try {
    user = await dataUsers.getUser(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = { getUser };