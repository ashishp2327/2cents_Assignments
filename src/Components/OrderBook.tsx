"use client";
import React, { useMemo } from "react";
import useOrderBookStore from "@/store/useOrderBookStore";
import useBinanceSocket from "@/hooks/useBinanceSocket";

type Props = { limit?: number };

export default function OrderBook({ limit = 25 }: Props) {
    useBinanceSocket("BTCUSDT");

    const getCumulative = useOrderBookStore((s) => s.getCumulative);
    const spread = useOrderBookStore((s) => s.spread);

    const { levels: bids, cumulatives: bidsCum } = useMemo(
        () => getCumulative("bids", limit),
        [getCumulative, limit]
    );
    const { levels: asks, cumulatives: asksCum } = useMemo(
        () => getCumulative("asks", limit),
        [getCumulative, limit]
    );

    const maxBidCum = bidsCum.length ? Math.max(...bidsCum) : 1;
    const maxAskCum = asksCum.length ? Math.max(...asksCum) : 1;

    const topBid = bids[0]?.price ?? null;
    const topAsk = asks[0]?.price ?? null;
    const currentSpread = spread();

    if (!bids.length || !asks.length) {
        return (
            <div className="text-center text-gray-500 mt-10">
                Loading order book...
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-8 p-6 bg-[#0e0f12] rounded-3xl border border-[#1c1e24] shadow-lg">
            {/* BIDS */}
            <div className="w-[320px] bg-[#121318] rounded-2xl border border-[#1e2026] shadow-inner p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-green-500 font-semibold text-lg">Bids</h3>
                    <div className="text-sm text-gray-300">
                        Best: <span className="text-green-400">{topBid?.toFixed(2)}</span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#20222a]">
                    <div className="grid grid-cols-3 font-semibold text-gray-300 text-center bg-[#181a20] py-2 text-xs sticky top-0 z-10">
                        <div>Price</div>
                        <div>Amount</div>
                        <div>Total</div>
                    </div>

                    <div className="max-h-[430px] overflow-y-auto scrollbar-hide divide-y divide-[#1e2026]">
                        {bids.map((lv, i) => {
                            const cum = bidsCum[i];
                            const pct = (cum / maxBidCum) * 100;
                            return (
                                <div key={lv.price} className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-green-500/10"
                                        style={{ width: `${pct}%`, zIndex: 0 }}
                                    />
                                    <div className="grid grid-cols-3 text-center text-xs font-mono py-1.5 relative z-10">
                                        <div className="text-green-400">{lv.price.toFixed(2)}</div>
                                        <div className="text-gray-200">{lv.qty}</div>
                                        <div className="text-gray-400">{cum.toFixed(6)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* SPREAD */}
            <div className="flex flex-col items-center justify-center bg-[#16171c] px-6 py-4 rounded-2xl border border-[#1e2026] shadow-inner text-center h-fit">
                <div className="text-gray-400 text-sm mb-1">Spread</div>
                <div className="font-mono font-semibold text-lg text-white">
                    {currentSpread !== null ? currentSpread.toFixed(2) : "-"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {topAsk && topBid ? `${topAsk.toFixed(2)} - ${topBid.toFixed(2)}` : ""}
                </div>
            </div>

            {/* ASKS */}
            <div className="w-[320px] bg-[#121318] rounded-2xl border border-[#1e2026] shadow-inner p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-red-500 font-semibold text-lg">Asks</h3>
                    <div className="text-sm text-gray-300">
                        Best: <span className="text-red-400">{topAsk?.toFixed(2)}</span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#20222a]">
                    <div className="grid grid-cols-3 font-semibold text-gray-300 text-center bg-[#181a20] py-2 text-xs sticky top-0 z-10">
                        <div>Price</div>
                        <div>Amount</div>
                        <div>Total</div>
                    </div>

                    <div className="max-h-[430px] overflow-y-auto scrollbar-hide divide-y divide-[#1e2026]">
                        {asks.map((lv, i) => {
                            const cum = asksCum[i];
                            const pct = (cum / maxAskCum) * 100;
                            return (
                                <div key={lv.price} className="relative">
                                    <div
                                        className="absolute inset-y-0 right-0 bg-red-500/10"
                                        style={{ width: `${pct}%`, zIndex: 0 }}
                                    />
                                    <div className="grid grid-cols-3 text-center text-xs font-mono py-1.5 relative z-10">
                                        <div className="text-red-400">{lv.price.toFixed(2)}</div>
                                        <div className="text-gray-200">{lv.qty}</div>
                                        <div className="text-gray-400">{cum.toFixed(6)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
