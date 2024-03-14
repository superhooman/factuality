import { Sidebar } from "@src/features/Sidebar";
import { DashboardLayout } from "@src/layouts/dashboard";
import { getServerAuthSession } from "@src/server/auth";
import { db } from "@src/server/db";
import { checks } from "@src/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user.id) {
    return redirect('/');
  }

  const items = await db.select({
    id: checks.id,
    url: checks.url,
    taskId: checks.taskId,
    createdAt: checks.createdAt,
  }).from(checks).where(eq(checks.createdById, session.user.id)).orderBy(desc(checks.createdAt)).limit(9)

  return (
    <DashboardLayout
      sidebar={(
        <Sidebar items={items} />
      )}
    >
      {children}
    </DashboardLayout>
  );
}
