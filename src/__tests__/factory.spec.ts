import dotenv from "dotenv";
dotenv.config();
import { createUsers } from "../services/userService";
import { initializeDatabase, getPool } from "../utils/database";
import { faker } from "../factory";

describe("createUsers", () => {
  beforeAll(async () => {
    await initializeDatabase();
    const pool = getPool();
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nome VARCHAR(255) NOT NULL,
        idade INT NOT NULL,
        cidade VARCHAR(255) NOT NULL,
        empresa VARCHAR(255) NOT NULL
      );
    `);
  });

  afterAll(async () => {
    const pool = getPool();
    await pool.query("DELETE FROM usuarios");
    await pool.end();
  });

  it("Shold be able to create register on database", async () => {
    const baseData = [
      { nome: "", idade: undefined, cidade: "", empresa: "Empresa XYZ" },
    ];

    await createUsers("usuarios", baseData, 1, {
      randomFields: {
        nome: () => faker.name.firstName(),
        idade: () => faker.datatype.number({ min: 18, max: 60 }),
        cidade: () => faker.address.city(),
      },
    });

    const pool = getPool();
    const { rows } = await pool.query("SELECT * FROM usuarios");
    expect(rows).toHaveLength(1);
    expect(rows[0].nome).toBeDefined();
    expect(rows[0].idade).toBeDefined();
    expect(rows[0].cidade).toBeDefined();
  });
});
