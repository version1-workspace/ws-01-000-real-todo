import { useState, useMemo } from "react";
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

interface UrlObject {
  page: number;
  projectId?: string;
  status: string[];
  limit: number;
  search: string;
  sortType: string;
  sortOrder: string;
  dateFrom: string;
  dateTo: string;
  dateType: string;
}

const convertFilterParamsToUrlObject = (params: Params): Partial<UrlObject> => {
  const result: Partial<UrlObject> = {
    page: params.page || 1,
    projectId: params.projectId,
    search: params.text || "",
    limit: params.limit,
    status: Object.keys(params.statuses).filter((key) => params.statuses[key]),
    sortType: params.order.type,
    sortOrder: params.order.value,
  };

  if (params.date.start || params.date.end) {
    result.dateType = params.date.type;
    result.dateFrom = params.date.start || "";
    result.dateTo = params.date.end || "";
  }

  return result;
};

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
  ready: boolean;
  original: Params;
  replica: Params;
  isDateSet: boolean;
  searchURI: string;
  update: (_params: Params) => void;
  save: (_value?: Params) => void;
  reset: () => void;
  resetState: (type: keyof Params) => Params;
}

export default function useFilter(): Filter {
  const [filterValues, setFilterValues] = useState<{
    original: Params;
    replica: Params;
  }>({
    original: initialValue,
    replica: initialValue,
  });
  const searchParams = useSearchParams();

  const qs = useMemo(() => new QueryString(searchParams), [searchParams]);

  const base = useMemo(() => {
    const merged = mergeValues(initialValue, qs.object);
    return {
      original: merged,
      replica: JSON.parse(JSON.stringify(merged)),
    };
  }, [qs]);

  const update = (params: Params) => {
    setFilterValues({
      ...filterValues,
      replica: params,
    });
  };

  const save = (value?: Params) => {
    const newOriginal = value || filterValues.replica;
    setFilterValues({
      ...filterValues,
      original: newOriginal,
    });

    const urlObject = convertFilterParamsToUrlObject(newOriginal);
    const newQs = new QueryString(urlObject);

    history.replaceState(null, "", "?" + newQs.toString());
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
    original: base.original,
    replica: base.replica,
    isDateSet: !!(original.date.start || original.date.end),
    searchURI: qs?.toString() || "",
    update,
    save,
    reset,
    resetState,
  };
}
