import { env } from "@src/env.mjs";

interface CreateTaskResponse {
    task_id: string;
    message: string;
}

export const createTask = async (url: string) => {
  const response = await fetch(env.BACKEND_BASE_URL + '/factuality/task/submit', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return (await response.json()) as CreateTaskResponse;
}

export interface FactualityScores {
  LOW: number;
  MIXED: number;
  HIGH: number;
}

export interface FreedomScores {
  MOSTLY_FREE: number;
  EXCELLENT: number;
  LIMITED_FREEDOM: number;
  TOTAL_OPPRESSION: number;
  MODERATE_FREEDOM: number;
}

export interface BiasScores {
  LEAST_BIASED: number;
  FAR_RIGHT: number;
  RIGHT: number;
  RIGHT_CENTER: number;
  LEFT: number;
  LEFT_CENTER: number;
  FAR_LEFT: number;
}

export interface GenreScores {
  OPINION: number;
  SATIRE: number;
  REPORTING: number;
}

export interface FramingScores {
  ECONOMIC: number;
  MORALITY: number;
  POLITICAL: number;
  PUBLIC_OPINION: number;
  QUALITY_OF_LIFE: number;
  CULTURAL_IDENTITY: number;
  HEALTH_AND_SAFETY: number;
  CRIME_AND_PUNISHMENT: number;
  SECURITY_AND_DEFENSE: number;
  FAIRNESS_AND_EQUALITY: number;
  CAPACITY_AND_RESOURCES: number;
  EXTERNAL_REGULATION_AND_REPUTATION: number;
  POLICY_PRESCRIPTION_AND_EVALUATION: number;
  LEGALITY_CONSTITUTIONALITY_AND_JURISPRUDENCE: number;
}

export interface ManipulationData {
  DOUBT: number;
  SLOGANS: number;
  STRAW_MAN: number;
  REPETITION: number;
  FLAG_WAVING: number;
  RED_HERRING: number;
  WHATABOUTISM: number;
  APPEAL_TO_TIME: number;
  LOADED_LANGUAGE: number;
  APPEAL_TO_VALUES: number;
  APPEAL_TO_AUTHORITY: number;
  APPEAL_TO_HYPOCRISY: number;
  CONVERSATION_KILLER: number;
  APPEAL_TO_POPULARITY: number;
  GUILT_BY_ASSOCIATION: number;
  'NAME_CALLING-LABELING': number;
  'FALSE_DILEMMA-NO_CHOICE': number;
  'APPEAL_TO_FEAR-PREJUDICE': number;
  CAUSAL_OVERSIMPLIFICATION: number;
  'EXAGGERATION-MINIMISATION': number;
  QUESTIONING_THE_REPUTATION: number;
  'OBFUSCATION-VAGUENESS-CONFUSION': number;
  CONSEQUENTIAL_OVERSIMPLIFICATION: number;
}

export type BiasLabels = 'far-right' | 'right' | 'right-center' | 'center' | 'left-center' | 'left' | 'far-left';
export type FactualityLabels = 'low' | 'mixed' | 'high';
export type FramingLabels = 'Morality' | 'Political' | 'Legality_Constitutionality_and_jurisprudence' | 'Security_and_defense' | 'Fairness_and_equality' | 'External_regulation_and_reputation' | 'Capacity_and_resources' | 'Health_and_safety';
export type GenreLabels = 'opinion' | 'satire' | 'reporting';
export type Persuasion = 'Loaded_Language' | 'Name_Calling-Labeling' | 'Repetition' | 'Exaggeration-Minimisation' | 'Flag_Waving' | 'Appeal_to_Fear-Prejudice';

export interface Label<T> {
    label: T;
    score: number;
}

export interface Scores {
  bias: Label<BiasLabels>[];
  factuality: Label<FactualityLabels>[];
  framing: Label<FramingLabels>[];
  genre: Label<GenreLabels>[];
  persuasion: Label<Persuasion>[];
}

export interface TaskStatusResponse {
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    data?: {
        article: Scores;
        site: Scores;
    };
    error?: {
        message: string;
    }
}

export const getTask = async (id: string) => {
    const response = await fetch(env.BACKEND_BASE_URL + '/factuality/task/' + id, {
        method: "GET",
    });
    
    if (!response.ok) {
        console.log(response);
        throw new Error("Failed to get task");
    }
    
    return (await response.json()) as TaskStatusResponse;
};