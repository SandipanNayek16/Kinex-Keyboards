import { createClient } from "@/prismicio";
import { asText } from "@prismicio/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { replaceBrandName } from "@/utils/text";

/**
 * POST /api/checkout/[uid]
 *
 * Creates a Stripe Checkout Session for the given Prismic product UID.
 *
 * Environment variables required:
 *   STRIPE_SECRET_KEY  — Stripe secret key (never exposed to client)
 *   NEXT_PUBLIC_SITE_URL — Canonical site URL for redirect fallback
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  // Parse dynamic currency from URL if provided
  const url = new URL(request.url);
  const currency = url.searchParams.get("currency") || "usd";

  // Validate Stripe secret key exists
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("STRIPE_SECRET_KEY is not configured");
    return NextResponse.json(
      { error: "Payment system is not configured" },
      { status: 503 },
    );
  }

  try {
    const { uid } = await params;

    if (!uid || typeof uid !== "string" || uid.trim() === "") {
      return NextResponse.json(
        { error: "Missing or invalid product UID" },
        { status: 400 },
      );
    }

    // Determine site origin with fallback
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-07-30.basil",
    });

    const prismicClient = createClient();

    let product;
    try {
      product = await prismicClient.getByUID("product", uid.trim());
    } catch {
      return NextResponse.json(
        { error: `Product '${uid}' not found` },
        { status: 404 },
      );
    }

    const rawName = (product.data.name as string) || "Kinex Keyboard";
    const name = replaceBrandName(rawName);
    const price = product.data.price as number | undefined;
    const image = product.data.image?.url as string | undefined;
    const fullDescription = replaceBrandName(asText(product.data.description));
    const firstSentenceMatch = fullDescription.match(/^[^.]*\./);
    const description = firstSentenceMatch
      ? firstSentenceMatch[0].trim()
      : "A premium 75% mechanical keyboard built for developers.";

    // Validate price is a positive integer (Stripe requires cents)
    if (
      typeof price !== "number" ||
      !Number.isInteger(price) ||
      price <= 0
    ) {
      console.error(`Invalid price for product '${uid}':`, price);
      return NextResponse.json(
        { error: "Product price is not configured correctly" },
        { status: 422 },
      );
    }

    // Determine unit amount based on currency
    let unit_amount = price;
    if (currency === "eur") {
      unit_amount = Math.round(price * 0.92);
    } else if (currency === "inr") {
      unit_amount = Math.round(price * 83);
    } else if (currency === "jpy") {
      // JPY is zero-decimal. price is in USD cents (e.g. 25000 = $250.00).
      // $250 USD * 150 JPY/USD = 37500 JPY. So price * 1.5 = 37500.
      unit_amount = Math.round(price * 1.5);
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name,
              ...(description ? { description } : {}),
              ...(image ? { images: [image] } : {}),
            },
            unit_amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session — please try again" },
      { status: 500 },
    );
  }
}
