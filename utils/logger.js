import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";

// __dirname ka alternative (kyunki ESM me __dirname nahi hota)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//log format
const logFormat = format.printf(({ timestamp, level, message, meta }) => {
  return `${timestamp} [${level.toUpperCase()}]:${message} ${
    meta ? JSON.stringify(meta) : ""
  }`;
});

//winston logger config

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), logFormat),
  transports: [
    new transports.Console(), //console me logs show karne k liye
    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/%DATE%-app.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m", //file sixe max 20mb
      maxFiles: "14d", // for 14 days
    }),
    //for error
    new DailyRotateFile({
      filename: path.join(__dirname, "../logs%DATE%-error.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
    }),
  ],
});

export default logger;
