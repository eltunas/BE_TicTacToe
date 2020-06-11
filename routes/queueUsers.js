const express = require("express");
const router = express.Router();
const queueUsers = require("../data_access/queueUsers");
const queueUserModel = require("../data_access/Models/queueUserModel")

router.get("/", async (req, res) => {
    try {
        const users = await queueUsers.getQueueUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.post("/", async (req, res) => {
    let user;
    if (req.body.googleId == null || req.body.name == null || req.body.socket == null) {
        return res.status(400).json({ message: "Parametros incorrectos" })
    } else {
        user = new queueUserModel.Queue(req.body.googleId, req.body.name, req.body.socket)
    }
    try {
        const newUser = await queueUsers.insertQueueUser(user);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});


module.exports = router;