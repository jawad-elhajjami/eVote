import { Router } from "express";

const router = Router();

router.get("/test", (req: any, res: any) => {
  res.json({ message: "Auth route is working!" });
});

export default router;
