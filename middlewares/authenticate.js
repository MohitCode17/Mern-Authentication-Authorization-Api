import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


const authenticate = async (req, res, next) => {

    try {
        const token = req.headers.authorization;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const validUser = await userModel.findOne({_id: verifyToken._id});
        
        if(!validUser) throw new Error("User not found");

        req.token = token;
        req.validUser = validUser;
        req.userId = validUser._id;

        next();

    } catch (error) {
        res.status(401).json({status: 401, msg: "Unauthorized User no token provided"})
    }   

}

export default authenticate;