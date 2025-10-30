import { db } from "../../../config/db";
import { users } from "../../../db/schema/users";
import bcrypt from "bcrypt";
import { RegisterDTO } from "../dto/auth.types"; // ✅ updated path (dot → dot folder ka actual name)
import { eq } from "drizzle-orm";

export async function registerUser(dto: RegisterDTO, requester?: { role: string }) {
  const { name, email, password, role } = dto;

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    throw new Error("Email already registered");
  }

  // Only allow admins to create another admin
  if (role === "admin" && (!requester || requester.role !== "admin")) {
    throw new Error("Only admins can create another admin");
  }

  // ✅ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Insert user with hashed password
  const newUser = await db.insert(users).values({
    name,
    email,
    password: hashedPassword, // ✅ FIX
    role: role || "user",
  }).returning();

  const insertedUser = newUser[0];
  if (!insertedUser) throw new Error("Failed to create user");

  return insertedUser;
}
