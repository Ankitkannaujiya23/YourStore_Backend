import jwt from "jsonwebtoken";

const jwtAuthentication = (req, res, next) => {
  if (
    req.path == "/" ||
    req.path == "/api/user/login" ||
    req.path == "/api/user/signup"
  ) {
    next();
  } else {
    const token = req.header["token"];
    if (!token) {
      return res.json({ statusCode: 401, message: "token is missing!!" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
      if (err) {
        return res.json({ statusCode: 401, message: "Token is invalid!!" });
      }

      req.user = result;

      next();
    });
  }
};
export default jwtAuthentication;
