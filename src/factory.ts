import { v4 as uuidv4 } from "uuid";
import { getPool } from "./utils/database";
import faker from "faker";

interface RandomOptions {
  uuid?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  randomFields?: { [key: string]: () => any };
}

const createFactory = async (
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

    if (options?.uuid) {
      newRecord["uuid"] = uuidv4();
    }

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
  const query = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;

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

export { createFactory, faker };
