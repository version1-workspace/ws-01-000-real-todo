import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
}

export type FieldTypes = keyof typeof Fields;
export type OrderType = "asc" | "desc";

const initialValue = {
  text: "",
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
  ["text", "limit", "projectId", "statuses"].forEach((key: string) => {
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
  ready: boolean;
  text: string;
  projectId?: string;
  date: DateParams;
  isDateSet?: boolean;
  order: OrderParams;
  statuses: Record<string, boolean>;
  limit: number;
  replica: Params;
  searchURI: string;
  update: (_params: Params) => void;
  save: (_value?: Params) => void;
  reset: () => void;
  resetState: (type: keyof Params) => Params;
}

interface Props {
  onInit?: (params: Params) => Promise<void>
}

export default function useFilter({ onInit }: Props): Filter {
  const [ready, setReady] = useState(false)
  const [original, setOriginal] = useState<Params>(initialValue);
  const [replica, setReplica] = useState<Params>(initialValue);
  const [qs, setQs] = useState<QueryString>();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = new QueryString(searchParams);
    setQs(qs);

    const newOriginal = mergeValues(initialValue, qs.object);
    setOriginal(newOriginal);
    setReplica(newOriginal);
    onInit?.(newOriginal);

    setReady(true)
  }, [searchParams]);

  const save = (value?: Params) => {
    const newOriginal = value || replica;
    setOriginal(newOriginal);

    const qs = new QueryString(newOriginal);
    setQs(qs);
    history.replaceState(null, "", "?" + qs.toString());
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
    const qs = new QueryString(newValue);
    setQs(qs);
    history.replaceState(null, "", "?" + qs.toString());

    return newValue;
  };

  return {
    ready,
    text: original.text,
    projectId: original.projectId,
    date: original.date,
    order: original.order,
    statuses: original.statuses,
    limit: original.limit,
    isDateSet: !!(original.date.start || original.date.end),
    replica: replica,
    searchURI: qs?.toString() || "",
    update: setReplica,
    save,
    reset,
    resetState,
  };
}
