import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";

export const Auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      console.log(token);
      if (!token) {
        return res.status(httpstatus.UNAUTHORIZED).json({
          success: false,
          message: "No token provided",
        });
      }
      const deccoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
      if (!deccoded) {
        return res.status(httpstatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid token",
        });
      }
      const user = await prisma.user.findUnique({
        where: {
          email: deccoded.email,
        },
      });
      if (!user) {
        return res.status(httpstatus.UNAUTHORIZED).json({
          success: false,
          message: "User not found",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};
