import { auth } from "@/auth";
import { redirect } from "next/navigation";
import GameClient from "./GameClient";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <GameClient user={session.user} />;
}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Market & Chart */}
          <div className="col-span-8 space-y-6">
            {/* Market Table */}
            <MarketTable 
              onSelectCoin={setSelectedCoin} 
              selectedCoin={selectedCoin} 
            />

            {/* Price Chart */}
            <PriceChart coin={selectedCoin} />

            {/* Positions */}
            <PositionsPanel />
          </div>

          {/* Right Column - Trade Panel & Actions */}
          <div className="col-span-4 space-y-6">
            {/* Trade Panel */}
            <TradePanel selectedCoin={selectedCoin} />

            {/* Action Panel */}
            <ActionPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
