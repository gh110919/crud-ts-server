import { orm } from "../../middlewares/orm";
import { TUpdate } from "../../types";

export const modelPut = async <T>(table: string) => {
  return async ({ query, body }: TUpdate<T>): Promise<T[]> => {
    await orm.upgrade(
      table,
      { ...query },
      { ...body, _updated_at: orm.fn.now() }
    );

    return await orm.filtering(table, { ...query });
  };
};
