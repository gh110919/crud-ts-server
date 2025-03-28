import { request, response } from "express";

export type Req = typeof request;
export type Res = typeof response;

export type TCreate<T> = {
  body: T;
};

export type TRead = {
  query: Partial<{
    filtering: boolean;
    [key: string]: any;
    sorting: boolean;
    by: string;
    order: string;
    pagination: boolean;
    limit: number;
    offset: number;
  }>;
};

export type TUpdate<T> = {
  query: Req["query"];
  body: T;
};

export type TDestroy = {
  query: Req["query"];
};

export type Meta = {
  table: { name: string; size: number };
  filtering?: object;
  sorting: { by?: string; order?: string };
  pagination: { limit?: number; offset?: number };
  count: number;
};

export type TReadReturn<T> = {
  meta: Meta;
  payload: T[];
};
