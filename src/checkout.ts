export type CheckoutResult =
  | { success: true; url: string }
  | { success: false; error: string };

/**
 * Initiates a Stripe Checkout session for the given product UID.
 * Returns a structured result instead of silently failing.
 */
export async function checkout(
  uid: string,
  currency: string = "usd",
): Promise<CheckoutResult> {
  try {
    const res = await fetch(`/api/checkout/${uid}?currency=${currency}`, { method: "POST" });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message =
        (body as { error?: string }).error ||
        `Server error (${res.status})`;
      return { success: false, error: message };
    }

    const data = (await res.json()) as { url?: string };

    if (!data.url) {
      return { success: false, error: "No checkout URL returned" };
    }

    window.location.href = data.url;
    return { success: true, url: data.url };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: "Network error — please try again",
    };
  }
}
