import { Router } from "express";
import AuthController from "../controllers/AuthController";
import authenticate from "../middlewares/authenticate";

export default (router: Router) => {
    router.post("/register", AuthController.register);
    router.get("/login", AuthController.login);
    router.get("/logout", authenticate, AuthController.logout);
};