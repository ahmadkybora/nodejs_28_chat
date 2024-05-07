import express, { Express } from "express";

const app: Express = express();

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
