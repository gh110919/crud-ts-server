import { TModel } from "../model";

export const serviceSet = async <T>({ create }: TModel<T>) => create;
