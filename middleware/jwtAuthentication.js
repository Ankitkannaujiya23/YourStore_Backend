import jwt from "jsonwebtoken";

const jwtAuthentication = (req, res, next) => {
  let token = req.headers["token"];
  if (
    req.path == "/" ||
    req.path == "/api/user/login" ||
    req.path == "/api/user/signup" ||
    req.path == '/api/user/forgotPassword' ||
    req.path == '/api/user/updatePassword'
  ) {
    next();
  } else {
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
