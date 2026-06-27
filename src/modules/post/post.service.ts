import { prisma } from "../../lib/prisma";
import { IPostCreate } from "./post.interface";

const createPostDB = async (payload: IPostCreate, userId: string) => {
  const { title, content, tumbnail, tags } = payload;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      tumbnail,
      tags,
      authorId: userId,
    },
    include: {
      author: true,
    },
  });
  return result;
};

const getPostDB = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return result;
};

const myPostDB = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

const getSinglePostDB = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};
const updatePostDB = () => {};
const deletePostDB = () => {};

export const postService = {
  createPostDB,
  getPostDB,
  getSinglePostDB,
  updatePostDB,
  deletePostDB,
  myPostDB,
};
