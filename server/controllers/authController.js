import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Password:", password);

    const user = await User.findOne({ email });

    console.log("User Found:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Stored Hash:", user.password);

console.log("New Hash:", await bcrypt.hash("admin", 10));

const isMatch = await bcrypt.compare("admin", user.password);

console.log("Password Match:", isMatch);


    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    res.json({
      success: true,
      token,
      user,
    });

  } catch (err) {
    console.log(err);
  }
};

export { login };