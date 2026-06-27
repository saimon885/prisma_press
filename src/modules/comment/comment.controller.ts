import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync((req: Request, res: Response) => {});
const getAuthorComment = catchAsync((req: Request, res: Response) => {});
const getSingleComment = catchAsync((req: Request, res: Response) => {});
const updateComment = catchAsync((req: Request, res: Response) => {});
const deleteComment = catchAsync((req: Request, res: Response) => {});
const updateModarateComment = catchAsync((req: Request, res: Response) => {});

export const commentController = {
  createComment,
  getAuthorComment,
  getSingleComment,
  updateComment,
  deleteComment,
  updateModarateComment,
};
