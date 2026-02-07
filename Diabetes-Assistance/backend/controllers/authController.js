import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }


    const allowedRoles = ["user", "doctor", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });


    return res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1d" });

  res.json({ token, role: user.role, profileCompleted: user.profileCompleted });
};
