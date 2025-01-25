import { Request, Response } from "express";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { orm } from "../orm";

const { URL, REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } = config({
  path: ".local/.env",
}).parsed!;

export const purge = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Идентификатор файла не предоставлен",
    });
  }

  try {
    const file = await orm.filtering("files", { id }).then((data) => data[0]);

    if (!file) {
      res.status(404).json({
        success: false,
        message: "Файл не найден в базе данных",
      });
    }

    const key = file.url.split(`${BUCKET_NAME}/`)[1];

    const deleteParams = {
      Bucket: BUCKET_NAME!,
      Key: key,
    };

    await new S3Client({
      region: REGION,
      endpoint: URL,
      credentials: {
        accessKeyId: ACCESS_KEY_ID!,
        secretAccessKey: SECRET_ACCESS_KEY!,
      },
    }).send(new DeleteObjectCommand(deleteParams));

    await orm.delete("files", { id });

    res.status(200).json({
      success: true,
      message:
        "Файл успешно удален из S3 и записи о нем удалены из базы данных",
    });
  } catch (error) {
    console.log("Произошла ошибка при удалении файла:", error);
    
    res.status(500).json({
      success: false,
      message: `Исключение при удалении файла: ${error}`,
    });
  }
};
