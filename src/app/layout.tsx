import '@src/styles/reset.css';
import '@radix-ui/themes/styles.css';
import '@src/styles/global.css';

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@src/trpc/react";
import { Theme } from '@radix-ui/themes';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Factuality",
  description: "On demand fact checking",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>
          <TRPCReactProvider cookies={cookies().toString()}>
            {children}
          </TRPCReactProvider>
        </Theme>
      </body>
    </html>
  );
}
