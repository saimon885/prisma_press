import { Response } from "express";

type Tmeta = {
  page: number;
  limit: number;
  total: number;
};
type TresponseType<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Tmeta;
};

export const sendResponse = <T>(res: Response, data: TresponseType<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
