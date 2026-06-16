import { Elysia, t } from "elysia";
import { loginUser, logoutUser, getCurrentUser } from "../services/users-service";

export const userRoutes = new Elysia()
  .post("/api/users/login", async ({ body, set }) => {
    try {
      const { email, password } = body;
      const token = await loginUser(email, password);
      return { data: token };
    } catch (error: any) {
      set.status = 401;
      return { data: "Email atau password salah" };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  })
  .delete("/api/users/logout", async ({ headers, set }) => {
    try {
      const authorization = headers["authorization"];
      if (!authorization || !authorization.startsWith("Bearer ")) {
        set.status = 401;
        return { data: "Unauthorized" };
      }

      const token = authorization.substring(7);
      await logoutUser(token);
      return { data: "Logout Success" };
    } catch (error: any) {
      set.status = 401;
      return { data: "Unauthorized" };
    }
  })
  .get("/api/users/current", async ({ headers, set }) => {
    try {
      const authorization = headers["authorization"];
      if (!authorization || !authorization.startsWith("Bearer ")) {
        set.status = 401;
        return { data: "Unauthorized" };
      }

      const token = authorization.substring(7);
      const user = await getCurrentUser(token);
      return {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt
        }
      };
    } catch (error: any) {
      set.status = 401;
      return { data: "Unauthorized" };
    }
  });
