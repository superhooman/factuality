"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button, Callout, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { GoogleIcon } from "@src/components/Icon";
import { signIn } from "next-auth/react";
import React from "react";

import NextLink from 'next/link';

const ERRROS: Record<string, string> = {
  Signin: "You need to sign in to view this page.",
};

const DEFAULT_ERROR = "Sign in failed. Try again later.";

interface AuthProps {
  error?: string;
  callbackUrl?: string;
}

export const Auth: React.FC<AuthProps> = ({
  error,
  callbackUrl = "/dashboard",
}) => {
  const errorMessage = error ? ERRROS[error] ?? DEFAULT_ERROR : null;
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = React.useCallback(() => {
    setLoading(true);
    signIn("google", {
      callbackUrl,
    })
      .catch(() => {
        console.log("error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [callbackUrl]);

  return (
    <Flex direction="column" height="100%" align="center" gap="4" justify="center">
      <Flex direction="column" gap="2">
        <Heading size="5" align="center">Shyn</Heading>
        <Text as="p" size="2" align="center" color="gray">
            Please authorize to continue
        </Text>
      </Flex>
      {errorMessage && (
        <Callout.Root color="red" size="1">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>{errorMessage}</Callout.Text>
        </Callout.Root>
      )}
      <Button
        disabled={loading}
        onClick={handleGoogleSignIn}
        size="3"
        variant="outline"
        color="gray"
        radius="large"
      >
        <GoogleIcon size={16} />
        <Text size="2">Sign in with Google</Text>
      </Button>
      <Flex direction="row" gap="2">
        <Link asChild size="1" color="gray">
          <NextLink href="/privacy">
            Privacy Policy
          </NextLink>
        </Link>
        <Link asChild size="1" color="gray">
          <NextLink href="/tos">
            Terms of Service
          </NextLink>
        </Link>
      </Flex>
    </Flex>
  );
};
