import { TModel } from "../model";

export const servicePut = async <T>({ update }: TModel<T>) => update;

export type TServicePut<T> = ReturnType<typeof servicePut<T>>;