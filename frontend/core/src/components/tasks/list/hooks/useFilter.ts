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
  onInit?: (params: Params) => Promise<void>;
}

export default function useFilter({ onInit }: Props): Filter {
  const [filterValues, setFilterValues] = useState<{
    original: Params;
    replica: Params;
  }>({
    original: initialValue,
    replica: initialValue,
  });
  const [replica, setReplica] = useState<Params>(initialValue);
  const searchParams = useSearchParams();

  const qs = useMemo(() => new QueryString(searchParams), [searchParams]);

  useEffect(() => {
    const newOriginal = mergeValues(initialValue, qs.object);
    setFilterValues({
      original: newOriginal,
      replica: newOriginal,
    });
    onInit?.(newOriginal);
  }, [searchParams]);

  const save = (value?: Params) => {
    const newOriginal = value || replica;
    setFilterValues({
      ...filterValues,
      original: newOriginal,
    });

    history.replaceState(null, "", "?" + qs.toString());
  };

  const reset = () => {
    setFilterValues({
      ...filterValues,
      replica: filterValues.original,
    });
  };

  const resetState = (type: keyof Params) => {
    const newValue = {
      ...filterValues,
      [type]: { ...initialValue }[type],
    };

    if (type === "text") {
      newValue.original.statuses = { ...initialValue.statuses };
      newValue.replica.statuses = { ...initialValue.statuses };
    }

    setFilterValues(newValue);
    history.replaceState(null, "", "?" + qs.toString());

    return newValue.replica;
  };

  const { original } = filterValues;

  return {
    ready: !!qs,
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
