import { TModel } from "../model";

export const serviceSet = async <T>({ create }: TModel<T>) => create;

export type TServiceSet<T> = ReturnType<typeof serviceSet<T>>;