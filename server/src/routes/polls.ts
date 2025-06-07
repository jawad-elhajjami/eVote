import { Router, Request, Response } from "express"
import { verifyToken, AuthRequest } from "../middleware/auth"
import Poll from "../models/Poll"

const router = Router()

router.post("/create", verifyToken, async (req: AuthRequest, res: Response) => {
  const { title, description, options, deadline } = req.body

  if (!title || !options || options.length < 2) {
    return res.status(400).json({ message: "Title and at least two options are required." })
  }

  try {
    const poll = new Poll({
      title,
      description,
      options,
      deadline,
      createdBy: req.user?.userId,
    })

    await poll.save()
    res.status(201).json(poll)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error creating poll." })
  }
})

export default router
