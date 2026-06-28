import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.id;
  const result = await commentService.createCommentDB(req.body, authorId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment Created successfull",
    data: result,
  });
});
const getAuthorComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  const result = await commentService.getAuthorCommentDB(authorId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment retrive successfull",
    data: result,
  });
});
const getSingleComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const result = await commentService.getSingleCommentDB(commentId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment Retrive successfull",
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.id;
  const commentId = req.params.commentId;
  const result = await commentService.updateCommentDB(
    commentId as string,
    req.body,
    authorId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment Update successfull",
    data: result,
  });
});
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.id;
  const commentId = req.params.commentId;
  const result = await commentService.deleteCommentDB(
    commentId as string,
    authorId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment Delete successfull",
    data: null,
  });
});
const updateModarateComment = catchAsync(
  async (req: Request, res: Response) => {
    const author = req.user;
    const isAdmin = author.role === "ADMIN";
    const commentId = req.params.commentId;
    const result = await commentService.updateModarateCommentDB(
      commentId as string,
      req.body,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment update successfull",
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  getAuthorComment,
  getSingleComment,
  updateComment,
  deleteComment,
  updateModarateComment,
};
