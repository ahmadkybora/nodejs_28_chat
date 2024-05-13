import AppDataSource from "../config/database";
import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

export default async (request: Request, response: Response, next: NextFunction) => {
    if(
        request.headers.hasOwnProperty("authorization") &&
        request.headers["authorization"] !== null
    ) {
        const authHeader:any = request.headers["authorization"];
        const token = authHeader.split(" ")[1];
        const { ACCESS_TOKEN_SECRET }:any = process.env;

        try {
            const verify: any = Jwt.verify(token, ACCESS_TOKEN_SECRET);
            const userRepository = AppDataSource.getRepository(UserModel);
            const user: any = await userRepository.findOne({ where: { name: verify.payload } });

            if(user.token_revoke !== false)
                return response.status(401).json({
                    data: null,
                    state: false,
                    message: "You are not authorized"
                });

            request.body = user;
            next();
        } catch (error) {
            return response.status(401).json({
                data: null,
                state: false,
                message: "You are not authorized"
            });
        }

    } else {
        return response.status(401).json({
            data: null,
            state: false,
            message: "You are not authorized"
        });
    }
}
