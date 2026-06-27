import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const result = await postService.createPostDB(req.body, id);
  sendResponse(res, {
    success: true,
    message: "post Create successfully",
    statusCode: httpStatus.CREATED,
    data: result,
  });
});

const getpost = catchAsync(async (req: Request, res: Response) => {
  const result = await postService.getPostDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "all post retrive successfull.",
    data: { result },
  });
});

const myPosts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await postService.myPostDB(userId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "this is your all post successful",
    data: {
      result,
    },
  });
});

const getSinglePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  if (!postId) {
    throw new Error("postId not found!");
  }
  const result = await postService.getSinglePostDB(postId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "post retrive successfull.",
    data: result,
  });
});
const getPostStates = catchAsync((req: Request, res: Response) => {});

const updatePost = catchAsync((req: Request, res: Response) => {});
const deletePost = catchAsync((req: Request, res: Response) => {});

export const postController = {
  createPost,
  myPosts,
  getpost,
  getSinglePost,
  updatePost,
  deletePost,
  getPostStates,
};
