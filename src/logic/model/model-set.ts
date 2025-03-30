import { v7 } from "uuid";
import { orm } from "../../middlewares/orm";
import { TCreate } from "../../types";

export const modelSet = async <T>(table: string) => {
  return async ({ body }: TCreate<T[]>): Promise<T[]> => {
    const records = body.map((e: T) => ({
      ...e,
      _id: v7(),
      _created_at: orm.fn.now(),
    }));

    const ids = records.map(({ _id }) => _id);

    await orm.create(table, records);

    return await orm.read(table).whereIn("_id", ids);
  };
};

export type TModelSet<T> = ReturnType<typeof modelSet<T>>;
