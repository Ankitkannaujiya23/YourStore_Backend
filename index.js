import express from "express";
import dotenv from "dotenv";
import connection from "./dbconfig/dbConnection.js";
import cors from "cors";
import router from "./routes/route.js";
import pool from "./dbconfig/dbConnection.js";
import jwtAuthentication from "./middleware/jwtAuthentication.js";
import morgan from "morgan";
import logger from "./utils/logger.js";
import apiLogHandler from "./middleware/apiLogHandler.js";
import responseLogHandler from "./middleware/responseLogHandler.js";

const envFile = process.env.NODE_ENV;
dotenv.config({ path: `.env.${envFile}` });

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body
app.use((req, res, next) => jwtAuthentication(req, res, next));

// 🛠️ Morgan for HTTP request logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
// ✅ Custom Middleware for logging API requests
app.use(apiLogHandler);

app.use(responseLogHandler);

app.use(async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    req.db=conn;
    next();

   // conn.release()
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api", router);

app.listen(port, () => {
  console.log("application is running!!");
});
