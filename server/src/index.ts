import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import router from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();

const corsConfig = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

app.use(compression());
app.use(helmet());
app.use(cors(corsConfig));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("", router());

app.listen(process.env.PORT, () => {
    console.log("Server running on http://localhost:3000");
});
