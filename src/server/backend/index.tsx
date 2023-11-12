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

export interface Scores {
    label0: number;
    label1: number;
    label2: number;
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