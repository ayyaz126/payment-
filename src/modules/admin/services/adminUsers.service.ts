// src/modules/admin/services/adminUsers.service.ts
import { db } from "../../../config/db";
import { users } from "../../../db/schema/users";


export const getAllUsersService = async () => {
  try {
    const result = await db.select().from(users);
    return result;
  } catch (error) {
    console.error("❌ DB Error fetching users:", error);
    throw error;
  }
};
