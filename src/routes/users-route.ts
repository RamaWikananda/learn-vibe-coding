import { Elysia, t } from "elysia";
import { loginUser } from "../services/users-service";

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
  });
