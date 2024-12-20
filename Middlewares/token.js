const register=require("../Models/RegisterSchema")
const jwt = require("jsonwebtoken"); 

const generateToken = (_id) => {
    let token = jwt.sign({ id:_id }, "uhsdvhhzkjkhksahkkuask", { expiresIn: "24h" });
    console.log("Generated Token:", token);
    return token;
};

const verify = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(404).json({ Message: "User has to login first" });
    }

    let ModifiedToken = token.split(" ")[1];
    console.log("Received Token:", ModifiedToken);

    try {
        let payload = jwt.verify(ModifiedToken, "uhsdvhhzkjkhksahkkuask");
        console.log("Payload ID:", payload.id);

        userId = payload.id;

        console.log(userId);
        

        let checkUser = await register.findOne({_id:payload.id});
        console.log(checkUser);
        

        if(!checkUser)
        {
            return res.status(404).json({Message:"User not found"})
        }
        next()
        
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { generateToken, verify };