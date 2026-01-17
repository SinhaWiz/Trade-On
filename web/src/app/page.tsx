import { auth } from "@/auth";
import { redirect } from "next/navigation";
import GameClient from "./GameClient";

export default async function Home() {
  const session = await auth();

  // For demo mode, we'll handle it client-side in GameClient
  // If no session, still render GameClient which will check for demo mode
  const user = session?.user || null;

  return <GameClient user={user} />;
}
