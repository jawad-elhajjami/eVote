import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  option: { type: String, required: true },
  signature: { type: String, required: true },
  hash: { type: String, required: true },
  receipt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Vote || mongoose.model("Vote", voteSchema);
