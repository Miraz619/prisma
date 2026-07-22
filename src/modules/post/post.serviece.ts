import { title } from "node:process";
import { CommentStatus, Poststatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePostPayload,
} from "./post.interface";
import { PostWhereInput } from "../../../generated/prisma/models";



const createPost= async(payload:ICreatePostPayload, userId:string)=>{


const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  });

  if (
    payload.isPremium &&
    user.subscription?.status !== "ACTIVE"
  ) {
    throw new Error(
      "You are not a premium user. So you cannot create premium content",
    );
  }

    const result=await prisma.post.create({

        data:{
            ...payload,
            authorId: userId
        }
    })


return result
}


// const getAllPosts=async()=>{

//     const result= await prisma.post.findMany({
//        where:{
        
//         OR:[
//           {
//           title: {
//             contains: "ronaldo",
//             mode: "insensitive",
//           },
//         },
//           {
//           content: {
//           contains:"ronaldo",
//           mode:"insensitive"
//         }
//           } ,

//         ]
       
      
//        },

//         include:{
//             author:{
//                 omit:{
//                     password:true
//                 },
//             },

//             comments:true
//         },
//     })

//     return result
// }

// const getPostById = async (postId: string) => {
//   const result = await prisma.post.findUniqueOrThrow({
//     where: {
//       id: postId,
//     },
//     include: {
//       author: {
//         omit: {
//           password: true,
//         },
//       },
//       comments: true,
//       _count: {
//         select: {
//           comments: true,
//         },
//       },
//     },
//   });

//   return result;
// };

// const getAllPosts = async () => {
//   const page = 2;
//   const limit = 5;

//   const skip = (page - 1) * limit;

//   const result = await prisma.post.findMany({
//     skip,
//     take: limit,
//    orderBy: {
//     createdAt: "desc"
//    },
//     include: {
//       author: {
//         omit: {
//           password: true,
//         },
//       },
//       comments: true,
//     },
//   });

//   return result;
// };
// const getAllPosts = async () => {
//   const page = 1;
//   const limit = 5;

//   const skip = (page - 1) * limit;

//   const posts = await prisma.post.findMany({
//     skip,
//     take: limit,

//     orderBy: {
//       createdAt: "desc",
//     },

//     include: {
//       author: {
//         omit: {
//           password: true,
//         },
//       },
//       comments: true,
//     },
//   });

//   const total = await prisma.post.count();

//   const totalPages = Math.ceil(total / limit);

//   return {
//     data: posts,
//     meta: {
//       page,
//       limit,
//       total,
//       totalPages,
//     },
//   };
// };

  const getAllPosts = async (query: IPostQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;

    const skip = (page - 1) * limit;

    const sortBy = query.sortBy
      ? query.sortBy
      : "createdAt";

    const sortOrder = query.sortOrder
      ? query.sortOrder
      : "desc";

    const andConditions: PostWhereInput[] = [];

    if (query.searchTerm) {
      andConditions.push({
        OR: [
          {
            title: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (query.title) {
      andConditions.push({
        title: query.title,
      });
    }

    if (query.content) {
      andConditions.push({
        content: query.content,
      });
    }

    if (query.authorId) {
      andConditions.push({
        authorId: query.authorId,
      });
    }

    if (query.status) {
      andConditions.push({
        status: query.status,
      });
    }
  andConditions.push({
    isPremium: false,
  });
    const posts = await prisma.post.findMany({
      where: {
        AND: andConditions,
      },

      take: limit,
      skip,

      orderBy: {
        [sortBy]: sortOrder,
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

    const totalPostCount = await prisma.post.count({
      where: {
        AND: andConditions,
      },
    });

    return {
      data: posts,
      meta: {
        page,
        limit,
        total: totalPostCount,
        totalPages: Math.ceil(totalPostCount / limit),
      },
    };
  };
const getPostById=async(postId: string)=>{


const transactionResult =await prisma.$transaction(
  async(tx)=>{

     await tx.post.update({
      
      where: {
        id:postId,
        isPremium: false,
      },
      data: {
        views:{
          increment: 1,
        },
      },

     })

    //  throw new Error("Fake error");

  const post=await tx.post.findFirstOrThrow({

    where:{
      id: postId
    },
    include:{

      author:{
        omit: {
          password:true
        }
      },

      comments: true,
      _count: {
            select: {
              comments: true,
            },
          },

    }
  })

  return post;

  }
);
 return transactionResult;
}


const getMyPosts = async (userId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: userId,
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
    },
  });

  return result;
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });


  if(!isAdmin && authorId!==post.authorId){
   throw new Error("You are not the owner of this post!")
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
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

const deletePost=async(postId:string,authorId:string, isAdmin:boolean)=>{
     
  const post=await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    }
  })

   

  if(!isAdmin &&  authorId!==post.authorId){
    throw new Error("you cant delete this post");
  }

  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return result;
}

const getPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      tx.post.count(),

      tx.post.count({
        where: {
          status: Poststatus.PUBLISHED,
        },
      }),

      tx.post.count({
        where: {
          status: Poststatus.DRAFT,
        },
      }),

      tx.post.count({
        where: {
          status: Poststatus.ARCHIVED,
        },
      }),

      tx.comment.count(),

      tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),

      tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),

      tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViews: totalPostViewsAggregate._sum.views ?? 0,
    };
  });

  return transactionResult;
};

const getPremiumPosts = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;

  const skip = (page - 1) * limit;

  const sortBy = query.sortBy
    ? query.sortBy
    : "createdAt";

  const sortOrder = query.sortOrder
    ? query.sortOrder
    : "desc";

  const andConditions: PostWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({
      title: query.title,
    });
  }

  if (query.content) {
    andConditions.push({
      content: query.content,
    });
  }

  if (query.authorId) {
    andConditions.push({
      authorId: query.authorId,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  andConditions.push({
    isPremium: true,
  });

  const posts = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip,

    orderBy: {
      [sortBy]: sortOrder,
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

  const totalPostCount = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: posts,
    meta: {
      page,
      limit,
      total: totalPostCount,
      totalPages: Math.ceil(totalPostCount / limit),
    },
  };
};
export const postService={
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getPostsStats,
    getPremiumPosts
}