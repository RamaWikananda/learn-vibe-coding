import { Elysia } from "elysia";
import { registerUser } from "../services/users-service";

export const usersRoute = new Elysia()
  .post("/api/users", async ({ body, set }) => {
    try {
      const { name, email, password } = body as any;

      if (!name || !email || !password) {
        set.status = 400;
        return { data: "Nama, email, dan password wajib diisi" };
      }

      await registerUser({ name, email, password });
      
      set.status = 200; // Success
      return { data: "OK" };
    } catch (error: any) {
      set.status = 400; // Bad request/Conflict
      if (error.message === "Email sudah terdaftar") {
        return { data: "Email sudah terdaftar" };
      }
      return { data: error.message };
    }
  });
