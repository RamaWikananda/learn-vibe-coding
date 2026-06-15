import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export async function loginUser(email: string, password: string): Promise<string> {
  // Find user by email
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    throw new Error("Email atau password salah");
  }

  // Verify password using Bun's built-in password verify
  const isPasswordValid = await Bun.password.verify(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Email atau password salah");
  }

  // Generate UUID token
  const token = crypto.randomUUID();

  // Insert session into database
  await db.insert(sessions).values({
    token: token,
    userId: user.id,
  });

  return token;
}
