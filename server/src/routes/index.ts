import { Router } from "express";
import AuthRouter from "./authRoutes";

const router = Router();

export default(): Router => {
    AuthRouter(router);
    return router;
};
