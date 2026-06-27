import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userServices.registerUserDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  // const { accessToken } = req.cookies;
  const user = req.user;
  // console.log(accessToken);
  // const veryfiedToken = jwtUtils.verifyToken(
  //   accessToken,
  //   config.jwt_access_secret as string,
  // );
  // if (typeof veryfiedToken === "string") {
  //   throw new Error("Invalid token");
  // }
  const userProfile = await userServices.getUserProfileDB(user?.id);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Profile retrieved successfully",
    data: userProfile,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const result = await userServices.updateProfileDB(req.body, id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "User update successfully",
    data: { result },
  });
});

export const userController = {
  registerUser,
  getProfile,
  updateProfile,
};
