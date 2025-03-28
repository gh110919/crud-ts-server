import { Res } from "../../types";

export const responder = async <T>(res: Res, data: Promise<T>): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: await data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Исключение рест-сервера",
    });

    throw new Error(String(error));
  }
};
