import { TModel } from "../model";

export const serviceGet = async <T>({ read }: TModel<T>) => read;
