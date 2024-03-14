'use client';
import React from "react";
import * as cls from "./styles.css";
import formatDistance from "date-fns/formatDistance";
import { Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import { Favicon } from "@src/components/Favicon";
import { useParams } from "next/navigation";

interface SidebarProps {
  items: {
    id: number;
    url: string;
    taskId: string;
    createdAt: Date;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
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
  );
};

interface Props {
  id: string;
  url: string;
  date: Date;
}

export const Item: React.FC<Props> = ({ id, url, date }) => {
  const { taskId } = useParams();
  const domain = React.useMemo(() => new URL(url).hostname, [url]);

  const dateString = React.useMemo(() => {
    const dateObj = new Date(date);
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  }, [date]);

  return (
    <Flex
      className={cls.item}
      direction={{ initial: "column", sm: "row" }}
      gap={{ initial: "1", sm: "2" }}
      align={{ initial: "start", sm: "center" }}
      justify="between"
      asChild
      data-selected={id === taskId}
    >
      <Link href={`/dashboard/task/${id}`}>
        <Flex
          direction={{ initial: "column", sm: "row" }}
          align={{ initial: "start", sm: "center" }}
          gap={{ initial: "1", sm: "2" }}
        >
          <Flex p="1" className={cls.favicon}>
            <Favicon url={url} />
          </Flex>
          <Text className={cls.text} weight="medium" size="2">
            {domain}
          </Text>
        </Flex>
        <Text className={cls.date} color="gray" size="1">
          {dateString}
        </Text>
      </Link>
    </Flex>
  );
};
