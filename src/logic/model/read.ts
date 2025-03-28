import { connection, orm } from "../../middlewares/orm";
import { TRead, TReadReturn } from "../../types";

export const modelGet = async <T>(table: string) => {
  return async ({ query }: TRead): Promise<TReadReturn<T>> => {
    const {
      filtering,
      sorting,
      pagination,
      by,
      order,
      limit,
      offset,
      ...other
    } = query!;

    try {
      let builder = connection(table);

      if (filtering) {
        builder = builder.where(other);
      }

      if (sorting && by && order) {
        builder = builder.orderBy(by, order);
      }

      if (pagination && limit && offset) {
        builder = builder.limit(limit).offset(offset);
      }

      const [payload, size] = await Promise.all([builder, orm.count(table)]);

      return {
        meta: {
          table: { name: table, size },
          filtering: other,
          sorting: { by, order },
          pagination: { limit, offset },
          count: payload.length,
        },
        payload,
      };
    } catch (error) {
      throw new Error(String(error));
    }
  };
};
