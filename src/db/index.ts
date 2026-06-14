import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL environment variable is not set.");
}

const poolConnection = mysql.createPool(connectionString || "mysql://root:password@localhost:3306/mydb");

export const db = drizzle(poolConnection, { schema, mode: "default" });
