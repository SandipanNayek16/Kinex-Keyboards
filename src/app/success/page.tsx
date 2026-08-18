import type { Metadata } from "next";
import Link from "next/link";
import {
  LuCheck,
  LuChevronRight,
  LuCircleHelp,
  LuMail,
  LuPackageCheck,
  LuPackageOpen,
} from "react-icons/lu";

import { Logo } from "@/components/Logo";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Thank you for your purchase. Your Mecha 16 order has been confirmed.",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Lazily initialise Stripe only when needed to avoid throwing at module load
 * if STRIPE_SECRET_KEY is not set.
 */
async function retrieveSession(sessionId: string) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  // Dynamic import avoids top-level Stripe instantiation
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-07-30.basil" });
  return stripe.checkout.sessions.retrieve(sessionId);
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  // ─── No session ID ────────────────────────────────────────────────────────
  if (!sessionId) {
    return <ErrorView message="No order session found." />;
  }

  // ─── Retrieve session ─────────────────────────────────────────────────────
  let session: Awaited<ReturnType<typeof retrieveSession>>;
  try {
    session = await retrieveSession(sessionId);
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    return <ErrorView message="Could not load order details. Please contact support." />;
  }

  const orderDetails = {
    sessionId: session.id,
    customerEmail: session.customer_details?.email || "",
    amount: session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : "",
    paymentStatus: session.payment_status,
  };

  // ─── Success view ─────────────────────────────────────────────────────────
  return (
    <div className="relative mt-16 min-h-screen bg-[#f5f5f7]">
      <FadeIn
        targetChildren
        className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center bg-[#0a0a0d]">
            <LuCheck className="size-8 text-[#00d4ff]" aria-hidden="true" />
          </div>
          <h1 className="font-black-slanted text-[clamp(2.5rem,8vw,5rem)] uppercase leading-[0.9] text-[#0a0a0d]">
            Order Confirmed
          </h1>
          <p className="mt-4 text-base text-[#8a8a9a]">
            Thank you for your purchase. Your Mecha 16 is being prepared.
          </p>
        </div>

        {/* Order card */}
        <div className="border border-[#0a0a0d]/10 bg-white p-8">
          {/* Card header */}
          <div className="mb-6 flex items-center justify-between border-b border-[#0a0a0d]/10 pb-4">
            <h2 className="font-bold-slanted text-xl uppercase text-[#0a0a0d]">
              Order Details
            </h2>
            <Logo className="h-6 w-auto" />
          </div>

          <dl className="space-y-3">
            <OrderRow label="Order ID">
              <span className="font-mono text-xs text-[#0a0a0d]/70 break-all">
                {orderDetails.sessionId}
              </span>
            </OrderRow>

            {orderDetails.customerEmail && (
              <OrderRow label="Email">
                <span className="text-sm text-[#0a0a0d]">
                  {orderDetails.customerEmail}
                </span>
              </OrderRow>
            )}

            <OrderRow label="Product">
              <span className="text-sm text-[#0a0a0d]">Mecha 16 Keyboard</span>
            </OrderRow>

            {orderDetails.amount && (
              <OrderRow label="Amount">
                <span className="font-bold text-sm text-[#0a0a0d]">
                  ${orderDetails.amount} USD
                </span>
              </OrderRow>
            )}

            <OrderRow label="Payment Status">
              <span className="label-mono inline-flex items-center gap-2 bg-[#00d4ff]/10 px-3 py-1 text-[#007a94]">
                <span className="inline-block size-2 rounded-full bg-[#00d4ff]" aria-hidden="true" />
                {orderDetails.paymentStatus === "paid" ? "Paid" : orderDetails.paymentStatus}
              </span>
            </OrderRow>
          </dl>
        </div>

        {/* What's next */}
        <div className="mt-10">
          <h3 className="font-bold-slanted mb-6 text-center text-2xl uppercase text-[#0a0a0d]">
            What&apos;s Next?
          </h3>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                icon: LuMail,
                title: "Confirmation Email",
                body: "A receipt with order details has been sent to your email address.",
              },
              {
                icon: LuPackageOpen,
                title: "Processing",
                body: "We're preparing your keyboard. Estimated 2–3 business days.",
              },
              {
                icon: LuPackageCheck,
                title: "Delivery",
                body: "Your keyboard ships with tracking. Estimated 5–7 business days.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="border border-[#0a0a0d]/10 bg-white p-6"
              >
                <div className="mb-4 flex size-10 items-center justify-center bg-[#0a0a0d]">
                  <Icon className="size-5 text-[#00d4ff]" aria-hidden="true" />
                </div>
                <h4 className="font-bold-slanted mb-2 text-sm uppercase text-[#0a0a0d]">
                  {title}
                </h4>
                <p className="text-sm text-[#8a8a9a]">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="font-bold-slanted group flex items-center justify-center gap-2 bg-[#0a0a0d] px-8 py-3 text-base uppercase tracking-wide text-white hover:bg-[#222228] focus:ring-2 focus:ring-[#0a0a0d] focus:ring-offset-2 focus:outline-none motion-safe:transition"
          >
            Back to Store
            <LuChevronRight className="size-4 group-hover:translate-x-0.5 motion-safe:transition-transform" />
          </Link>

          <Link
            href="/"
            className="font-bold-slanted flex items-center justify-center gap-2 border border-[#0a0a0d]/20 px-8 py-3 text-base uppercase tracking-wide text-[#0a0a0d] hover:border-[#0a0a0d]/40 hover:bg-[#0a0a0d]/5 focus:ring-2 focus:ring-[#0a0a0d]/30 focus:outline-none motion-safe:transition"
          >
            <LuCircleHelp className="size-4" aria-hidden="true" />
            Need Help?
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}

// ─── Error view ───────────────────────────────────────────────────────────────
function ErrorView({ message }: { message: string }) {
  return (
    <div className="relative mt-16 min-h-screen bg-[#f5f5f7]">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center bg-[#0a0a0d]">
            <LuCircleHelp className="size-8 text-red-400" aria-hidden="true" />
          </div>

          <h1 className="font-black-slanted text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.9] text-[#0a0a0d]">
            Something Went Wrong
          </h1>

          <p className="mt-4 text-base text-[#8a8a9a]">{message}</p>

          <Link
            href="/"
            className="font-bold-slanted mt-8 inline-flex items-center gap-2 bg-[#0a0a0d] px-8 py-3 text-base uppercase tracking-wide text-white hover:bg-[#222228] focus:ring-2 focus:ring-[#0a0a0d] focus:ring-offset-2 focus:outline-none motion-safe:transition"
          >
            Return Home
            <LuChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Shared row component ─────────────────────────────────────────────────────
function OrderRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#0a0a0d]/06 py-3 last:border-0">
      <dt className="label-mono shrink-0 text-[#8a8a9a]">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
