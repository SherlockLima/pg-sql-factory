import { getPool } from "../utils/database";

interface RandomOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  randomFields?: { [key: string]: () => any };
}

export const createUsers = async (
  tableName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonData: any[],
  count: number = jsonData.length,
  options?: RandomOptions
): Promise<void> => {
  const pool = getPool();
  const generatedData = [];

  for (let i = 0; i < count; i++) {
    const newRecord = { ...jsonData[i % jsonData.length] };

    if (options?.randomFields) {
      for (const [key, generator] of Object.entries(options.randomFields)) {
        if (newRecord[key] === undefined || newRecord[key] === "") {
          newRecord[key] = generator();
        }
      }
    }

    generatedData.push(newRecord);
  }

  const keys = Object.keys(generatedData[0]).join(", ");
  const placeholders = Object.keys(generatedData[0])
    .map((_, index) => `$${index + 1}`)
    .join(", ");
  const query = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders}) RETURNING *`;

  try {
    await pool.query("BEGIN");
    for (const record of generatedData) {
      const values = Object.values(record);
      await pool.query(query, values);
    }
    await pool.query("COMMIT");
    console.log("Success!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await pool.query("ROLLBACK");
    console.error("Error:", error.message);
  }
};
