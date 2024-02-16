"use client";

import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Inset,
  Select,
  Separator,
  Tabs,
  Text,
} from "@radix-ui/themes";
import { Loader, LoadingContainer } from "@src/components/Loading";
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
} from "@radix-ui/react-icons";
import { type Scores } from "@src/server/backend";
import React from "react";
import Link from "next/link";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler);

interface Props {
  taskId: string;
}

export const Result = ({ taskId }: Props) => {
  const [tab, setTab] = React.useState("article" as "article" | "site");
  const [score, setScore] = React.useState<keyof Scores>("factuality");
  const [polling, setPolling] = React.useState(true);
  const { data, isLoading } = api.check.result.useQuery(
    { taskId },
    {
      refetchInterval: polling ? 1000 : false,
      onSuccess: (data) => {
        data.data.status === "COMPLETED" && setPolling(false);
      },
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

  const scoreSelect = (
    <Flex align="start" direction="column" gap="1">
      <Text size="1" weight="bold" color="gray" as="label">
        Score type
      </Text>
      <Select.Root
        value={score}
        onValueChange={(v) => setScore(v as keyof Scores)}
      >
        <Select.Trigger />
        <Select.Content>
          {Object.entries(items).map(([key, value]) => (
            <Select.Item key={key} value={key}>
              {value}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );

  const hasMessage = data.message !== null;

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
                <Loader />
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
              <Callout.Text>
                Oops, something went wrong. Please try again later.
              </Callout.Text>
            </Callout.Root>
          ) : null}
        </Flex>
      ) : null}
      {/* <OG data={data.og} /> */}
      {hasMessage ? (
        <Flex gap="2">
          <Avatar
            radius="full"
            color="green"
            variant="solid"
            size="2"
            fallback={
              <svg
                className={cls.avatar}
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>OpenAI</title>
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
              </svg>
            }
          />
          <Flex direction="column" className={cls.callout}>
            <Heading weight="bold" size="2">
              Shyn AI
            </Heading>
            <Text as="p" size="2">
              {data.message}
            </Text>
          </Flex>
        </Flex>
      ) : null}
      {data.data.status === "COMPLETED" && data.data.data ? (
        <Flex direction="column" align="start" width="100%">
          {itJustSite ? (
            <>
              {scoreSelect}
              <Separator mt="3" size="4" />
              {hasMessage ? null : <TextResult input={data.data.data.site} />}
              <Chart score={score} input={data.data.data.site} />
            </>
          ) : (
            <>
              <Flex width="100%" gap="4" justify="between">
                <Flex align="start" direction="column" gap="1">
                  <Text size="1" weight="bold" color="gray" as="label">
                    Based on
                  </Text>
                  <Select.Root
                    value={tab}
                    onValueChange={(v) => setTab(v as "article" | "site")}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="article">Article</Select.Item>
                      <Select.Item value="site">Website</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                {scoreSelect}
              </Flex>
              <Separator mt="3" size="4" />
              {hasMessage ? null : (
                <TextResult
                  input={data.data.data[tab]}
                  article={tab === "article"}
                />
              )}
              <Chart score={score} input={data.data.data[tab]} />
            </>
          )}
        </Flex>
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

    if (input.factuality.HIGH > thresholds.high) {
      interpretation = `The ${what} appears to be highly credible and trustworthy, with a significant amount of factual content.`;
    } else if (
      input.factuality.HIGH > thresholds.low &&
      input.factuality.MIXED > thresholds.low
    ) {
      interpretation = `The ${what} has a mix of credible and less reliable information. It is recommended to cross-check the facts.`;
    } else if (input.factuality.LOW > thresholds.high) {
      interpretation = `The ${what} is likely to contain unreliable information and should be used with caution for factual references.`;
    } else {
      interpretation = `The ${what} has varying levels of factuality and it may be necessary to consult additional sources for verification.`;
    }

    return interpretation;
  }, [input, article]);

  return (
    <Callout.Root color="gray">
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>{text}</Callout.Text>
    </Callout.Root>
  );
};

const items: Record<keyof Scores, string> = {
  factuality: "Factuality",
  freedom: "Freedom",
  bias: "Bias",
};

const labels: Record<keyof Scores, string[]> = {
  factuality: ["High Factuality", "Mixed Factuality", "Low Factuality"],
  freedom: [
    "Mostly Free",
    "Excellent",
    "Limited Freedom",
    "Total Oppression",
    "Moderate Freedom",
  ],
  bias: [
    "Least Biased",
    "Right",
    "Right Center",
    "Far Right",
    "Far Left",
    "Left Center",
    "Left",
  ],
};

export const Chart: React.FC<{ input: Scores; score: keyof Scores }> = ({
  input,
  score,
}) => {
  const data = React.useMemo(() => {
    const backgroundColor = "#003eeb11"; // A shade of blue
    const borderColor = "#3a5bc7"; // A darker shade of blue

    // Extract the values from the factuality data
    const getScores = (value: keyof Scores) => {
      if (value === "factuality") {
        return [
          input.factuality.HIGH * 100,
          input.factuality.MIXED * 100,
          input.factuality.LOW * 100,
        ];
      }
      if (value === "freedom") {
        return [
          input.freedom.MOSTLY_FREE * 100,
          input.freedom.EXCELLENT * 100,
          input.freedom.LIMITED_FREEDOM * 100,
          input.freedom.TOTAL_OPPRESSION * 100,
          input.freedom.MODERATE_FREEDOM * 100,
        ];
      }
      if (value === "bias") {
        return [
          input.bias.LEAST_BIASED * 100,
          input.bias.RIGHT * 100,
          input.bias.RIGHT_CENTER * 100,
          input.bias.FAR_RIGHT * 100,
          input.bias.FAR_LEFT * 100,
          input.bias.LEFT_CENTER * 100,
          input.bias.LEFT * 100,
        ];
      }
      return [];
    };

    // Structure the data for Chart.js
    const chartData: ChartData<"radar"> = {
      labels: labels[score],
      datasets: [
        {
          label: "Score",
          data: getScores(score),
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };

    return chartData;
  }, [input, score]);

  return (
    <>
      <Radar
        data={data}
        // @ts-expect-error - no types for scale
        options={{ scale: { beginAtZero: true, max: 100 } }}
      />
    </>
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
