import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import User from "./models/User.js";
import connectDB from "./db/connection.js";

const register = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const plainPassword = "admin";

const hashPassword = await bcrypt.hash(plainPassword, 10);

console.log("Plain Password:", plainPassword);
console.log("Generated Hash:", hashPassword);
console.log(
  "Verify:",
  await bcrypt.compare(plainPassword, hashPassword)
);

    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPassword,
      address: "Kathmandu",
      role: "admin",
    });

    await newUser.save();

    console.log("✅ Admin created successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

register();