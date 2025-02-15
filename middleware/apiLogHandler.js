import pool from "../dbconfig/dbConnection.js";
import logger from "../utils/logger.js";

const apiLogHandler = async (req, res, next) => {
  const start = Date.now();
  res.on("finish", async () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      requestBody: JSON.stringify(req.body),
      responseBody: JSON.stringify(res.locals.responseData || null),
    };

    // 📝 Save log to file
    logger.info("API Request", logData);

    try {
      await pool.execute(
        "INSERT INTO api_logs (method, url, status, duration, ip, userAgent, requestBody, responseBody) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        Object.values(logData)
      );
    } catch (error) {
      console.log("error saving log to db", error);
    }
  });
  next();
};
export default apiLogHandler;
