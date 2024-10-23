import { Request, Response } from "express";
import { Task } from "../models/Task";
import { promises } from "dns";

export const createTask = async (req: Request, res: Response): Promise<any> => {
  const { title, description, dueDate, status } = req.body;
  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
      owner: req.userId, // from authMiddleware
    });

    console.log("newTask---", newTask);

    await newTask.save();
    return res.status(201).json(newTask);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<any> => {
  try {
    const tasks = await Task.find({ owner: req.userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params; // Extract task ID from URL params
    console.log("id", id, req.userId);

    const { title, description, dueDate, status } = req.body; // Get updated data from request body

    // Find the task by ID and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: id, owner: req.userId });
    console.log("task", task);

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    // Update task fields if they exist in the request body
    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = new Date(dueDate); // Convert dueDate string to Date object
    if (status) task.status = status;

    // Save the updated task
    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Failed to update task", error });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params; // Extract task ID from URL params
    // Find the task by ID and ensure it belongs to the authenticated user
    const task = await Task.findOneAndDelete({ _id: id, owner: req.userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
};
