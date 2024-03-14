import { Heading, Text } from '@radix-ui/themes';
import * as cls from './styles.css';

type ScaleVariants = 'rainbow' | 'blue-red' | 'mono';

interface ScaleProps {
    value: number;
    ticks?: Record<number, string>;
    variant: ScaleVariants;
    showValue?: boolean;
    title?: React.ReactNode;
}

export const Scale: React.FC<ScaleProps> = ({ value, ticks, variant, showValue, title }) => {
    return (
        <div>
            {title && <Heading size="4">{title}</Heading>}
            <div data-variant={variant} data-show-value={showValue} className={cls.root}>
                <div className={cls.scale}>
                    <div className={cls.dot} style={{ left: `${value * 100}%` }}>
                        {showValue ? <Text weight="bold" className={cls.value} size="3" color="gray">{(value * 100).toFixed(2)}%</Text> : null}
                    </div>
                    {ticks ? Object.entries(ticks).map(([position, label]) => (
                        <div
                            data-start={Number(position) === 0}
                            data-middle={Number(position) === 0.5}
                            data-last={Number(position) === 1}
                            key={position}
                            className={cls.label}
                            style={{ left: `${Number(position) * 100}%` }}
                        >
                            <Text size="1" color="gray">{label}</Text>
                        </div>
                    )) : null}
                </div>
            </div>
        </div>
    )
};
