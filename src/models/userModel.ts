import { getPool } from "../utils/database";

interface User {
  uuid?: string;
  nome: string;
  idade: number;
  cidade: string;
  empresa: string;
}

export const insertUsers = async (
  tableName: string,
  users: User[]
): Promise<void> => {
  const pool = getPool();
  const keys = Object.keys(users[0]).join(", ");
  const placeholders = Object.keys(users[0])
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const query = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;

  await pool.query("BEGIN");
  try {
    for (const user of users) {
      const values = Object.values(user);
      await pool.query(query, values);
    }
    await pool.query("COMMIT");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await pool.query("ROLLBACK");
    throw new Error(`Error inserting users: ${error.message}`);
  }
};
