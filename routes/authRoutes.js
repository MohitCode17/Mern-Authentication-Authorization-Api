import express from "express";
import { loginUser, logoutUser, registerUser, validUser } from "../controller/authController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// REGISTER ROUTE
router.post("/register", registerUser);

// LOGIN ROUTE
router.post("/login", loginUser);

// VALID USER ROUTE
router.get("/validUser", authenticate ,validUser);

// LOGOUT ROUTER
router.get("/logout", authenticate, logoutUser);

export default router;