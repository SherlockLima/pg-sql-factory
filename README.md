# pg-sql-factory

A **SQL Factory** for Node.js with TypeScript. This package allows you to easily generate and insert data into your PostgreSQL database, making use of random data generation with Faker and UUIDs.

## Features

- Generate random data using Faker.
- Insert data into a PostgreSQL database.
- Configurable via environment variables.

## Installation

To install the package, use npm:

```sh
npm install pg-sql-factory
```

## Configuration
Create a .env file in the root of your project and configure the following environment variables:

```sh
DB_HOST=your-postgresql-host
DB_USER=your-postgresql-user
DB_PASSWORD=your-postgresql-password
DB_DATABASE=your-postgresql-database
DB_PORT=5432
```

## Usage
Here's an example of how to use the pg-sql-factory Package:

```js
import { initializeDatabase } from './utils/database';
import { createUsers } from './services/userService';

const main = async () => {
  try {
    await initializeDatabase();

    const baseData = [
      { nome: "", idade: 0, cidade: "", empresa: "Empresa XYZ" },
    ];

    await createUsers("usuarios", baseData, 10, {
      randomFields: {
        nome: () => faker.name.firstName(),
        idade: () => faker.datatype.number({ min: 18, max: 60 }),
        cidade: () => faker.address.city(),
      },
    });

    console.log('Registros criados com sucesso!');
  } catch (error: any) {
    console.error('Erro ao executar o factory:', error.message);
  }
};

main();
```

## Contributing
Feel free to open issues or submit pull requests with improvements. Contributions are always welcome!

## License
This project is licensed under the MIT License. See the LICENSE file for more details.