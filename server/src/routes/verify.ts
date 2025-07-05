import { Router, Request, Response } from "express";
import Vote from "../models/Vote";

const router = Router();

router.get("/votes", async (req, res) => {
    const { receipt, hash, option } = req.query;
  
    const filter: any = {};
    if (receipt) filter.receipt = receipt;
    if (hash) filter.hash = hash;
    if (option) filter.option = option;
  
    try {
      const votes = await Vote.find(filter)
        .populate("poll", "title")
        .populate("user", "username")
        .sort({ createdAt: -1 });
  
      const formattedVotes = votes.map((v) => ({
        receipt: v.receipt,
        hash: v.hash,
        option: v.option,
        pollTitle: v.poll?.title || "Unknown Poll",
        timestamp: v.createdAt,
      }));
  
      res.status(200).json(formattedVotes);
    } catch (err) {
      console.error("Failed to fetch votes:", err);
      res.status(500).json({ message: "Server error." });
    }
  });
  export default router;