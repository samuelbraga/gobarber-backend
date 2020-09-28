module.exports = [
  {
    "name": "default",
    "type": "postgres",
    "host": `${process.env.DB_HOST}`,
    "port": `${process.env.DB_PORT}`,
    "username": `${process.env.DB_USER}`,
    "password": `${process.env.DB_PASS}`,
    "database": `${process.env.DB_NAME}`,
    "entities": ['./src/modules/**/infra/typeorm/entities/*.ts'],
    "migrations": ['./src/shared/infra/typeorm/migrations/*.ts'],
    "cli": {
      "migrationsDir": './src/shared/infra/typeorm/migrations',
    },
  },
  {
    "name": "mongo",
    "type": "mongodb",
    "url": `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
    "database": `${process.env.MONGO_SCHEMA}`,
    "useUnifiedTopology": true,
    "entities": ['./src/modules/**/infra/typeorm/schemas/*.ts'],
  },
]
