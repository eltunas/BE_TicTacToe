var express = require("express");
var router = express.Router();
const auth = require("../Middlewares/auth");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
