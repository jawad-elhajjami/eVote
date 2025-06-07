import mongoose from "mongoose"

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  options: [{ type: String, required: true }],
  deadline: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Poll", pollSchema)
