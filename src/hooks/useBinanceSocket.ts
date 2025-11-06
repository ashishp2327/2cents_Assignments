"use client";
import { useEffect } from "react";
import useOrderBookStore from "@/store/useOrderBookStore";

export default function useBinanceStream(symbol: string = "BTCUSDT") {
    const updateOrderBook = useOrderBookStore((s) => s.updateOrderBook);
    const pushTrade = useOrderBookStore((s) => s.pushTrade);

    useEffect(() => {
        if (typeof window === "undefined") return; // ✅ ensure client-only

        let depthWS: WebSocket | null = null;
        let tradeWS: WebSocket | null = null;
        let isActive = true;

        const connect = async () => {
            try {
                // ✅ 1. Get initial snapshot (only client side)
                const res = await fetch(
                    `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=100`
                );
                const snapshot = await res.json();

                if (!isActive) return;

                updateOrderBook("bids", snapshot.bids);
                updateOrderBook("asks", snapshot.asks);

                // ✅ 2. Start Depth Stream
                depthWS = new WebSocket(
                    `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth@10ms`
                );

                depthWS.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.b) updateOrderBook("bids", data.b);
                    if (data.a) updateOrderBook("asks", data.a);
                };

                // ✅ 3. Start Trade Stream
                tradeWS = new WebSocket(
                    `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
                );

                tradeWS.onmessage = (event) => {
                    const t = JSON.parse(event.data);
                    pushTrade({
                        price: parseFloat(t.p),
                        qty: parseFloat(t.q),
                        time: t.T,
                        isBuyerMaker: t.m,
                    });
                };

                // ✅ 4. Auto-reconnect safety
                depthWS.onclose = () => {
                    console.warn("Depth socket closed — reconnecting...");
                    if (isActive) setTimeout(connect, 4000);
                };
                tradeWS.onclose = () => {
                    console.warn("Trade socket closed — reconnecting...");
                    if (isActive) setTimeout(connect, 4000);
                };
            } catch (err) {
                console.error("Socket connection error:", err);
                if (isActive) setTimeout(connect, 4000);
            }
        };

        connect();

        // ✅ Cleanup
        return () => {
            isActive = false;
            depthWS?.close();
            tradeWS?.close();
        };
    }, [symbol, updateOrderBook, pushTrade]);
}
