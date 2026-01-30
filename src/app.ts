import express from "express";
import login from "./routes/access.route";
import cors from "cors";
import dotenv from "dotenv";
import "./config/firebase";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/access", login);

export default app;
