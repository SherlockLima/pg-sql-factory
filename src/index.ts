import dotenv from "dotenv";
dotenv.config();
import { initializeDatabase } from "./utils/database";
import { createUsers } from "./services/userService";
import { faker } from "./factory";

const main = async () => {
  try {
    await initializeDatabase();

    const baseData = [
      { nome: "", idade: undefined, cidade: "", empresa: "Empresa XYZ" },
    ];

    await createUsers("usuarios", baseData, 10, {
      randomFields: {
        nome: () => faker.name.firstName(),
        idade: () => faker.datatype.number({ min: 18, max: 60 }),
        cidade: () => faker.address.city(),
      },
    });

    console.log("success");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

main();
