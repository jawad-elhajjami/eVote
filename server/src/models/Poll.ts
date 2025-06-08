import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
  },
  { _id: false } // Prevent Mongoose from auto-creating _id for each option
);

const pollSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    options: { type: [optionSchema], required: true },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Poll", pollSchema);
