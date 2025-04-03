import jwt from "jsonwebtoken";
import { generateHashedPass } from "../utils/utilFunctions.js";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";

const userController = {
  signup: async (req, res) => {
    const { name, email, password } = req.body;
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ statusCode: 400, message: err.array() });
    }

    try {
      const conn =  req.db;
      //check if user already exist
      const [existingUser] = await conn.execute(
        `select * from users where email= ?`, [email]
      );
      if (existingUser.length > 0) {
        return res.json({ statusCode: 400, message: "User already exist!!" });
      }
      const hashPass =await generateHashedPass(password);
      await conn.execute(
        `insert into users (name,email,password) values(?,?,?)`,
        [name, email, hashPass]
      );

      return res.json({ statusCode: 201, message: "User registered successfully" });
    } catch (error) {
      console.log({ error });

      return res.json({ statusCode: 500, message: "Server error!!" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ statusCode: 400, message: err.array() });
    }
    try {
      const conn = req.db;
    const [users] = await conn.execute("select * from users where email = ? ", [
        email
      ]);
      console.log({users});
      if (users.length === 0) {
        return res.json({ statusCode: 400, message: "Invalid Credential!!" });
      }
      const user = users[0];

      //check password ismatch or not with bcryptjs.verify method
      const isPassMatch = await bcryptjs.compare(password, user.password);
      if (!isPassMatch) {
        return res.json({ statusCode: 400, message: "Invalid Credential!!" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.json({ statusCode: 200, message: "Login Succesfully!", Data:{token, user:user.name,email:user.email , role:user.role} });
    } catch (error) {
      return res.json({ statusCode: 500, message: "Server error!!" });
    }
  },
};  

export default userController;
