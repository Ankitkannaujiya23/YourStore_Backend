import jwt from "jsonwebtoken";

const jwtAuthentication = (req, res, next) => {
  let token = req.headers["token"];
  const isForResetPassword = req.path.includes('/api/user/forgotPassword' || '/api/user/forgotPassword');
  const openRoutes = [
    "/",
    "/api/user/login",
    "/api/user/signup",
    "/api/user/forgotPassword",
    "/api/user/resetPassword"
  ];

  if (req.path === '/' || (openRoutes.some(route => route !== '/' && req.path.startsWith(route)))) {
    return next();
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
