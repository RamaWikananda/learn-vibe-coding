import { Elysia } from "elysia";
import { db } from "./src/db";
import { users } from "./src/db/schema";
import { userRoutes } from "./src/routes/users-route";

const app = new Elysia()
  .use(userRoutes)
  .get("/", () => ({
    status: "ok",
    message: "Server is running successfully!"
  }))
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(users);
      return { success: true, data: allUsers };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);