import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "@app/routes";

// Initialization
const app = express();
dotenv.config();

// Environment Variables
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.get("/health-check", (_, res) => {
	res.send("OK!");
});

// Routes
app.use("/api", authRoutes);

app.listen(Number(port), () => {
	console.log(`Server running on port ${port}`);
});
