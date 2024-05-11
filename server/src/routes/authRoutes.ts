import { Router } from "express";
import AuthController from "../controllers/AuthController";

export default (router: Router) => {
    router.post("/register", AuthController.register);
    router.get("/login", AuthController.login);
};