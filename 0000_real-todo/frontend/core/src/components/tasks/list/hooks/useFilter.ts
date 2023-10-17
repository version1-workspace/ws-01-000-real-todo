import { useState } from "react";

export const Fields = {
  deadline: "deadline",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

const FieldLabels = {
  deadline: "締切日時",
  createdAt: "作成日時",
  updatedAt: "更新日時",
};

const OrderLabels = {
  asc: "昇順",
  desc: "降順",
};

interface DateParams {
  start?: string;
  end?: string;
  type: FieldTypes;
}

interface OrderParams {
  value: FieldTypes;
  type: OrderType;
}

interface Params {
  text: string;
  date: DateParams;
  order: OrderParams;
  statuses: { [key: string]: boolean };
}

export type FieldTypes = keyof typeof Fields;
export type OrderType = "asc" | "desc";

const initialValue = {
  text: "",
  statuses: { scheduled: true },
  date: {
    start: undefined,
    end: undefined,
    type: Fields.deadline as FieldTypes,
  },
  order: {
    value: Fields.deadline as FieldTypes,
    type: "desc" as OrderType,
  },
};

export default function useFilter() {
  const [original, setOriginal] = useState<Params>(initialValue);
  const [replica, setReplica] = useState<Params>(initialValue);

  const save = () => {
    setOriginal(replica);
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
      newValue.statuses = {...initialValue.statuses}
    }

    setOriginal(newValue);
    setReplica(newValue);
  };

  return {
    text: original.text,
    date: {
      ...original.date,
      typeLabel: FieldLabels[original.date.type],
    },
    isDateSet: original.date.start || original.date.end,
    order: {
      ...original.order,
      label: FieldLabels[original.order.value],
      typeLabel: OrderLabels[original.order.type],
    },
    statuses: original.statuses,
    replica: replica,
    update: setReplica,
    save,
    reset,
    resetState,
  };
}
