"use client";
import React, { useEffect, useState } from "react";

interface Trade {
    id: number;
    price: number;
    qty: number;
    time: number;
    isBuyerMaker: boolean;
}

export default function RecentTrades() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [flashMap, setFlashMap] = useState<Record<number, "buy" | "sell">>({});

    useEffect(() => {
        const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const newTrade: Trade = {
                id: data.t,
                price: parseFloat(data.p),
                qty: parseFloat(data.q),
                time: data.T,
                isBuyerMaker: data.m,
            };

            setTrades((prev) => [newTrade, ...prev].slice(0, 50));

            const dir = newTrade.isBuyerMaker ? "sell" : "buy";
            setFlashMap((prev) => ({ ...prev, [newTrade.id]: dir }));

            setTimeout(() => {
                setFlashMap((prev) => {
                    const copy = { ...prev };
                    delete copy[newTrade.id];
                    return copy;
                });
            }, 500);
        };

        return () => ws.close();
    }, []);

    return (
<div className="w-full sm:w-[380px] h-[500px] bg-gradient-to-b from-[#141420] to-[#0A0A0F] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-3 text-gray-200 border-b border-white/10 pb-2">Recent Trades</h3>

            <div className="overflow-y-auto flex-1 font-mono text-sm scrollbar-thin scrollbar-thumb-white/10 space-y-1">
                {trades.map((t) => {
                    const type = t.isBuyerMaker ? "sell" : "buy";
                    const isFlashing = flashMap[t.id];
                    return (
                        <div
                            key={t.id}
                            className={`flex justify-between py-1.5 px-2 rounded-lg transition-all duration-300 ${isFlashing
                                    ? type === "buy"
                                        ? "bg-green-500/20"
                                        : "bg-red-500/20"
                                    : "hover:bg-white/5"
                                }`}
                        >
                            <span
                                className={`font-semibold ${type === "buy" ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {type.toUpperCase()}
                            </span>
                            <span className="text-gray-300">{t.price.toFixed(2)}</span>
                            <span className="text-gray-500">{t.qty.toFixed(4)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
