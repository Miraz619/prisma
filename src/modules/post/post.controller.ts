import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendRespnse } from "../../utils/sendResponse";
import { postService } from "./post.serviece";
import { Role } from "../../../generated/prisma/enums";


const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await postService.createPost(
      payload,
      userId as string
    );

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: result,
    });
  }
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Posts retrieved successfully",
      data: result,
    });
  }
);

const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    const result = await postService.getPostById(postId as string);

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post retrieved successfully",
      data: result,
    });
  }
);

const getMyPosts=catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
    const userId=req.user?.id
    const result=await postService.getPostById(userId as string)

      sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My posts retrieved successfully",
      data: result,
    });
})

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const payload = req.body;

    const authorId = req.user?.id;
    const isAdmin = req.user?.role === Role.ADMIN;

    const result = await postService.updatePost(
      postId as string,
      payload,
      authorId as string,
      isAdmin
    );

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post updated successfully",
      data: result,
    });
  }
);

const deletePost=catchAsync(async(req:Request,res: Response, next:NextFunction)=>{

      const postId=req.params.postId;
      const authorId=req.user?.id;
      const isAdmin=req.user?.role===Role.ADMIN;

      const result=await postService.deletePost(
        postId as string,
        authorId as string,
        isAdmin
      )
   sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post deleted successfully",
      data: result,
    });
     

})

const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostsStats();

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post statistics retrieved successfully",
      data: result,
    });
  }
);
export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getPostsStats
};