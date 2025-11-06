/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

type OrderBookLevel = { price: number; qty: number };

type OrderBookState = {
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    trades: {
        price: number;
        qty: number;
        time: number;
        isBuyerMaker: boolean;
    }[];

    updateOrderBook: (side: "bids" | "asks", levels: any[]) => void;
    getCumulative: (side: "bids" | "asks", limit: number) => {
        levels: OrderBookLevel[];
        cumulatives: number[];
    };
    spread: () => number | null;
    pushTrade: (trade: OrderBookState["trades"][number]) => void;
};

const useOrderBookStore = create<OrderBookState>()(
    persist(
        (set, get) => ({
            bids: [],
            asks: [],
            trades: [],

            updateOrderBook: (side, levels) => {
                const formatted = levels
                    .map(([price, qty]: [string, string]) => ({
                        price: parseFloat(price),
                        qty: parseFloat(qty),
                    }))
                    .filter((lv) => lv.qty > 0);

                set({ [side]: formatted } as any);
            },

            getCumulative: (side, limit) => {
                const levels = get()[side].slice(0, limit);
                const cumulatives: number[] = [];
                levels.reduce((acc, lv) => {
                    const next = acc + lv.qty;
                    cumulatives.push(next);
                    return next;
                }, 0);
                return { levels, cumulatives };
            },

            spread: () => {
                const bids = get().bids;
                const asks = get().asks;
                if (!bids.length || !asks.length) return null;
                return asks[0].price - bids[0].price;
            },

            pushTrade: (trade) =>
                set((s) => ({
                    trades: [trade, ...s.trades].slice(0, 50),
                })),
        }),
        {
            name: "orderbook-storage", // localStorage key 🧠
        }
    )
);

export default useOrderBookStore;
