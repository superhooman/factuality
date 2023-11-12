import { Auth } from "@src/features/Auth";
import { getServerAuthSession } from "@src/server/auth";
import { redirect } from "next/navigation";

interface HomeProps {
    searchParams: { error?: string };
}

export default async function Home({ searchParams }: HomeProps) {
    const session = await getServerAuthSession();

    if (session) {
        return redirect('/dashboard');
    }

    return (
        <Auth
            error={searchParams.error}
        />
    )
};
