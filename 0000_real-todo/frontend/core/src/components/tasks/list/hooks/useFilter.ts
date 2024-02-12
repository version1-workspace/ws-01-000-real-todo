import { Project } from "@/services/api/models/project";
import { useState } from "react";

export const Fields = {
  deadline: "deadline",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

interface DateParams {
  start?: string;
  end?: string;
  type: FieldTypes;
}

interface OrderParams {
  type: FieldTypes;
  value: OrderType;
}

export interface Params {
  text: string;
  project?: Project;
  date: DateParams;
  order: OrderParams;
  statuses: { [key: string]: boolean };
  limit: number;
}

export type FieldTypes = keyof typeof Fields;
export type OrderType = "asc" | "desc";

const initialValue = {
  text: "",
  limit: 20,
  project: undefined,
  statuses: { scheduled: true },
  date: {
    start: undefined,
    end: undefined,
    type: Fields.deadline as FieldTypes,
  },
  order: {
    type: Fields.deadline as FieldTypes,
    value: "asc" as const,
  },
};

export interface Filter {
  text: string;
  project: Project;
  date: DateParams;
  isDateSet?: boolean;
  order: OrderParams;
  statuses: Record<string, boolean>;
  limit: number;
  replica: Params;
  update: (_params: Params) => void;
  save: (_value?: Params) => void;
  reset: () => void;
  resetState: (type: keyof Params) => Params;
}

export default function useFilter(): Filter {
  const [original, setOriginal] = useState<Params>(initialValue);
  const [replica, setReplica] = useState<Params>(initialValue);

  const save = (value?: Params) => {
    setOriginal(value || replica);
  };

  const reset = () => {
    setReplica(original);
  };

  const resetState = (type: keyof Params) => {
    const newValue = {
      ...original,
      [type]: { ...initialValue }[type],
    };

    if (type === "text") {
      newValue.statuses = { ...initialValue.statuses };
    }

    setOriginal(newValue);
    setReplica(newValue);

    return newValue;
  };

  return {
    text: original.text,
    project: original.project as Project,
    date: original.date,
    order: original.order,
    statuses: original.statuses,
    limit: original.limit,
    isDateSet: !!(original.date.start || original.date.end),
    replica: replica,
    update: setReplica,
    save,
    reset,
    resetState,
  };
}
