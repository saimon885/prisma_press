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

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.id;
  const postId = req.params.postId;
  const isAdmin = req.user.role === "ADMIN";
  const payload = req.body;
  const result = await postService.updatePostDB(
    authorId,
    payload,
    isAdmin,
    postId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "post retrive successfull.",
    data: result,
  });
});
const deletePost = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.id;
  const postId = req.params.postId;
  if (!postId) {
    throw new Error("please added the postId!");
  }
  const isAdmin = req.user.role === "ADMIN";
  const result = await postService.deletePostDB(
    postId as string,
    authorId,
    isAdmin,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "post delete successfull.",
    data: null,
  });
});
const getPostStates = catchAsync(async (req: Request, res: Response) => {
  const result = await postService.getPostStatesDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "all States retrive successfull",
    data: result,
  });
});

export const postController = {
  createPost,
  myPosts,
  getpost,
  getSinglePost,
  updatePost,
  deletePost,
  getPostStates,
};
