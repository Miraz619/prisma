import Stripe from "stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const userId = session.metadata?.userId;

  const stripeCustomerId =
    session.customer as string;

  const stripeSubscriptionId =
    session.subscription as string;

  if (
    !userId ||
    !stripeCustomerId ||
    !stripeSubscriptionId
  ) {
    return;
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(
      stripeSubscriptionId,
    );

  const currentPeriodEndInSeconds =
    stripeSubscription.items.data[0]
      ?.current_period_end;

  if (!currentPeriodEndInSeconds) {
    return;
  }

  const currentPeriodEnd = new Date(
    currentPeriodEndInSeconds * 1000,
  );

  await prisma.subscription.upsert({
    where: {
      userId,
    },

    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd,
    },

    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd,
    },
  });
};