import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const login = async (req, resp) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({ message: "User doesnot exist" });
    }
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(resp, accessToken, refreshToken);
      resp.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "Login Successful",
      });
    } else {
      resp.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error is login controller", error.message);
    resp.status(500).json({ message: "Interal server error" });
  }
};

export const logout = async (req, resp) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token: ${decoded.userId}`);
    }

    resp.clearCookie("accessToken");
    resp.clearCookie("refreshToken");
    resp.json({ message: "Logged Out Successfully" });

    // after decoding we have the userId as we have signed jwt with it
  } catch (error) {
    console.log("Error is logout controller", error.message);
    resp.status(500).json({ message: "Interal Server Error" });
  }
};

export const signup = async (req, resp) => {
  const { name, email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      return resp.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({ name, email, password }); // password would be hashed automatically

    // AUthentication
    const { accessToken, refreshToken } = generateTokens(newUser._id);
    await storeRefreshToken(newUser._id, refreshToken);
    setCookies(resp, accessToken, refreshToken);

    resp.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: "User Created Successfully",
    });
  } catch (error) {
    console.log("Error is signup controller", error.message);
    resp.status(500).json({ message: error.message });
  }
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token: ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (resp, accessToken, refreshToken) => {
  resp.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks , cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attacks , cross-site request forgery
    maxAge: 15 * 60 * 1000,
  });
  resp.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks , cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attacks , cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// thi will refresh the acccess token
export const refreshToken = async (req, resp) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return resp.status(401).json({ message: "No refresh Token provided" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token: ${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return resp.status(401).json({ message: "Invalid refresh Token" });
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    resp.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    resp.json({ message: "Token refershed Successfully" });
  } catch (error) {
    console.log("Error in refresh Token controller", error.message);
    resp.status(500).json({ message: "Server error", error: error.message });
  }
};
