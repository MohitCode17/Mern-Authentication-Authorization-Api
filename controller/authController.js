import User from "../models/userModel.js";
import bcrypt from "bcryptjs";



/* REGISTER USER CONTROLLER */

export const registerUser = async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    // EVERY FIELD SHOULD BE REQUIRED
    if( !name || !email || !password || !cpassword ){
        return res.status(422).json({error: "All fields are required !"});
    };

    try {
        // CHECK IF USER IS REGISTERED OR NOT
        const preUser = await User.findOne({ email: email });

        if(preUser){
            res.status(422).json({error: "Email is already exist"});
        }else if( password !== cpassword ){
            res.status(422).json({error: "Password does not match"});
        }else{
            const user = new User({
                name, email, password, cpassword
            });
            await user.save();
            res.status(201).json({ status: 201 ,user});
        }
    } catch (error) {
        res.status(409).json({error: error.message});
    }
}

// LOGIN USER || POST API

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check All Fields are required to fill
    if( !email || !password ) {
        return res.status(422).json({error : "All fields are required !"});
    }

    try {
        // Check if user is valid 
        const isUserValid = await User.findOne({email: email});

        if(isUserValid){
            // Check password is matched
            const isPasswordValid = await bcrypt.compare( password, isUserValid.password );

            if(!isPasswordValid){
                res.status(422).json({error: "Invalid Details"});
            }else{
                // Generate Token if password matched - User File
                const token = await isUserValid.generateAuthToken();

                // Generate Cookie to Revalidate user after logout
                res.cookie("authCookie", token, {
                    expires: new Date(Date.now()+9000000),  // expire time 15mins
                    httpOnly: false
                })

                const result = {
                    isUserValid,
                    token
                }
                res.status(201).json({status: 201, result});
            }
        }
    } catch (error) {
        res.status(401).json({error: error.message})
    }
};


// VALID USER CONTROLLER
export const validUser = async (req, res) => {
    // console.log(req.validUser);
    try {
        const validUser = await User.findOne({_id: req.userId});
        res.status(200).json({status: 200, validUser});
    } catch (error) {
        res.status(401).json({status: 401, error: error.message})
    }
}

// LOGOUT USER CONTROLLER
export const logoutUser = async (req, res) => {
    try {
        req.validUser.tokens = req.validUser.tokens.filter((currItem) => {
            return currItem.token !== req.token
        });
        res.clearCookie("authCookie", {
            path: "/"
        });

        req.validUser.save();
        res.status(200).json({status: 200});

    } catch (error) {
        res.status(401).json({error: error.message})
    }
}