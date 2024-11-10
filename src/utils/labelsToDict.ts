import { type Label } from "@src/server/backend";

export const labelsToDict = <T extends string>(labels: Label<T>[]): Record<T, number> => {
    const dict: Record<T, number> = {} as Record<T, number>;
    
    for (const label of labels) {
        dict[label.label] = label.score;
    }

    return dict;
}
