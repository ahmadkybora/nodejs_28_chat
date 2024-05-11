import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_DATABASE, DB_PORT } = process.env;

const AppDataSource = new DataSource({
    type: "mongodb",
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [path.join(__dirname, "..", "models", "*.ts")]
});

AppDataSource
    .initialize()
    .then(async () => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    });

export default AppDataSource;
