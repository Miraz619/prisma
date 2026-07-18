

import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload, IUpdateCommentPayload } from "./comment.interface";

const createComment = async (
  payload: ICreateCommentPayload,
  authorId: string
) => {
  const result = await prisma.comment.create({
    data: {
      postId: payload.postId,
      content: payload.content,
      authorId,
    },
  });

  return result;
};
const getCommentsByAuthorId = async (authorId: string) => {

    if(!authorId){
        throw new Error("provide author id");
    }
   
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
  });

  return result;
};

const getCommentsByPostId = async (postId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      postId,
    },
  });

  return result;
};

const updateComment = async (
  commentId: string,
  data: IUpdateCommentPayload,
  authorId: string,
) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  const comment = await prisma.comment.update({
    where: {
      id: commentData.id,
    },
    data,
  });

  return comment;
};


const deleteComment = async (
  commentId: string,
  authorId: string,
) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  const comment = await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });

  return comment;
};
export const commentService = {
  createComment,
  getCommentsByAuthorId,
  getCommentsByPostId,
  updateComment,
  deleteComment
};