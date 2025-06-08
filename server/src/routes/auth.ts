import { Router, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth";
const router = Router();

// GET /api/auth
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Auth route is working!" });
  return;
});

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password, roles } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      roles: roles || ["user"],
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      roles: savedUser.roles,
      dateCreated: savedUser.dateCreated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not set in environment");
    }
    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      secret as string,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user" });
  }
});


// GET route to get current user data
router.get("/me", verifyToken, (req: AuthRequest, res: Response) => {
  const { userId, roles } = req.user!;
  User.findById(userId).select("username roles").then(user => {
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ id:user.id, username: user.username, roles: user.roles });
  }).catch(() => res.status(500).json({ message: "Error retrieving user data" }));
});


export default router;
