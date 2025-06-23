import { Router, Request, Response } from "express";
import Vote from "../models/Vote";
import User from "../models/User";
import Poll from "../models/Poll";
import { verifyToken, AuthRequest } from "../middleware/auth";
import { verifySignature, generateReceipt } from "../lib/helpers";

const router = Router();

// POST /api/polls/:id/vote - Submit a vote
router.post(
  "/:id/vote",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const pollId = req.params.id;
    const { option, signature, hash, voteData, timestamp } = req.body;
    const userId = req.user?.userId;

    try {
      // Validate input
      if (!option || !signature || !hash || !voteData) {
        return res.status(400).json({
          message: "Option, signature, hash, and voteData are required.",
        });
      }

      // Check if poll exists and is active
      const poll = await Poll.findById(pollId);
      if (!poll) {
        return res.status(404).json({ message: "Poll not found." });
      }

      // Check if poll is still active (not expired)
      if (!poll.isActive || poll.endDate && new Date(poll.endDate) < new Date()) {
        return res.status(400).json({ message: "This poll has ended." });
      }

      // Check if option is valid
      const validOption = poll.options.find((opt) => opt.text === option);
      if (!validOption) {
        return res.status(400).json({ message: "Invalid vote option." });
      }

      // Check if user has already voted on this poll
      const existingVote = await Vote.findOne({ poll: pollId, user: userId });
      if (existingVote) {
        return res.status(400).json({
          message: "You have already voted on this poll.",
        });
      }

      // Get user's public key for signature verification
      const user = await User.findById(userId);
      if (!user || !user.publicKey) {
        return res.status(400).json({
          message: "User public key not found. Cannot verify vote signature.",
        });
      }

      // Verify that the voteData contains the correct information
      let parsedVoteData;
      try {
        parsedVoteData = JSON.parse(voteData);
      } catch (error) {
        return res.status(400).json({ message: "Invalid vote data format." });
      }

      // Verify the vote data matches the request
      if (
        parsedVoteData.pollId !== pollId ||
        parsedVoteData.option !== option ||
        parsedVoteData.userId !== userId
      ) {
        return res.status(400).json({
          message: "Vote data does not match request parameters.",
        });
      }

      // Verify the signature using the exact voteData that was signed
      const isValidSignature = verifySignature(
        voteData,
        signature,
        user.publicKey as string
      );
      if (!isValidSignature) {
        return res.status(400).json({
          message: "Invalid vote signature. Vote rejected.",
        });
      }

      // Generate a receipt
      const receipt = generateReceipt({
        pollId,
        userId,
        option,
        timestamp: timestamp || new Date().toISOString(),
        hash,
      });

      // Create and save the vote
      const vote = new Vote({
        poll: pollId,
        user: userId,
        option,
        signature,
        hash,
        receipt,
      });

      await vote.save();

      // Update vote count in the poll
      const optionIndex = poll.options.findIndex((opt) => opt.text === option);
      if (optionIndex !== -1) {
        poll.options[optionIndex].votes += 1;
        await poll.save();
      }

      // Return success response with receipt
      res.status(201).json({
        message: "Vote submitted successfully!",
        option,
        receipt,
        hash,
        voteId: vote._id,
        timestamp: vote.createdAt,
      });
    } catch (error) {
      console.error("Error submitting vote:", error);
      res.status(500).json({
        message: "Internal server error while submitting vote.",
      });
    }
  }
);

// GET /api/polls/:id/verify-vote - Verify if a vote exists (for receipt verification)
router.get(
  "/:id/verify-vote",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const pollId = req.params.id;
    const { receipt, hash } = req.query;
    const userId = req.user?.userId;

    try {
      if (!receipt || !hash) {
        return res.status(400).json({
          message: "Receipt and hash are required for verification.",
        });
      }

      // Find the vote with matching receipt and hash
      const vote = await Vote.findOne({
        poll: pollId,
        user: userId,
        receipt: receipt as string,
        hash: hash as string,
      }).populate("poll", "title");

      if (!vote) {
        return res.status(404).json({
          message: "Vote not found with provided receipt and hash.",
        });
      }

      res.status(200).json({
        message: "Vote verified successfully!",
        vote: {
          option: vote.option,
          timestamp: vote.createdAt,
          receipt: vote.receipt,
          hash: vote.hash,
          pollTitle: vote.poll?.title || "Unknown Poll",
        },
      });
    } catch (error) {
      console.error("Error verifying vote:", error);
      res.status(500).json({
        message: "Internal server error while verifying vote.",
      });
    }
  }
);

// GET /api/polls/:id/results - Get poll results (public endpoint)
router.get("/:id/results", async (req, res) => {
  const pollId = req.params.id;

  try {
    const poll = await Poll.findById(pollId)
      .populate("createdBy", "username")
      .lean();

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    // Access control checks
    const now = new Date();
    const endDate = poll.endDate ? new Date(poll.endDate) : null;

    // Check if poll has ended
    const hasEnded = endDate ? now >= endDate : false;

    // Check if poll is completed
    const isCompleted = poll.isActive || false;

    // Deny access if poll hasn't ended AND isn't completed
    if (!hasEnded && !isCompleted) {
      return res.status(403).json({
        message:
          "Results are not available yet. This poll is still active and has not reached its deadline.",
      });
    }

    // If poll has ended but isn't marked as completed, still deny access
    if (hasEnded && !isCompleted) {
      return res.status(403).json({
        message:
          "Results are not available yet. This poll has not been marked as completed by an administrator.",
      });
    }

    // Get total vote count
    const totalVotes = await Vote.countDocuments({ poll: pollId });

    // Calculate percentages
    const results = poll.options.map((option) => ({
      text: option.text,
      votes: option.votes,
      percentage:
        totalVotes > 0
          ? ((option.votes / totalVotes) * 100).toFixed(2)
          : "0.00",
    }));

    res.status(200).json({
      pollId: poll._id,
      title: poll.title,
      description: poll.description,
      totalVotes,
      results,
      isActive: !poll.endDate || new Date(poll.endDate) > new Date(),
      isCompleted: poll.isActive || false,
      endDate: poll.endDate,
      createdBy: poll.createdBy,
    });
  } catch (error) {
    console.error("Error fetching poll results:", error);
    res.status(500).json({
      message: "Internal server error while fetching results.",
    });
  }
});

export default router;
