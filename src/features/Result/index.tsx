"use client";

import {
  AspectRatio,
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Inset,
  Tabs,
  Text,
} from "@radix-ui/themes";
import { LoadingContainer } from "@src/components/Loading";
import { api } from "@src/trpc/react";
import { type ErrorResult, type SuccessResult } from "open-graph-scraper";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  type ChartData,
} from "chart.js";
import { Radar } from "react-chartjs-2";

import * as cls from "./styles.css";
import { Favicon } from "@src/components/Favicon";
import {
  ChevronLeftIcon,
  CounterClockwiseClockIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import { type Scores } from "@src/server/backend";
import React from "react";
import Link from "next/link";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler);

interface Props {
  taskId: string;
}

export const Result = ({ taskId }: Props) => {
  const [polling, setPolling] = React.useState(true);
  const { data, isLoading } = api.check.result.useQuery(
    { taskId },
    {
      refetchInterval: polling ? 1000 : false,
      onSuccess: (data) => {
        data.data.status === "COMPLETED" && setPolling(false);
      }
    }
  );

  const itJustSite = React.useMemo(() => {
    if (!data) return;
    const url = new URL(data.url);
    return url.pathname === "/";
  }, [data]);

  if (!data && isLoading) {
    return (
      <Flex direction="column" height="100%" align="center" justify="center">
        <LoadingContainer />
      </Flex>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Flex direction="column" height="100%" align="center" gap="4" py="4">
      <Flex width="100%">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ChevronLeftIcon />
            <Text as="span" size="2">
              Back
            </Text>
          </Link>
        </Button>
      </Flex>
      <Flex width="100%" align="center" gap="3">
        <Flex shrink="0" p="1" className={cls.favicon}>
          <Favicon size={32} url={data.url} />
        </Flex>
        <Flex grow="1" direction="column">
          <Heading size="4">Result</Heading>
          <Text className={cls.description} as="p" size="2" color="gray">
            {data.url}
          </Text>
        </Flex>
      </Flex>
      {data.data.status !== "COMPLETED" ? (
        <Flex width="100%" direction="column">
          {data.data.status === "PENDING" ? (
            <Callout.Root color="amber">
              <Callout.Icon>
                <CounterClockwiseClockIcon />
              </Callout.Icon>
              <Callout.Text>
                This task is still pending. Please wait a few moments.
              </Callout.Text>
            </Callout.Root>
          ) : null}
          {data.data.status === "IN_PROGRESS" ? (
            <Callout.Root color="amber">
              <Callout.Icon>
                <MagicWandIcon />
              </Callout.Icon>
              <Callout.Text>
                This task is in progress. Please wait a few moments.
              </Callout.Text>
            </Callout.Root>
          ) : null}
          {data.data.status === "FAILED" ? (
            <Callout.Root color="red">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>This task failed. Please try again.</Callout.Text>
            </Callout.Root>
          ) : null}
        </Flex>
      ) : null}
      {/* <OG data={data.og} /> */}
      {data.data.status === "COMPLETED" && data.data.data ? (
        <>
          {itJustSite ? (
            <>
              <TextResult input={data.data.data.site} />
              <Chart input={data.data.data.site} />
            </>
          ) : (
            <Tabs.Root defaultValue="article">
              <Tabs.List>
                <Tabs.Trigger value="article">Article</Tabs.Trigger>
                <Tabs.Trigger value="site">Website</Tabs.Trigger>
              </Tabs.List>

              <Box px="4" pt="3" pb="2">
                <Tabs.Content value="article">
                  <TextResult input={data.data.data.article} article />
                  <Chart input={data.data.data.article} />
                </Tabs.Content>
                <Tabs.Content value="site">
                  <TextResult input={data.data.data.site} />
                  <Chart input={data.data.data.site} />
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          )}
        </>
      ) : null}
    </Flex>
  );
};

export const TextResult: React.FC<{ input: Scores; article?: boolean }> = ({
  input,
  article,
}) => {
  const text = React.useMemo(() => {
    const thresholds = {
      high: 0.7,
      low: 0.3,
    };

    const what = article ? "article" : "website";

    let interpretation = "";

    if (input.label0 > thresholds.high) {
      interpretation = `The ${what} appears to be highly credible and trustworthy, with a significant amount of factual content.`;
    } else if (input.label0 > thresholds.low && input.label1 > thresholds.low) {
      interpretation = `The ${what} has a mix of credible and less reliable information. It is recommended to cross-check the facts.`;
    } else if (input.label2 > thresholds.high) {
      interpretation = `The ${what} is likely to contain unreliable information and should be used with caution for factual references.`;
    } else {
      interpretation = `The ${what} has varying levels of factuality and it may be necessary to consult additional sources for verification.`;
    }

    return interpretation;
  }, [input, article]);

  return (
    <Callout.Root>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>{text}</Callout.Text>
    </Callout.Root>
  );
};

export const Chart: React.FC<{ input: Scores }> = ({ input }) => {
  const data = React.useMemo(() => {
    const labels = ["High Factuality", "Mixed Factuality", "Low Factuality"];
    const backgroundColor = "#003eeb11"; // A shade of blue
    const borderColor = "#3a5bc7"; // A darker shade of blue

    // Extract the values from the factuality data
    const dataValues = [input.label0 * 100, input.label1 * 100, input.label2 * 100];

    // Structure the data for Chart.js
    const chartData: ChartData<'radar'> = {
      labels: labels,
      datasets: [
        {
          label: "Score",
          data: dataValues,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };

    return chartData;
  }, [input]);

  return (
    <Radar
        data={data}
        // @ts-expect-error - no types for scale
        options={{ scale: { beginAtZero: true, max: 100 } }}
    />
  );
};

export const OG: React.FC<{ data: ErrorResult | SuccessResult }> = ({
  data,
}) => {
  if (data.error) return null;

  const image = data.result.ogImage?.[0]?.url;

  const title = data.result.ogTitle;

  return (
    <Card size="2" style={{ maxWidth: "100%" }}>
      <Inset clip="padding-box" side="top" pb="current">
        <AspectRatio ratio={16 / 6}>
          <img
            src={image}
            alt={title}
            style={{
              display: "block",
              objectFit: "cover",
              width: "100%",
              backgroundColor: "var(--gray-5)",
            }}
          />
        </AspectRatio>
      </Inset>
      <Flex direction="column" gap="1" pt="3">
        <Heading size="4">{title}</Heading>
        <Flex align="center" gap="2">
          <Favicon url={data.result.ogUrl!} />
          <Text className={cls.description} as="p" size="2" color="gray">
            {data.result.ogUrl}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};
