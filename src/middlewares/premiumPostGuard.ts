
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../generated/prisma/enums";

export const premiumPostGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  const subscription =
    await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

  const isActive =
    subscription?.status === SubscriptionStatus.ACTIVE &&
    subscription.currentPeriodEnd > new Date();

  if (!isActive) {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message:
        "You need an active subscription to access premium posts",
    });

    return;
  }

  next();
};