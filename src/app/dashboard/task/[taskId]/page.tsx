import { getServerAuthSession } from "@src/server/auth";
import { redirect } from "next/navigation";
import { Result } from "@src/features/Result";

interface Props {
    params: {
        taskId: string;
    }
}

export default async function Task({ params }: Props) {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect('/');
  }

  return (
    <Result taskId={params.taskId} />
  );
}

