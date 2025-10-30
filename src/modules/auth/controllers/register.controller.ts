import { Request, Response, NextFunction } from "express";
import { registerUser } from "../services/register.service";
import { RegisterDTO } from "../dto/auth.types";

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto: RegisterDTO = req.body;
    const newUser = await registerUser(dto);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}
