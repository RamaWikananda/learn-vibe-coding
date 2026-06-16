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

export async function logoutUser(token: string): Promise<void> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (!session) {
    throw new Error("Unauthorized");
  }

  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function getCurrentUser(token: string) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);

  const user = result[0];
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
