
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendRespnse } from "../../utils/sendResponse";
import { commentService } from "./comment.service";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    const result = await commentService.createComment(
      req.body,
      authorId as string,
    );

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully",
      data: result,
    });
  },
);

const getCommentsByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorId } = req.params;
     console.log(authorId);
    const result =
      await commentService.getCommentsByAuthorId(authorId as string);

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments retrieved successfully",
      data: result,
    });
  },
);

const getCommentsByPostId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const result =
      await commentService.getCommentsByPostId(postId as string);

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments retrieved successfully",
      data: result,
    });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const authorId = req.user?.id as string;
    const payload = req.body;

    const result = await commentService.updateComment(
      commentId as string,
      payload,
      authorId,
    );

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment updated successfully",
      data: result,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const authorId = req.user?.id as string;

    const result = await commentService.deleteComment(
      commentId as string,
      authorId,
    );

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment deleted successfully",
      data: result,
    });
  },
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    const result = await commentService.moderateComment(
      commentId as string,
      req.body,
    );

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment moderated successfully",
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  getCommentsByAuthorId,
  getCommentsByPostId,
  updateComment,
  deleteComment,
  moderateComment
};