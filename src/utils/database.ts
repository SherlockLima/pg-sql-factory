import { Pool } from "pg";
import { dbConfig } from "../config/dbConfig";

const pool = new Pool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  ssl: dbConfig.ssl,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Conected database PostgreSQL");
  } catch (error) {
    console.error("Error", error);
    throw new Error("Error conect database");
  }
};

export const getPool = (): Pool => {
  return pool;
};
