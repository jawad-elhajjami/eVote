import express, { Response } from "express"
import bcrypt from "bcrypt"
import { verifyToken, AuthRequest } from "../middleware/auth";
import User from "../models/User"

const router = express.Router()

// PUT /api/settings/password
router.put("/password", verifyToken, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required" })
  }

  try {
    const user = await User.findById(req.user?.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" })

    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    await user.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error changing password" })
  }
})

export default router
