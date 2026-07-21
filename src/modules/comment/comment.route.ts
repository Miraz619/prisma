


import express from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { commentController } from "./comment.controller";

const router = express.Router();

router.post(
  "/",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  commentController.createComment,
);
router.get(
  "/author/:authorId",
  commentController.getCommentsByAuthorId,
);

router.get(
  "/post/:postId",
  commentController.getCommentsByPostId,
);

router.patch(
  "/:commentId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  commentController.updateComment,
);

router.delete(
  "/:commentId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  commentController.deleteComment,
);

router.put(
  "/:commentId/moderate",
  auth(Role.ADMIN),
  commentController.moderateComment,
);
export const commentRouter = router;