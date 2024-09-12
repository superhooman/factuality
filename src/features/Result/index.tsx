'use client';

import {
    AspectRatio,
    Callout,
    Card,
    Flex,
    Grid,
    Heading,
    Inset,
    Select,
    Text,
} from '@radix-ui/themes';
import { Loader, LoadingContainer } from '@src/components/Loading';
import { api } from '@src/trpc/react';
import { type ErrorResult, type SuccessResult } from 'open-graph-scraper';

import * as cls from './styles.css';
import { Favicon } from '@src/components/Favicon';
import {
    CounterClockwiseClockIcon,
    ExclamationTriangleIcon,
    InfoCircledIcon,
} from '@radix-ui/react-icons';
import {
    type FramingScores,
    type GenreScores,
    type ManipulationData,
    type Scores,
} from '@src/server/backend';
import React from 'react';
import { Scale } from '@src/components/Scale';
import { Bar } from '@src/components/Bar';

interface Props {
    taskId: string;
}

// const topics = {
//     "general": "Edition.cnn.com tends to align more with collectivist principles, emphasizing community values and social equality. It supports environmental protection measures and expanded educational opportunities.",
//     "economic": "Edition.cnn.com leans towards left-leaning economic policies, advocating for higher taxes on the wealthy, government spending on social programs and infrastructure, and stronger regulations on businesses.",
//     "education": "Edition.cnn.com favors expanded free, public education and reduced costs or free college, aligning with left-leaning education policies.",
//     "environmental": "Edition.cnn.com supports environmental regulations and acknowledges human influence on climate change, indicating a stance in line with left-leaning environmental policies."
// };

export const Result = ({ taskId }: Props) => {
    const [tab, setTab] = React.useState('article' as 'article' | 'site');
    const [polling, setPolling] = React.useState(true);
    const { data, isLoading } = api.check.result.useQuery(
        { taskId },
        {
            refetchInterval: polling ? 1000 : false,
            onSuccess: (data) => {
                data.data.status === 'COMPLETED' && setPolling(false);
            },
        }
    );

    const itJustSite = React.useMemo(() => {
        if (!data) return;
        const url = new URL(data.url);
        return url.pathname === '/';
    }, [data]);

    if (!data && isLoading) {
        return (
            <Flex
                direction="column"
                height="100%"
                align="center"
                justify="center"
            >
                <LoadingContainer />
            </Flex>
        );
    }

    if (!data) {
        return null;
    }

    // const hasMessage = data.message !== null;

    return (
        <Flex direction="column" height="100%" align="center" grow="1" gap="4">
            <Flex width="100%" align="center" gap="3">
                <Flex shrink="0" p="1" className={cls.favicon}>
                    <Favicon size={32} url={data.url} />
                </Flex>
                <Flex grow="1" direction="column">
                    <Heading size="4">Result</Heading>
                    <Text
                        className={cls.description}
                        as="p"
                        size="2"
                        color="gray"
                    >
                        {data.url}
                    </Text>
                </Flex>
                <Flex align="start" shrink="0" direction="column" gap="1">
                    <Text size="1" weight="bold" color="gray" as="label">
                        Based on
                    </Text>
                    <Select.Root
                        value={tab}
                        onValueChange={(v) => setTab(v as 'article' | 'site')}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Item value="article">Article</Select.Item>
                            <Select.Item value="site">Website</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Flex>
            </Flex>
            {data.data.status !== 'COMPLETED' ? (
                <Flex width="100%" direction="column">
                    {data.data.status === 'PENDING' ? (
                        <Callout.Root color="amber">
                            <Callout.Icon>
                                <CounterClockwiseClockIcon />
                            </Callout.Icon>
                            <Callout.Text>
                                This task is still pending. Please wait a few
                                moments.
                            </Callout.Text>
                        </Callout.Root>
                    ) : null}
                    {data.data.status === 'IN_PROGRESS' ? (
                        <Callout.Root color="amber">
                            <Callout.Icon>
                                <Loader />
                            </Callout.Icon>
                            <Callout.Text>
                                This task is in progress. Please wait a few
                                moments.
                            </Callout.Text>
                        </Callout.Root>
                    ) : null}
                    {data.data.status === 'FAILED' ? (
                        <Callout.Root color="red">
                            <Callout.Icon>
                                <ExclamationTriangleIcon />
                            </Callout.Icon>
                            <Callout.Text>
                                Oops, something went wrong. Please try again
                                later.
                            </Callout.Text>
                        </Callout.Root>
                    ) : null}
                </Flex>
            ) : null}
            {data.data.status === 'COMPLETED' && data.data.data ? (
                <Flex direction="column" align="start" width="100%">
                    {data.topics && tab === 'site' ? (
                        <Grid
                            gap="4"
                            columns={{
                                initial: '1',
                                sm: '2',
                                md: String(Object.keys(data.topics).length),
                            }}
                        >
                            {Object.entries(data.topics).map(([key, value]) => (
                                <Card key={key}>
                                    <Heading mb="1" size="1" weight="bold">
                                        {key.toUpperCase()}
                                    </Heading>
                                    <Text as="p" size="2">
                                        {value}
                                    </Text>
                                </Card>
                            ))}
                        </Grid>
                    ) : null}
                    <Chart input={data.data.data[itJustSite ? 'site' : tab]} />
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

        const what = article ? 'article' : 'website';

        let interpretation = '';

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

const GENRE_LABELS: Record<keyof GenreScores, string> = {
    OPINION: 'Opinion',
    SATIRE: 'Satire',
    REPORTING: 'Reporting',
};

const FRAMING_LABELS: Record<keyof FramingScores, string> = {
    ECONOMIC: 'Economic',
    MORALITY: 'Morality',
    POLITICAL: 'Political',
    PUBLIC_OPINION: 'Public Opinion',
    QUALITY_OF_LIFE: 'Quality of Life',
    CULTURAL_IDENTITY: 'Cultural Identity',
    HEALTH_AND_SAFETY: 'Health and Safety',
    CRIME_AND_PUNISHMENT: 'Crime and Punishment',
    SECURITY_AND_DEFENSE: 'Security and Defense',
    FAIRNESS_AND_EQUALITY: 'Fairness and Equality',
    CAPACITY_AND_RESOURCES: 'Capacity and Resources',
    EXTERNAL_REGULATION_AND_REPUTATION: 'External Regulation and Reputation',
    POLICY_PRESCRIPTION_AND_EVALUATION: 'Policy Prescription and Evaluation',
    LEGALITY_CONSTITUTIONALITY_AND_JURISPRUDENCE:
        'Legality, Constitutionality, and Jurisprudence',
};

export const MANIPULATION_LABELS: Record<keyof ManipulationData, string> = {
    DOUBT: 'Doubt',
    APPEAL_TO_AUTHORITY: 'Appeal to Authority',
    APPEAL_TO_HYPOCRISY: 'Appeal to Hypocrisy',
    APPEAL_TO_POPULARITY: 'Appeal to Popularity',
    APPEAL_TO_TIME: 'Appeal to Time',
    APPEAL_TO_VALUES: 'Appeal to Values',
    RED_HERRING: 'Red Herring',
    REPETITION: 'Repetition',
    SLOGANS: 'Slogans',
    GUILT_BY_ASSOCIATION: 'Guilt by Association',
    FLAG_WAVING: 'Flag Waving',
    WHATABOUTISM: 'Whataboutism',
    QUESTIONING_THE_REPUTATION: 'Questioning the Reputation',
    'EXAGGERATION-MINIMISATION': 'Exaggeration / Minimisation',
    'OBFUSCATION-VAGUENESS-CONFUSION': 'Obfuscation / Vagueness / Confusion',
    CAUSAL_OVERSIMPLIFICATION: 'Causal Oversimplification',
    CONSEQUENTIAL_OVERSIMPLIFICATION: 'Consequential Oversimplification',
    'APPEAL_TO_FEAR-PREJUDICE': 'Appeal to Fear / Prejudice',
    STRAW_MAN: 'Straw Man',
    CONVERSATION_KILLER: 'Conversation Killer',
    LOADED_LANGUAGE: 'Loaded Language',
    'NAME_CALLING-LABELING': 'Name Calling / Labeling',
    'FALSE_DILEMMA-NO_CHOICE': 'False Dilemma / No Choice',
};

export const Chart: React.FC<{ input: Scores }> = ({ input }) => {
    const factuality = React.useMemo(() => {
        const result = input.factuality.HIGH - input.factuality.LOW;

        return (result + 1) / 2;
    }, [input.factuality]);

    const freedom = React.useMemo(() => {
        const result =
            input.freedom.EXCELLENT * 1 +
            input.freedom.MOSTLY_FREE * 0.5 -
            (input.freedom.TOTAL_OPPRESSION * 1 +
                input.freedom.LIMITED_FREEDOM * 0.5);

        return (result + 1) / 2;
    }, [input.freedom]);

    const bias = React.useMemo(() => {
        const result =
            input.bias.FAR_RIGHT * 1 +
            input.bias.RIGHT * 0.666 +
            input.bias.RIGHT_CENTER * 0.333 -
            (input.bias.FAR_LEFT * 1 +
                input.bias.LEFT * 0.666 +
                input.bias.LEFT_CENTER * 0.333);

        return (result + 1) / 2;
    }, [input.bias]);

    return (
        <Flex direction="column" gap="4" py="4" width="100%">
            <Card>
                <Scale
                    showValue
                    value={factuality}
                    title="Factuality"
                    variant="rainbow"
                    ticks={{
                        0: 'Low',
                        0.5: 'Mixed',
                        1: 'High',
                    }}
                />
            </Card>
            <Card>
                <Scale
                    value={freedom}
                    variant="mono"
                    title="Freedom"
                    ticks={{
                        0: 'Total oppression',
                        0.25: 'Limited',
                        0.5: 'Moderate',
                        0.75: 'Mostly free',
                        1: 'Excellent',
                    }}
                />
            </Card>
            <Card>
                <Scale
                    value={bias}
                    variant="blue-red"
                    title="Bias"
                    ticks={{
                        0: 'Far Left',
                        0.166: 'Left Center',
                        0.333: 'Left',
                        0.5: 'Least Biased',
                        0.666: 'Right',
                        0.833: 'Right Center',
                        1: 'Far Right',
                    }}
                />
            </Card>
            <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                {input.genre ? (
                    <Card>
                        <Bar
                            title="Genre"
                            data={input.genre}
                            labels={GENRE_LABELS}
                            filter={false}
                        />
                    </Card>
                ) : null}
                {input.manipulation ? (
                    <Card>
                        <Bar
                            title="Manipulation"
                            data={input.manipulation}
                            labels={MANIPULATION_LABELS}
                        />
                    </Card>
                ) : null}
            </Grid>
            {input.framing ? (
                <Card>
                    <Bar
                        title="Framing"
                        data={input.framing}
                        labels={FRAMING_LABELS}
                    />
                </Card>
            ) : null}
        </Flex>
    );
};

export const OG: React.FC<{ data: ErrorResult | SuccessResult }> = ({
    data,
}) => {
    if (data.error) return null;

    const image = data.result.ogImage?.[0]?.url;

    const title = data.result.ogTitle;

    return (
        <Card size="2" style={{ maxWidth: '100%' }}>
            <Inset clip="padding-box" side="top" pb="current">
                <AspectRatio ratio={16 / 6}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image}
                        alt={title}
                        style={{
                            display: 'block',
                            objectFit: 'cover',
                            width: '100%',
                            backgroundColor: 'var(--gray-5)',
                        }}
                    />
                </AspectRatio>
            </Inset>
            <Flex direction="column" gap="1" pt="3">
                <Heading size="4">{title}</Heading>
                <Flex align="center" gap="2">
                    <Favicon url={data.result.ogUrl!} />
                    <Text
                        className={cls.description}
                        as="p"
                        size="2"
                        color="gray"
                    >
                        {data.result.ogUrl}
                    </Text>
                </Flex>
            </Flex>
        </Card>
    );
};
