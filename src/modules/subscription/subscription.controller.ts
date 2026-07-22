

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendRespnse } from "../../utils/sendResponse";
import { subscriptionServices } from "./subscription.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const userId = req.user?.id;

    const result =
      await subscriptionServices.createCheckoutSession(
        userId as string,
      );

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {

    console.log("Webhook controller reached");
console.log("Is Buffer:", Buffer.isBuffer(req.body));
console.log(
  "Has signature:",
  Boolean(req.headers["stripe-signature"]),
);
    const event = req.body as Buffer;

    const signature =
      req.headers["stripe-signature"]!;

    await subscriptionServices.handleWebhook(
      event,
      signature as string,
    );

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Webhook triggered successfully",
      data: null,
    });
  },
);


const getSubscriptionStatus = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user?.id;

    const result =
      await subscriptionServices.getSubscriptionStatus(
        userId as string,
      );

    sendRespnse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:
        "Subscription status retrived successfully",
      data: result,
    });
  },
);
export const subscriptionController = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus
};