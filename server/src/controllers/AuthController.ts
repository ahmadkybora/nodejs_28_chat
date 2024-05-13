import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import AppDataSource from "../config/database";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

class AuthController {

    public static userRepository = AppDataSource.getRepository(UserModel);
    
    public static async register(request: Request, response: Response) {
        const { name, email, password } = request.body;

        const emailCheck = await AuthController.userRepository.findOne({ where: { email } });

        const nameCheck = await AuthController.userRepository.findOne({ where: { name } });

        if(emailCheck !== null || nameCheck !== null)
            return response.status(422).json({
                data: null,
                state: false,
                message: "user is already has been taken"
            });

        const user = new UserModel();
        user.name = name;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        await AuthController.userRepository.save(user);

        return response.status(200).json({
            data: user,
            state: true,
            message: "user successfully registered"
        });
    }

    public static async login(request: Request, response: Response) {
        const { email, password } = request.body;

        const userCheck = await AuthController.userRepository.findOne({ where: { email } });

        if(userCheck === null)
            return response.status(403).json({
                data: null,
                state: false,
                message: "email or password not found"
            });

        const passwordCheck = await bcrypt.compare(password, userCheck.password);

        if(passwordCheck === true) {
            const token = AuthController.generateAccessToken(userCheck.name);
            userCheck.token = token;
            userCheck.token_revoke = false;
            const user = await AuthController.userRepository.save(userCheck);

            const userFilter = JSON.parse(JSON.stringify(user));
            delete userFilter.password;
            delete userFilter.token_revoke;

            return response.status(200).json({
                data: userFilter,
                state: false,
                message: "You are loggedIn!"
            });
        }
    }

    public static async logout(request: Request, response: Response) {
        if(
            request.headers.hasOwnProperty("authorization") &&
            request.headers["authorization"] !== null
        ) {
            const authHeader: any = request.headers["authorization"];
            const token: any = authHeader.split(" ")[1];
            const { ACCESS_TOKEN_SECRET }:any = process.env;

            const verify: any = Jwt.verify(token, ACCESS_TOKEN_SECRET);
            const userRepository = AppDataSource.getRepository(UserModel);
            const user: any = await userRepository.findOne({ where: { name: verify.payload } });
            user.token_revoke = true;
            await AuthController.userRepository.save(user);

            delete request.headers["authorization"];

            return response.status(200).json({
                data: null,
                state: true,
                message: "You are logged out"
            });
        }

        delete request.headers["authorization"];
        
        return response.status(401).json({
            data: null,
            state: false,
            message: "You are not authorized"
        });
    }
    
    public static generateAccessToken = (payload: any) => {
        const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE, ACCESS_TOKEN_ALGORITHM }: any = process.env;
        return Jwt.sign({ payload }, ACCESS_TOKEN_SECRET, {
            algorithm: ACCESS_TOKEN_ALGORITHM,
            expiresIn: ACCESS_TOKEN_LIFE
        });
    }
}

export default AuthController;
