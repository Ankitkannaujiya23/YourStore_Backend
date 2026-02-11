import jwt from "jsonwebtoken";
import { generateHashedPass } from "../utils/utilFunctions.js";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV;
dotenv.config({ path: `.env.${envFile}` });

const userController = {
  signup: async (req, res) => {
    const { name, email, password } = req.body;
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ statusCode: 400, message: "Bad Request", errors: err.array() });
    }

    try {
      const conn = req.db;
      //check if user already exist
      const [existingUser] = await conn.execute(
        `select * from users where email= ?`, [email]
      );
      if (existingUser.length > 0) {
        return res.json({ statusCode: 400, message: "User already exist!!" });
      }
      const hashPass = await generateHashedPass(password);
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
      return res.status(400).json({ statusCode: 400, message: "Bad Request", errors: err.array() });
    }
    try {
      const conn = req.db;
      const [users] = await conn.execute("select * from users where email = ? ", [
        email
      ]);
      console.log({ users });
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

      return res.json({ statusCode: 200, message: "Login Succesfully!", Data: { token, user: user.name, email: user.email, role: user.role, userid: user.id } });
    } catch (error) {
      return res.json({ statusCode: 500, message: "Server error!!" });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const db = req.db;

      const [userData] = await db.execute('select * from users where email =?', [email]);

      if (userData.length === 0) {
        return res.json({ statusCode: 404, message: 'Email is not registered' });
      }

      // 1. Generate token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = Date.now() + 15 * 60 * 1000; //15 min

      //2.  Save token and expiry in DB
      await db.execute('UPDATE users SET resetToken=?, resetTokenExpiry=? where email=?', [resetToken, tokenExpiry, email]);

      // 3. Send email
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Password Reset",
        html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
      });

      return res.json({ statusCode: 200, message: "Reset link sent successfully" });

    } catch (error) {
      console.log({ error });
      return res.json({ statusCode: 500, message: error.message });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { password } = req.body;
      const { token } = req.params;
      const db = req.db;

      //1. token match 
      const [userData] = await db.execute('select * from users where resetToken=?', [token]);

      if (userData.length === 0) {
        return res.json({ statusCode: 404, message: 'Invalid or expired token' })
      }

      const user = userData[0];

      // 2. Token expiry check
      if (Date.now() > user.resetTokenExpiry) {
        return res.status(400).json({ message: "Token has expired" });
      }

      //3. hash the password

      const hashedPass = await generateHashedPass(password);

      await db.execute('update users set password =?, resetToken=null, resetTokenExpiry=null where id=?', [hashedPass, user.id]);
      return res.json({ statusCode: 200, message: "Password Reset successfully" });


    } catch (error) {
      console.log({ error });
      return res.json({ statusCode: 500, message: "Internal server error" });
    }
  },
  getUserDetail: async (req, res) => {
    try {
      const userId = req.user.id;
      const db = req.db;
      const [rows] = await db.execute('select * from users where id = ?', [userId]);
      const userDetail = rows[0] || null;

      return res.json({
        statusCode: 200,
        message: "User details fetched successfully!",
        response: userDetail[0]
      });
    } catch (error) {
      return res.json({ statusCode: 500, message: error.message });
    }
  },
  updateUserDetail: async (req, res) => {
    try {
      const userId = req.user.id;
      const { email, mobile, name } = req.body;
      const db = req.db;
      const [result] = await db.execute('Call sp_updateUserDetail(?,?,?,?)', [userId, name, mobile, email]);
      return res.json({ statusCode: 200, message: "Details Updated Successfully!", response: result });
    } catch (error) {
      console.log({ error });
      return res.json({ statusCode: 500, message: error.message });
    }
  }
};

export default userController;
