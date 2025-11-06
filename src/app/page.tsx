"use client";
import OrderBook from "@/Components/OrderBook";
import RecentTrades from "@/Components/RecentTrades";
import './globals.css';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#12121A] to-[#0A0A0F] p-8 flex gap-8 justify-center items-start text-white">
      <OrderBook limit={25} />
      <RecentTrades />
    </div>
  );
}
