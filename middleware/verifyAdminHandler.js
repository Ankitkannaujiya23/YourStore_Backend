const verifyAdminHandler = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.json({
      statusCode: 403,
      message: "Access Denied. Admins only.",
    });
  }
  next();
};

export default verifyAdminHandler;