import { faker } from "../factory";
import { createUsers } from "../services/userService";

export const createUsersController = async (): Promise<void> => {
  const baseData = [{ nome: "", idade: 0, cidade: "", empresa: "Empresa XYZ" }];

  await createUsers("usuarios", baseData, 10, {
    randomFields: {
      nome: () => faker.name.firstName(),
      idade: () => faker.datatype.number({ min: 18, max: 60 }),
      cidade: () => faker.address.city(),
    },
  });
};
