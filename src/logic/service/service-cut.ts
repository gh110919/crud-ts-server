import { TModel } from "../model";

export const serviceCut = async <T>({ destroy }: TModel<T>) => destroy;

export type TServiceCut<T> = ReturnType<typeof serviceCut<T>>;