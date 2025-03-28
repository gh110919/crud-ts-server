import { readFile, writeFile } from "fs";
import { Req } from "../types";
import { toCamelCase } from "../middlewares/migrate";

const typeMap: { [key: string]: string } = {
  string: "string",
  number: "number",
  boolean: "boolean",
  foreign: "string",
  timestamp: "string",
};

export const appendTsTypes = async (req: Req) => {
  readFile("src/assets/migrate.d.ts", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const existingTypes = new Set(
      data
        .match(/export\s+type\s+([a-zA-Z0-9]+)/g)
        ?.map((match) => match.split(" ")[2])
        .filter((name) => name !== "TypeMap") || []
    );

    const typesToGenerate = req.body.create.map(({ table }) => {
      return `${table.charAt(0).toUpperCase()}${toCamelCase(table.slice(1))}`;
    });

    let fileContent = data;

    typesToGenerate.forEach((typeName: any) => {
      const typeRegex = new RegExp(
        `export\\s+type\\s+${typeName}\\s+=\\s+\\{[^}]*\\};`,
        "g"
      );
      fileContent = fileContent.replace(typeRegex, "");
    });

    const typeMapRegex = /export\s+type\s+TypeMap\s+=\s*\{[^}]*\}\s*;\s*/g;
    fileContent = fileContent.replace(typeMapRegex, "");

    const uniqueTypes = new Set<string>();
    const types = req.body.create
      .map(({ table, fields }) => {
        const typeName = `${table.charAt(0).toUpperCase()}${toCamelCase(
          table.slice(1)
        )}`;

        if (existingTypes.has(typeName) || uniqueTypes.has(typeName)) {
          console.log(`Type ${typeName} уже существует или дублируется`);
          return "";
        }

        uniqueTypes.add(typeName);

        const fieldEntries = Object.entries(fields)
          .map(
            ([name, type]: any) =>
              `  ${name.replace(/\./g, "_")}: ${typeMap[type] || "any"};`
          )
          .join("\n");

        return `export type ${typeName} = {\n${fieldEntries}\n};`;
      })
      .filter((type: string) => type !== "");

    const remainingExistingTypes = new Set(
      [...existingTypes].filter((type) => !typesToGenerate.includes(type))
    );
    const allTypeNames = [...remainingExistingTypes, ...uniqueTypes];

    const typeMapContent = allTypeNames
      .map((typeName) => `  ${typeName}: ${typeName};`)
      .join("\n");

    const newTypes = types.join("\n\n");
    const newTypeMap = `export type TypeMap = {\n${typeMapContent}\n};`;

    const finalContent = [fileContent.trim(), newTypes, newTypeMap].join(
      "\n\n"
    );

    writeFile("src/assets/migrate.d.ts", finalContent, "utf8", (err) => {
      if (err) {
        console.error("Ошибка записи файла:", err);
        return;
      }
      console.log("Типы успешно добавлены");
    });
  });
};
