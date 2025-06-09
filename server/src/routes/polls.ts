import { Router, Request, Response } from "express";
import { verifyToken, AuthRequest } from "../middleware/auth";
import Poll from "../models/Poll";
import mongoose from "mongoose";

const router = Router();

// Create new poll
router.post("/create", verifyToken, async (req: AuthRequest, res: Response) => {
  const { title, description, options, deadline } = req.body;

  // Prevent users with only the 'voter' role
  if (req.user?.roles.length === 1 && req.user.roles.includes("voter")) {
    return res
      .status(403)
      .json({ message: "Access denied: voters cannot create polls." });
  }

  if (!title || !options || options.length < 2) {
    return res
      .status(400)
      .json({ message: "Title and at least two options are required." });
  }

  try {
    // Format options to include vote counts
    const formattedOptions = options.map((text: string) => ({
      text,
      votes: 0,
    }));

    const poll = new Poll({
      title,
      description,
      options: formattedOptions,
      endDate: deadline, // renamed from 'deadline' to 'endDate' in schema
      createdBy: req.user?.userId,
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating poll." });
  }
});


// View all polls
router.get("/all", verifyToken, async (req: Request, res: Response) => {
  try {
    const polls = await Poll.find().populate("createdBy", "username");
    res.status(200).json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching polls." });
  }
})

// DELETE /delete/:id
router.delete("/delete/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  const pollId = req.params.id;

  // Deny access if the user only has the 'voter' role
  if (req.user?.roles.length === 1 && req.user.roles.includes("voter")) {
    return res.status(403).json({ message: "Access denied: voters cannot delete polls." });
  }

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    // Check if the current user is the creator of the poll
    if (poll.createdBy?.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Access denied: you did not create this poll." });
    }

    await Poll.findByIdAndDelete(pollId);
    res.status(200).json({ message: "Poll deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting poll." });
  }
});

// GET /:id - Fetch a specific poll by ID
router.get("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const poll = await Poll.findById(req.params.id).populate("createdBy", "username _id");

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    res.status(200).json({
      _id: poll._id,
      title: poll.title,
      description: poll.description,
      options: poll.options,
      endDate: poll.endDate,
      isActive: !poll.endDate || new Date(poll.endDate) > new Date(),
      createdBy: poll.createdBy,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch poll." });
  }
});

// PUT /update/:id - Update a specific poll by ID
router.put("/update/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  const { title, description, options, endDate } = req.body;

  if (!title || !options || options.length < 2) {
    return res.status(400).json({ message: "Title and at least two options are required." });
  }

  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    // Make sure the current user is the poll creator
    if (poll.createdBy.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "You are not allowed to edit this poll." });
    }

    poll.title = title;
    poll.description = description;
    poll.endDate = endDate || null;
    poll.options = options.map((text: string) => ({ text, votes: 0 })); // Optionally preserve votes

    await poll.save();

    res.status(200).json({ message: "Poll updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating poll." });
  }
});


// GET /api/polls/:id
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid poll ID." });
  }

  try {
    const poll = await Poll.findById(id)
      .populate("createdBy", "username _id")
      .lean();

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    const formattedPoll = {
      _id: poll._id.toString(),
      title: poll.title,
      description: poll.description,
      createdBy: poll.createdBy,
      createdAt: poll.createdAt.toISOString(),
      updatedAt: poll.updatedAt?.toISOString() || poll.createdAt.toISOString(),
      isActive: !poll.endDate || new Date(poll.endDate) > new Date(),
      endDate: poll.endDate?.toISOString(),
      options: poll.options.map((option: any) => ({ 
        text: option.text,
        votes: option.votes || 0 
      }))
    };

    res.status(200).json(formattedPoll);
  } catch (err) {
    console.error("Error fetching poll:", err);
    res.status(500).json({ message: "Server error fetching poll." });
  }
});


export default router;
