// routes/user.ts
import { Router, Request, Response } from "express"
import User from "../models/User"

const router = Router()

router.post("/:id/public-key", async (req: Request, res: Response) => {
  const { id } = req.params
  const { publicKey } = req.body

  if (!publicKey) return res.status(400).json({ message: "Missing publicKey" })

  try {
    await User.findByIdAndUpdate(id, { publicKey })
    res.status(200).json({ message: "Public key saved successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error saving public key" })
  }
})

export default router
