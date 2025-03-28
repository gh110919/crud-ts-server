import { readFile, writeFile } from "fs/promises";
import { Req } from "../types";
import { toPascalCase } from "../middlewares/migrate";

const gqlTypeMap: { [key: string]: string } = {
  string: "String",
  number: "Int",
  boolean: "Boolean",
  foreign: "String",
  timestamp: "String",
};

const generateFieldsContent = (fields: Record<string, string>) => {
  return Object.entries(fields)
    .map(([fieldName, fieldType]) => {
      const sanitizedName = fieldName.replace(/\./g, "_");

      const gqlType = gqlTypeMap[fieldType] || "String";
      return `  ${sanitizedName}: ${gqlType}`;
    })
    .join("\n");
};

const generateType = (table: string, fields: Record<string, string>) => {
  const typeName = toPascalCase(table);
  return `type ${typeName}Output {\n${generateFieldsContent(fields)}\n}`;
};

const generateInputType = (table: string, fields: Record<string, string>) => {
  const inputName = toPascalCase(table);
  return `input ${inputName}Input {\n${generateFieldsContent(fields)}\n}`;
};

export const appendGqlTypes = async (req: Req) => {
  try {
    await readFile("src/assets/migrate.gql", "utf-8");
    
    const generatedTypes = req.body.create
      .map(({ table, fields }) => {
        const typeDef = generateType(table, fields);
        const inputDef = generateInputType(table, fields);
        return `${typeDef}\n\n${inputDef}`;
      })
      .join("\n\n");

    await writeFile("src/assets/migrate.gql", generatedTypes, "utf-8");

    console.log("GQL типы и инпуты успешно обновлены");
  } catch (error) {
    throw new Error(String(error));
  }
};
