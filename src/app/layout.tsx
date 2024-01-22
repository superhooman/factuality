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
  title: "Shyn",
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
      <head>
        <meta name="google-site-verification" content="9NDZR3XvkpacoWFZF8dxaK5GImj6zNKsYUc9uTgvi1w" />
      </head>
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
