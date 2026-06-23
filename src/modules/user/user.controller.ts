import { Request, Response } from "express";
import httpstatus from "http-status";
import { userServices } from "./user.service";
const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await userServices.registerUserDB(req.body);
    res.status(httpstatus.CREATED).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to register user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await userServices.loginUserDB(req.body);
    res.status(httpstatus.OK).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to login user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const userController = {
  registerUser,
  loginUser,
};
