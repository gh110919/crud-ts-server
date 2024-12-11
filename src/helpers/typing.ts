import { TMigrate, toCamelCase } from "./migrate";

const typeMap: { [key: string]: string } = {
  string: "string",
  integer: "number",
  boolean: "boolean",
  foreign: "string",
  timestamp: "Date",
};

export const typing = (migrations: TMigrate[]): string => {
  const types: string[] = migrations.map(({ table, fields }) => {
    const typeName = `T${table.charAt(0).toUpperCase()}${toCamelCase(table.slice(1))}`;

    const fieldEntries = Object.entries(fields)
      .map(
        ([name, type]) =>
          `${name.replace(/\./g, "_")}:${typeMap[type] || "any"};`,
      )
      .join("");

    return `export type ${typeName}={${fieldEntries}};`;
  });

  const typeMapEntries = migrations
    .map(({ table }) => {
      const typeName = `T${table.charAt(0).toUpperCase()}${toCamelCase(table.slice(1))}`;
      return `${typeName}:${typeName};`;
    })
    .join("");

  types.push(`export type TypeMap={${typeMapEntries}};`);

  return types.join("");
};
