import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";

export const catchAsync = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to login user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      next(error);
    }
  };
};
