import mongoose, { Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  status: string;
  owner: mongoose.Schema.Types.ObjectId;
}

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const Task = mongoose.model<ITask>("Task", taskSchema);
