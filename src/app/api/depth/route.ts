/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limit = searchParams.get("limit") || "1000";

    try {
        const response = await fetch(
            `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`,
            { next: { revalidate: 0 } } // ensures no caching
        );

        if (!response.ok) {
            throw new Error(`Snapshot HTTP ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
