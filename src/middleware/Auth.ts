import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";
import { sendResponse } from "../utils/sendResponse";

export const Auth = (...requireRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer")
          ? req.headers.authorization?.split(" ")[1]
          : req.headers.authorization;
      console.log(req.headers.authorization);
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
      if (requireRoles.length && !requireRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden. You dont have permisson to access this resource.",
        });
      }
      // if (!user?.activeStatus === "INACTIVE") {
      //   throw new Error("Your account has been blocked");
      // }

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
