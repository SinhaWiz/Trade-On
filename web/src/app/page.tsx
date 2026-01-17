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
