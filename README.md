Real-Time Order Book Visualizer

A high-performance, real-time stock order book visualizer built with Next.js and TypeScript, connected to the Binance WebSocket API.
This project streams live market data (order book deltas and recent trades) and displays them with smooth, non-blocking UI updates.

🧠 Objective

This project demonstrates:

Handling real-time WebSocket streams efficiently.
Maintaining high-frequency live state (order book updates & recent trades).
Rendering large, dynamic datasets in a smooth, responsive UI.

🏗️ Tech Stack
Category	Choice	Notes
Framework	Next.js (TypeScript)	For SSR, routing, and strong type safety
State Management	Zustand / useReducer / Context API	Lightweight, fast, and predictable
Styling	Tailwind CSS	For responsive, professional UI
API Source	Binance WebSocket API	Live market data (BTC/USDT or any pair)
Deployment	Vercel	For quick and reliable hosting
⚙️ Installation & Setup
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/orderbook-visualizer.git

# 2️⃣ Navigate into the project folder
cd orderbook-visualizer

# 3️⃣ Install dependencies
npm install

# 4️⃣ Run the development server
npm run dev

# 5️⃣ Open in browser
http://localhost:3000

🌐 API Integration

The app connects to Binance WebSocket streams for real-time market data:

1. Aggregate Trades Stream

Used for the Recent Trades Component
Endpoint:

wss://stream.binance.com:9443/ws/btcusdt@aggTrade


Provides recent completed trades (price, quantity, side, timestamp)

2. Order Book Depth Stream

Used for the Order Book Component
Endpoint:

wss://stream.binance.com:9443/ws/btcusdt@depth


Streams live bids and asks updates (deltas)

Each update modifies or removes price levels based on quantity

If quantity === 0 → remove the price level

🧩 Project Structure
src/
├── app/
│   ├── page.tsx             # Home page layout
│   └── globals.css          # Global styles
│
├── components/
│   ├── OrderBook.tsx        # Displays live bids & asks
│   ├── RecentTrades.tsx     # Displays recent completed trades
│   └── SpreadIndicator.tsx  # Shows the bid-ask spread
│
├── hooks/
│   └── useBinanceSocket.ts  # Custom hook for WebSocket connection
│
├── store/
│   └── orderBookStore.ts    # Zustand store (or useReducer context)
│
└── utils/
    └── format.ts            # Helper functions for formatting price/time

🧮 Core Features
🔹 Order Book

Real-time updates of bids (green) and asks (red)

Sorted correctly:

Bids → descending (highest first)

Asks → ascending (lowest first)

Cumulative totals displayed

Spread dynamically calculated:

Spread
=
Lowest Ask
−
Highest Bid
Spread=Lowest Ask−Highest Bid

Depth visualization bars proportional to volume

🔹 Recent Trades

Shows last 50 trades

Flashes green for market buys, red for market sells

Auto-scrolls with newest trade at top

🔹 Performance Optimizations

Batched and memoized state updates

Avoids full re-renders (React.memo + useCallback)

Efficient data structure (Maps) for O(1) price-level updates

💡 Design Decisions

Zustand chosen for global state → minimal boilerplate, fast updates.

Used WebSocket hooks for modularity → easy to extend for other symbols.

Tailwind CSS for professional and lightweight styling.

Batched rendering logic to ensure smooth UI even under high-frequency updates.

🧪 Testing
# Run lint checks
npm run lint

# (Optional) Add your test setup if using Jest or Vitest
npm run test

🧰 Future Improvements

Add symbol selector (e.g., ETH/USDT, BNB/USDT)
Depth chart visualization (canvas or recharts)
Persist WebSocket connection across tabs
Display connection status (Connected / Reconnecting / Disconnected)
