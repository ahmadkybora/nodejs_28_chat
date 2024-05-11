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
            const token = AuthController.generateAccessToken(userCheck.name)
            const user = Object.assign({}, userCheck, { token });

            return response.status(200).json({
                data: user,
                state: false,
                message: "You are loggedIn!"
            });
        }
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
