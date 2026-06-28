import { Cstatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IpostComment } from "./comment.interface";

const createCommentDB = async (payload: IpostComment, authorID: string) => {
  const { content, postId } = payload;
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  const createComment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: authorID,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      post: true,
    },
  });
  return createComment;
};
const getAuthorCommentDB = async (authorId: string) => {
  const comment = await prisma.comment.findMany({
    where: {
      authorId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
  return comment;
};
const getSingleCommentDB = async (commentId: string) => {
  const result = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });
  return result;
};
const updateCommentDB = async (
  commentId: string,
  payload: { content: string },
  authorId: string,
) => {
  const { content } = payload;
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });
  if (comment.authorId !== authorId) {
    throw new Error("Your are not a owner of comments!");
  }
  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
    },
  });
  return result;
};

const deleteCommentDB = async (commentId: string, authorId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });
  if (comment.authorId !== authorId) {
    throw new Error("You are not owner of comments!");
  }
  const result = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
  return result;
};
const updateModarateCommentDB = async (
  commentId: string,
  payload: { status?: Cstatus },
  isAdmin: boolean,
) => {
  const { status } = payload;
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });
  if (!isAdmin) {
    throw new Error("you are not owner of comments update method!");
  }
  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status,
    },
  });
  return result;
};

export const commentService = {
  createCommentDB,
  getAuthorCommentDB,
  getSingleCommentDB,
  updateCommentDB,
  deleteCommentDB,
  updateModarateCommentDB,
};
