// Registry of paid products (Lemon Squeezy variants).
//
// Each entry maps a logical product id to the LS checkout URL and
// human-facing price/label. To go live: replace each REPLACE-WITH-…
// placeholder with the variant's "Buy now" URL from the LS dashboard.
// (Products → [variant] → Share → Buy Now link.)

export type ProductId = "watermark" | "pack-cyberpunk" | "pack-retro-diner";

export interface Product {
  id: ProductId;
  /** Human label for the buy button, e.g. "Cyberpunk pack". */
  shortLabel: string;
  /** Display price, e.g. "$7" or "$9". */
  priceLabel: string;
  /** Lemon Squeezy "Buy now" URL for this variant. */
  checkoutUrl: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  watermark: {
    id: "watermark",
    shortLabel: "Remove watermark",
    priceLabel: "$7",
    checkoutUrl:
      "https://your-store.lemonsqueezy.com/buy/REPLACE-WITH-WATERMARK-VARIANT-UUID",
  },
  "pack-cyberpunk": {
    id: "pack-cyberpunk",
    shortLabel: "Cyberpunk pack",
    priceLabel: "$9",
    checkoutUrl:
      "https://your-store.lemonsqueezy.com/buy/REPLACE-WITH-CYBERPUNK-VARIANT-UUID",
  },
  "pack-retro-diner": {
    id: "pack-retro-diner",
    shortLabel: "Retro Diner pack",
    priceLabel: "$9",
    checkoutUrl:
      "https://your-store.lemonsqueezy.com/buy/REPLACE-WITH-RETRO-DINER-VARIANT-UUID",
  },
};
