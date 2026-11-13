// Environment variables (MONGO_URI, JWT_SECRET, PORT) are loaded by Node itself
// via `--env-file=.env` in the npm scripts, so no dotenv package is needed.

import bcrypt from "bcrypt";
import User from "./models/User.js";
import connectDB from "./db/connection.js";

const register = async () => {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const plainPassword = process.env.ADMIN_PASSWORD;

    if (!email || !plainPassword) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env");
    }

    await connectDB();

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      console.log(`Admin already exists: ${email}`);
      process.exit(0);
    }

    const hashPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = new User({
      name: process.env.ADMIN_NAME?.trim() || "Admin",
      email,
      password: hashPassword,
      address: "Kathmandu",
      role: "admin",
    });

    await newUser.save();

    console.log(`Admin created successfully: ${email}`);

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exit(1);
  }
};

register();