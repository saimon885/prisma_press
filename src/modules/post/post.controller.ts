import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createPost = catchAsync((req: Request, res: Response) => {});
const getpost = catchAsync((req: Request, res: Response) => {});
const getSinglePost = catchAsync((req: Request, res: Response) => {});
const updatePost = catchAsync((req: Request, res: Response) => {});

export const postController = {
  createPost,
  getpost,
  getSinglePost,
  updatePost,
};
