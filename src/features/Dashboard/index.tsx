"use client";
import { Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { Favicon } from "@src/components/Favicon";
import { Loader } from "@src/components/Loading";
import { api } from "@src/trpc/react";
import { formatDistance } from "date-fns";
import React from "react";

import * as cls from './styles.css';
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Dashboard = () => {
  const router = useRouter();
  const apiUtils = api.useUtils();
  const { data: items } = api.check.get.useQuery();
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
      {(items && items.length > 0) ? (
        <Flex mt="4" width="100%" direction="column" gap="4">
          <Text weight="medium" size="2" color="gray">
            History
          </Text>
          <Flex direction="column" width="100%" gap="2">
            {items.map((item) => (
              <Item
                key={item.taskId}
                id={item.taskId}
                url={item.url}
                date={item.createdAt}
              />
            ))}
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  );
};

interface Props {
  id: string;
  url: string;
  date: Date;
}

export const Item: React.FC<Props> = ({ id, url, date }) => {
  const domain = React.useMemo(() => new URL(url).hostname, [url]);

  const dateString = React.useMemo(() => {
    const dateObj = new Date(date);
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  }, [date]);

  return (
    <Flex
      className={cls.item}
      direction={{ initial: 'column', sm: 'row' }}
      gap={{ initial: '1', sm: '2' }}
      align={{ initial: 'start', sm: 'center' }}
      justify="between"
      asChild
    >
      <Link href={`/dashboard/task/${id}`}>
        <Flex
          direction={{ initial: 'column', sm: 'row' }}
          align={{ initial: 'start', sm: 'center' }}
          gap={{ initial: '1', sm: '2' }}
        >
          <Flex
            p="1"
            className={cls.favicon}
          >
            <Favicon url={url} />
          </Flex>
          <Text weight="medium" size="3">
            {domain}
          </Text>
        </Flex>
        <Text color="gray" size="2">
          {dateString}
        </Text>
      </Link>
    </Flex>
  );
};
