import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.header("Authorization")?.split(" ")[1];

  console.log("token", token);

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "nagesh_2727"
    ) as any;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("error--", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};
