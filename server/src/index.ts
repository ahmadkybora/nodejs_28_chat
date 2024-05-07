import express, { Express } from "express";

const app: Express = express();

app.listen(process.env.PORT, () => {
    console.log("Server running on http://localhost:3001");
});