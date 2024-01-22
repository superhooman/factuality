import { Auth } from "@src/features/Auth";
import { getServerAuthSession } from "@src/server/auth";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

interface HomeProps {
    searchParams: { error?: string };
}

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to Shyn',
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
