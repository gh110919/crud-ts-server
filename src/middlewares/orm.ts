import { config } from "dotenv";
import knex from "knex";

const { PG } = config({ path: ".local/.env" }).parsed!;

export const connection = knex({
  client: "pg",
  connection: PG,
  useNullAsDefault: true,
  log: {
    warn: console.warn,
    error: console.error,
    debug: console.log,
  },
});

class ORM {
  create = (table: string, data: object) => {
    return connection(table).insert(data);
  };
  read = (table: string) => {
    return connection(table);
  };
  upgrade = (table: string, where: object, update: object) => {
    return connection(table).where(where).update(update);
  };
  destroy = (table: string, where: object) => {
    return connection(table).where(where).delete();
  };
  filtering = (table: string, where: object) => {
    return connection(table).where(where);
  };
  sorting = (table: string, by: string, order: string) => {
    return connection(table).orderBy(by, order);
  };
  pagination = (table: string, limit: number, offset: number) => {
    return connection(table).limit(limit).offset(offset);
  };
  count = async (table: string) => {
    return (await connection(table)).length;
  };
}

type TORM = InstanceType<typeof ORM>;
type TConection = typeof connection;
type TProxyORM = TORM & TConection;

export const orm = new Proxy(new ORM(), {
  get(target: TORM, prop: string) {
    if (prop in target) {
      return target[prop as keyof ORM];
    }
    if (prop in connection) {
      return connection[prop as keyof TConection];
    }
    return undefined;
  },
}) as TProxyORM;
