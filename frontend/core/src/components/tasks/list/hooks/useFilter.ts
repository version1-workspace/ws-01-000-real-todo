import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { QueryString } from "@/lib/queryString";

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
  projectId?: string;
  date: DateParams;
  order: OrderParams;
  statuses: { [key: string]: boolean };
  limit: number;
  page: number;
}

export type FieldTypes = keyof typeof Fields;
export type OrderType = "asc" | "desc";

const initialValue = {
  text: "",
  page: 1,
  limit: 20,
  projectId: undefined,
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

const mergeValues = (base: Params, obj: Partial<Params>) => {
  const result = JSON.parse(JSON.stringify(base));
  ["text", "page", "limit", "projectId", "statuses"].forEach((key: string) => {
    if (key in obj) {
      result[key] = obj[key as keyof typeof obj];
    }
  });

  if (obj.date && obj.date.type && (obj.date.start || obj.date.end)) {
    result.date = obj.date;
  }

  if (obj.order && obj.order.type && obj.order.value) {
    result.order = obj.order;
  }

  return result;
};

export interface Filter {
  original: Params;
  replica: Params;
  isDateSet: boolean;
  update: (_params: Params) => void;
  save: (_value?: Params) => void;
  reset: () => void;
  resetState: (type: keyof Params) => Params;
}

export default function useFilter(): Filter {
  const searchParams = useSearchParams();

  const qs = useMemo(() => new QueryString(searchParams), [searchParams]);
  const original = useMemo(() => {
    return mergeValues(initialValue, qs.object);
  }, [qs]);

  const [replica, setReplica] = useState<Params>(original);
  const update = (params: Params) => {
    setReplica(params);
  };

  const save = (value?: Params) => {
    const newOriginal = value || replica;

    const newQs = new QueryString(newOriginal);

    history.replaceState(null, "", "?" + newQs.toString());
  };

  const reset = () => {
    setReplica(original);
  };

  const resetState = (type: keyof Params) => {
    const newReplica = {
      ...replica,
      [type]: { ...initialValue }[type],
    };
    save(newReplica);
    return newReplica;
  };

  return {
    original, // 保存された状態
    replica, // 編集中の状態
    isDateSet: !!(original.date.start || original.date.end),
    update,
    save,
    reset,
    resetState,
  };
}
