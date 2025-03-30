import { orm } from "../../middlewares/orm";
import { TDestroy } from "../../types";

export const modelCut = async <T>(table: string) => {
  return async ({ query }: TDestroy): Promise<T[]> => {
    const item = await orm.filtering(table, { ...query });

    await orm.destroy(table, { ...query });

    return item;
  };
};

export type TModelCut<T> = ReturnType<typeof modelCut<T>>;
