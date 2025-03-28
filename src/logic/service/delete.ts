import { TModel } from "../model";

export const serviceCut = async <T>({ destroy }: TModel<T>) => destroy;
