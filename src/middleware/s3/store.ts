import { Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { v4 } from "uuid";
import { config } from "dotenv";
import { orm } from "../orm";

const { URL, REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } = config({
  path: ".local/.env",
}).parsed!;

export const store = async (req: Request, res: Response) => {
 
  multer({
    storage: multer.memoryStorage(),
  }).array("files")(req, res, async (err: any) => {
    if (err) {
      console.log("Ошибка при загрузке файлов:", err);
      return res.status(500).json({
        success: false,
        message: `Ошибка при загрузке файлов: ${err.message}`,
      });
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      console.log("Файлы не были загружены");

      return res.status(400).json({
        success: false,
        message: "Файлы не были загружены",
      });
    }

    const filesData: any = [];

    try {
      for (const file of files) {
        const id = v4();
        
        const key = `${id}_${file.originalname}`;

        const uploadParams = {
          Bucket: BUCKET_NAME!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        await new S3Client({
          region: REGION,
          endpoint: URL,
          credentials: {
            accessKeyId: ACCESS_KEY_ID!,
            secretAccessKey: SECRET_ACCESS_KEY!,
          },
        }).send(new PutObjectCommand(uploadParams));

        const { buffer, stream, destination, filename, path, ...other } = file;

        const fileData = {
          id,
          url: `${URL}/${BUCKET_NAME}/${key}`,
          upload_date: new Date().toISOString(),
          ...other,
        };

        await orm.create("files", fileData);

        filesData.push(fileData);
      }

      res.status(200).json({
        success: true,
        message:
          "Файлы успешно загружены в S3 и данные о них внесены в базу данных",
        files: filesData,
      });
    } catch (error) {
      console.log("Произошла ошибка при загрузке файлов:", error);
      res.status(500).json({
        success: false,
        message: `Исключение при загрузке файлов: ${error}`,
      });
    }
  });
};
