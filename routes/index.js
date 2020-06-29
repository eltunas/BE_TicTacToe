var express = require("express");
var router = express.Router();
const auth = require("../Middlewares/auth");

//router.use(async(req, res, next) => await auth.verifyToken(req, res, next));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
