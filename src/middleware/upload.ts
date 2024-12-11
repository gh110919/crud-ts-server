import { Request, Response } from "express";
import { diskStorage } from "multer";
import { basename } from "path";
import { v4 } from "uuid";
import { orm } from "./orm";

export const upload = async (req: Request, res: Response) => {
  const multer = (await import("multer")).default;

  try {
    const uploadMiddleware = multer({
      storage: diskStorage({
        destination: (_, __, cb) => {
          cb(null, "src/backend/uploads");
        },

        filename: (_, { originalname }, cb) => {
          const sanitizedFilename = originalname.replace(/ /g, "_");
          cb(null, `${v4()}_${basename(sanitizedFilename)}`);
        },
      }),
    }).array("files");

    uploadMiddleware(req, res, async (err: any) => {
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

      for (const file of files) {
        const insertFile = {
          id: v4(),
          url: `${req.protocol}://${req.get("host")}/api/public/${
            file.filename
          }`,
          upload_date: orm.fn.now(),
          ...file,
        };

        await orm("files").insert(insertFile);

        filesData.push(insertFile);
      }

      res.status(200).json({
        success: true,
        message: "Файлы успешно загружены и данные о них внесены в базу данных",
        files: filesData,
      });
    });
  } catch (error) {
    console.log("Произошла ошибка при загрузке файлов:", error);
    res.status(500).json({
      success: false,
      message: `Исключение при загрузке файлов: ${error}`,
    });
  }
};
