import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const auth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1) Require Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;                        // <-- exit, but return void
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();                        // go on to the route handler
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};