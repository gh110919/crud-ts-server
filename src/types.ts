import { ParamsDictionary, Request } from "express-serve-static-core";
import { ParsedQs } from "qs";

export type TypeArrayNull<T> = T | T[] | null;

export type TCreate<T> = {
  payload: T;
};

export type TPagination = { limit?: number; offset?: number };

export type TSorting = { sortBy?: string; order?: "asc" | "desc" };

export type TFilters = {
  [key: string]: string | number | boolean | Array<string | number> | undefined;
};

export type TRequest = {
  params: ParamsDictionary;
  query: ParsedQs;
  body: Request["body"];
};

export type TFPS = {
  filters?: TFilters;
  pagination?: TPagination;
  sorting?: TSorting;
};

export type TRead = Partial<TFPS & TRequest>;

export type TUpdate<T> = {
  id: string;
  payload: T;
};

export type TDelete = {
  id: string;
};

export type TReadReturn<T> =
  | { payload: TypeArrayNull<T>; total: number }
  | TypeArrayNull<T>;
