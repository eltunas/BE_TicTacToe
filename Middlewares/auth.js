const dataUsers = require("../data_access/users");

verifyToken = async (req, res, next) => {
    console.log(req.headers);
    
    let token = req.headers["authorization"].toString().replace('Bearer ','');
    let user = await dataUsers.getUserByToken(token);
    if(user){
        console.log("valid user");
        console.log(user);
        next();
    }else{
        return res.status(401).send({ message: "Unauthorized!" });
    }   
}

module.exports = {verifyToken}