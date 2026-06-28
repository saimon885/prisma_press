import { Cstatus, postStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IPostCreate, IpostUpdate } from "./post.interface";

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
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });
  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: Cstatus.APPROVED,
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    // throw new Error("fake error")
    const post = tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: Cstatus.APPROVED,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transactionResult;
};
const updatePostDB = async (
  authorId: string,
  payload: IpostUpdate,
  isAdmin: boolean,
  postId: string,
) => {
  const { title, content, tumbnail } = payload;
  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("your are not the owner of posts!");
  }
  const update = await prisma.post.update({
    where: {
      id: postId,
    },
    data: { title, content, tumbnail },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return update;
};
const deletePostDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("your are not the owner of posts!");
  }
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return null;
};

const getPostStatesDB = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPost = await tx.post.count();
    // const totallPublishedPost = await tx.post.count({
    //   where: {
    //     status: postStatus.published,
    //   },
    // });
    // const totalDraftPost = await tx.post.count({
    //   where: {
    //     status: postStatus.Draft,
    //   },
    // });
    // const totalArchivedPost = await tx.post.count({
    //   where: {
    //     status: postStatus.Archived,
    //   },
    // });
    // const totalComments = await tx.comment.count();
    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: Cstatus.APPROVED,
    //   },
    // });
    // const totalRejectComments = await tx.comment.count({
    //   where: {
    //     status: Cstatus.REJECT,
    //   },
    // });
    // // not good approach
    // // const allPost = await tx.post.findMany();
    // // const totalViews: number = 0;
    // // allPost.forEach((p) => {
    // //   totalViews = totalViews + p.views;
    // // });

    // const totalViewsAggregate = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });
    // const totalViews = totalViewsAggregate._sum.views;
    // return {
    //   totalPost,
    //   totallPublishedPost,
    //   totalDraftPost,
    //   totalArchivedPost,
    //   totalComments,
    //   totalApprovedComments,
    //   totalRejectComments,
    //   totalViews,
    // };

    const [
      totalPost,
      totallPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectComments,
      totalViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: postStatus.published,
        },
      }),
      await tx.post.count({
        where: {
          status: postStatus.Draft,
        },
      }),
      await tx.post.count({
        where: {
          status: postStatus.Archived,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: Cstatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: Cstatus.REJECT,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPost,
      totallPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectComments,
      totalViews: totalViewsAggregate._sum.views,
    };
  });
  return transactionResult;
};

export const postService = {
  createPostDB,
  getPostDB,
  getSinglePostDB,
  updatePostDB,
  deletePostDB,
  myPostDB,
  getPostStatesDB,
};
