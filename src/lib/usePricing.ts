import { useEffect, useState } from "react";

const FALLBACK_RATE = 45;
const API = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";

export const USD_PRICES = {
  // services
  landing: 50,
  blog: 37.5,
  portfolio: 32.5,
  business: 100,
  ecom: 150,
  // plans
  starter: 50,
  pro: 67.5,
  premium: 225,
};

export type PriceKey = keyof typeof USD_PRICES;

const roundTo50 = (n: number) => Math.round(n / 50) * 50;

export const formatTRY = (n: number) =>
  "₺" + new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(n);

export function usePricing() {
  const [rate, setRate] = useState<number>(FALLBACK_RATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        const t = data?.usd?.try;
        if (alive && typeof t === "number" && t > 0) setRate(t);
      })
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const price = (key: PriceKey) => roundTo50(USD_PRICES[key] * rate);
  const priceFmt = (key: PriceKey) => formatTRY(price(key));

  return { rate, loaded, price, priceFmt };
}
