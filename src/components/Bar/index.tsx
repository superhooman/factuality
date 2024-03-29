import { Heading, Text } from '@radix-ui/themes';
import * as cls from './styles.css';
import React from 'react';

interface BarProps<T extends string> {
    data: Record<T, number>;
    labels?: Record<T, string>;
    title?: React.ReactNode;
    filter?: boolean;
}

const COLORS = [
    'var(--accent-a5)',
    'var(--blue-a5)',
    'var(--yellow-a5)',
    'var(--green-a5)',
    'var(--mint-a5)',
    'var(--pink-a5)',
    'var(--cyan-a5)',
    'var(--teal-a5)',
    'var(--gold-a5)',
    'var(--purple-a5)',
    'var(--lime-a5)',
    'var(--orange-a5)',
    'var(--sky-a5)',
];

export const Bar = <T extends string>({
    data,
    labels,
    title,
    filter = true,
}: BarProps<T>) => {
    const normalizedData = React.useMemo(() => {
        const max = Math.max(...Object.values<number>(data));
        return Object.entries(data)
            .filter(([, value]) => {
                if (filter) {
                    return (value as number) / max > 0.01;
                }
                return true;
            })
            .reduce((acc, [key, value]) => {
                return {
                    ...acc,
                    [key]: (value as number) / max,
                };
            }, {} as Record<T, number>);
    }, [data, filter]);

    return (
        <div className={cls.root}>
            {title && <Heading size="4">{title}</Heading>}
            {Object.entries(normalizedData).map(([key, value], i) => (
                <div key={key}>
                    <Text weight="medium" size="1">
                        {labels?.[key as T] ?? key}
                    </Text>
                    <div className={cls.wrapper}>
                        <div
                            className={cls.bar}
                            style={{
                                width: `${(value as number) * 100}%`,
                                backgroundColor:
                                    COLORS[
                                        i % COLORS.length
                                    ],
                            }}
                        ></div>
                        <div className={cls.value}>
                            <Text size="1">
                                {((value as number) * 100).toFixed(1)}%
                            </Text>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
