import { Router, Request, Response } from "express";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Vote route works!" });
});

router.post("/submit", verifyToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  // TODO: 
  // - check if user already voted
  // - store their signed vote
  // - mark them as voted in the DB

  res.json({ message: `Vote received from user ${userId}` });
});

export default router;
