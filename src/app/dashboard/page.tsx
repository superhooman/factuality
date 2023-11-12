import { getServerAuthSession } from "@src/server/auth";
import { redirect } from "next/navigation";
import { Dashboard } from "@src/features/Dashboard";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect('/');
  }

  return (
    <Dashboard />
  );
}

