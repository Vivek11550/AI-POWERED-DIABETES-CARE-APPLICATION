//To run this file write node createAdmin.js in terminal


import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const register = async () => {
  try {
    const hashed = await bcrypt.hash("123456", 10);

    const user = await User.create({
      email: "admin@gmail.com",
      password: hashed,
      role: "admin",
      profileCompleted: true,
    });

    console.log("Admin user created:");
    console.log(user);

    process.exit(0);
  } catch (e) {
    console.error("Error creating admin:");
    console.error(e);
    process.exit(1);
  }
};

const DB = process.env.MONGO_URI;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to database");
    register();
  })
  .catch((err) => {
    console.error("Error connecting to database:");
    console.error(err);
    process.exit(1);
  });
