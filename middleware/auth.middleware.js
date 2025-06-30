import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
    try {
        let token;

        //Check if token exists
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
        }

        //If no token reject
        if(!token) return res.status(401).json({ message: "Unauthorized" })
        
        //If we get token, verify the token
        const decoded = jwt.verify(token, JWT_SECRET)

        //Find user that matches token
        const user = await User.findById(decoded.userId)

        //If none, reject
        if(!user) return res.status(401).json({ message: "Unauthorized" })
        
        //If a user matches, attach user to the request made
        req.user = user

        next()

    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message })
    }
}

export default authorize