import knex from "knex";

export const orm = knex({
  client: "sqlite3",
  connection: {
    filename: "src/assets/sqlite.db",
  },
  useNullAsDefault: true,
});
