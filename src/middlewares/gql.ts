import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { NextFunction } from "express";
import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import { resolve } from "path";
import { TypeMap } from "../assets/migrate";
import { modelSet } from "../logic/model/create";
import { modelCut } from "../logic/model/delete";
import { modelGet } from "../logic/model/read";
import { modelPut } from "../logic/model/update";
import { imports } from "./imports";

export const gql_mw = async (req: any, res: any, next: NextFunction) => {
  const crud = (table: string) => ({
    create: `create_${table}`,
    read: `read_${table}`,
    update: `update_${table}`,
    destroy: `delete_${table}`,
  });

  const types = (type?: string) => {
    return {
      input: `${type}Input`,
      output: `${type}Output`,
    };
  };

  const apollo = new ApolloServer({
    typeDefs: mergeTypeDefs([
      readFileSync(resolve(__dirname, "../assets/migrate.gql"), "utf-8"),
      imports.endpoints.map(({ table, type }) => {
        return () => gql`
        type Query {
            ${crud(table).read}(input:${types(type).input}):[${types(type).output}]
        }
    
        type Mutation {
            ${crud(table).create}(input:${types(type).input}):[${types(type).output}]
            ${crud(table).update}(input:${types(type).input}):[${types(type).output}]
            ${crud(table).destroy}(input:${types(type).input}):[${types(type).output}]
        }
        `;
      }),
    ]),
    resolvers: mergeResolvers(
      imports.endpoints.map(({ table, type }) => {
        const typename = type as keyof TypeMap;
        type TType = TypeMap[typeof typename];

        return {
          Query: {
            [crud(table).read]: async (
              _: any,
              args: {
                input: TType;
              },
              __: any
            ) => {
              const сlosure = await modelGet(table);
              const query = { ...args.input, filtering: true };
              const { payload } = await сlosure({ query });
              return payload;
            },
          },
          Mutation: {
            [crud(table).create]: async (
              _: any,
              args: { input: TType },
              __: any
            ) => {
              const сlosure = await modelSet(table);
              return await сlosure({ body: [args.input] });
            },
            [crud(table).update]: async (
              _: any,
              args: { input: TType },
              __: any
            ) => {
              const { _id } = args.input;
              const сlosure = await modelPut(table);
              return await сlosure({ query: { _id }, body: args.input });
            },
            [crud(table).destroy]: async (
              _: any,
              args: { input: TType },
              __: any
            ) => {
              const { _id } = args.input;
              const сlosure = await modelCut(table);
              return await сlosure({ query: { _id } });
            },
          },
        };
      })
    ),
  });

  await apollo.start();

  return expressMiddleware(apollo)(req, res, next);
};
