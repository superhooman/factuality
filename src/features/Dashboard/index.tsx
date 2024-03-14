"use client";
import { Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { Loader } from "@src/components/Loading";
import { api } from "@src/trpc/react";
import React from "react";

import { useRouter } from "next/navigation";

export const Dashboard = () => {
  const router = useRouter();
  const apiUtils = api.useUtils();
  const { mutateAsync: createTask, isLoading } = api.check.create.useMutation();
  const [url, setUrl] = React.useState("");

  const handleUrlChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    },
    []
  );

  const handleFormSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await apiUtils.check.get.invalidate();
      createTask({ url: url.startsWith("http") ? url : `https://${url}` }).then((res) => {
        router.push(`/dashboard/task/${res}`);
      }).catch((err) => {
        console.error(err);
      });
    },
    [url, createTask, apiUtils, router]
  );

  return (
    <Flex
      direction="column"
      height="100%"
      align="center"
      gap="4"
      justify="center"
      py="4"
      style={{ maxWidth: 768, margin: 'auto' }}
    >
      <Flex direction="column" mb="4" gap="2">
        <Heading size="7" align="center" as="h1">
          Shyn
        </Heading>
        <Text as="p" size="2" align="center" color="gray">
          Check the factuality of any URL
        </Text>
      </Flex>
      <Flex width="100%" gap="2" asChild>
        <form onSubmit={handleFormSubmit}>
          <TextField.Root style={{ width: "100%" }}>
            <TextField.Input
              type="text"
              placeholder="Enter a URL"
              value={url}
              onChange={handleUrlChange}
              required
              size="3"
              radius="full"
            />
          </TextField.Root>
          <Button disabled={isLoading} size="3" radius="full">
            {isLoading ? <Loader /> : "Check"}
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};
